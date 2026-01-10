import { Client, Databases, ID, Query } from 'react-native-appwrite';
// track the searches made by the user

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  
  try {
    const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', query)
    ])
    //check if a record of that search has already been stored
    
    //if a document is found increment the searchCount field
    if (res.documents.length > 0) {
      const searchDoc = res.documents[0];
      
      await database.updateDocument(
        DATABASE_ID, COLLECTION_ID, searchDoc.$id, {
          count: searchDoc.count + 1
        }
      )
    } else {
      //if no document is found create a new document in Appwrite database -> searchCount = 1
      database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
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
      Query.orderAsc('count')
    ])

    return res.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    throw error;
  }
}