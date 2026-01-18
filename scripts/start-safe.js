const { spawn, execSync } = require('child_process');

console.log('🚀 Starting aggressive safe Expo boot...');

function killGhost() {
  console.log('🧹 Scanning for ghost emulator on port 5554...');
  try {
    const output = execSync('netstat -ano | findstr :5554', { encoding: 'utf8' }).trim();
    if (output) {
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes('LISTENING') || line.includes('ESTABLISHED')) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid) && pid !== '0') {
            console.log(`🔫 Killing ghost process ${pid} on port 5554...`);
            try { execSync(`taskkill /F /PID ${pid} /T`, { stdio: 'ignore' }); } catch (e) { }
          }
        }
      }
    }
  } catch (e) { }
}

try {
  // 1. Kill any existing ADB server
  try { execSync('adb kill-server', { stdio: 'ignore' }); } catch (e) { }

  // 2. Kill the ghost specifically
  killGhost();

  // 3. Final taskkill for anything named adb
  try { execSync('taskkill /F /IM adb.exe /T', { stdio: 'ignore' }); } catch (e) { }

  // 4. Set ALL Environment variables to bypass ADB checks
  process.env.EXPO_NO_ADB = '1';
  process.env.EXPO_ANDROID_SKIP_REVERSE_QUERY = '1';
  process.env.ADB_BIN = 'echo';

  // Clean up ports
  delete process.env.ADB_SERVER_SOCKET;
  delete process.env.ADB_SERVER_PORT;

  console.log('🌍 Starting Expo Tunnel...');

  const expo = spawn('npx', ['expo', 'start', '--tunnel'], {
    stdio: 'inherit',
    shell: true,
    env: process.env
  });

  expo.on('error', (err) => {
    console.error('❌ Failed to start Expo:', err);
  });

} catch (error) {
  console.error('❌ Error during safe boot:', error);
}
Riverside
