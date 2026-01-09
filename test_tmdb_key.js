const https = require('https');
const fs = require('fs');

try {
  const content = fs.readFileSync('.env', 'utf8');
  let apiKey = '';
  content.split('\n').forEach(line => {
    if (line.trim().startsWith('EXPO_PUBLIC_MOVIE_API_KEY=')) {
      apiKey = line.split('=')[1].trim();
    }
  });

  if (!apiKey) {
    console.error('API Key not found in .env');
    process.exit(1);
  }

  const options = {
    hostname: 'api.themoviedb.org',
    path: '/3/search/movie?query=demon',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    let data = '';
    res.on('data', d => {
      data += d;
    });
    res.on('end', () => {
      console.log('Response Snippet:', data.substring(0, 100));
      try {
        const json = JSON.parse(data);
        if (json.results && json.results.length > 0) {
          console.log(`Success! Found ${json.results.length} movies.`);
        } else {
          console.log('Success, but no movies found (or error in response structure).');
        }
      } catch (e) {
        console.log('Could not parse JSON');
      }
    });
  });

  req.on('error', error => {
    console.error(error);
  });

  req.end();
} catch (err) {
  console.error(err);
}
