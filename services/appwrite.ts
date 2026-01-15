import { Account, Client, Databases, ID, Query } from 'react-native-appwrite';
// track the searches made by the user

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVES_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', query)
    ])

    if (res.documents.length > 0) {
      const searchDoc = res.documents[0];
      await database.updateDocument(
        DATABASE_ID, COLLECTION_ID, searchDoc.$id, {
        count: searchDoc.count + 1
      }
      )
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: 'https://image.tmdb.org/t/p/w500' + movie.poster_path
      })
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc('count')
    ])

    return res.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const createUser = async (email: string, username: string, password: string) => {
  try {
    const user = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    // After creating the account, we automatically log them in
    await loginUser(email, password);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    // Check if a session already exists to avoid conflict
    try {
      await account.deleteSession('current');
    } catch { }

    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const logoutUser = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
}

export const saveMovie = async (movie: MovieDetails) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    return await database.createDocument(DATABASE_ID, SAVES_COLLECTION_ID, ID.unique(), {
      userId: user.$id,
      movieId: movie.id.toString(),
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date
    });
  } catch (error) {
    console.error('Error saving movie:', error);
    throw error;
  }
}

export const unsaveMovie = async (documentId: string) => {
  try {
    return await database.deleteDocument(DATABASE_ID, SAVES_COLLECTION_ID, documentId);
  } catch (error) {
    console.error('Error unsaving movie:', error);
    throw error;
  }
}

export const getSavedMovies = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const res = await database.listDocuments(DATABASE_ID, SAVES_COLLECTION_ID, [
      Query.equal('userId', user.$id),
      Query.orderDesc('$createdAt')
    ]);

    return res.documents;
  } catch (error) {
    console.error('Error getting saved movies:', error);
    return [];
  }
}

export const isMovieSaved = async (movieId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const res = await database.listDocuments(DATABASE_ID, SAVES_COLLECTION_ID, [
      Query.equal('userId', user.$id),
      Query.equal('movieId', movieId.toString())
    ]);

    return res.documents.length > 0 ? res.documents[0] : null;
  } catch (error) {
    console.error('Error checking if movie is saved:', error);
    return null;
  }
}
