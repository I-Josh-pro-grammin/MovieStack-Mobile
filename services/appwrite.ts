import {Client, Databases, Query} from 'react-native-appwrite';
// track the searches made by the user

const DATABASE_ID= process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID= process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    //check if a record of that search has already been stored
    //if a document is found increment the searchCount field
    //if no is found create a new document in Appwrite database -> searchCount = 1
     
    const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('query', query)
    ])

    console.log(res);
}

