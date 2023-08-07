// Import necessary dependencies from the MongoDB driver and custom modules.
import { MongoClient, ServerApiVersion } from "mongodb";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import "dotenv/config";
import { ingestDataToMongoDB } from "../src/utils/mongodb/ingestDataToMongoDB.js";
import { mongodbPerformSimilaritySearch } from "../src/utils/mongodb/findSimilarComments.js";
// Set up Cohere API key and MongoDB Atlas URI.

const COHERE_API_KEY = `${process.env.COHERE_API_KEY}`;

// Set up your Cohere API key and MongoDB Atlas URI
const cohereApiKey = COHERE_API_KEY;
const uri = `mongodb+srv://sud-comarkco:sud1234@sudcluster1.44hacv6.mongodb.net/?retryWrites=true&w=majority`;

// Create a new MongoDB client with server API configurations.
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
    apiStrict: false, // apiStrict is set to false.
  },
});

// Define an async function to process and store data in MongoDB and then perform a similarity search.
const processDataAndIngestToMongoDBAndPerformSearch = async () => {
  try {
    // Connect to the MongoDB server.
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    // Get the database and collection where data will be stored.
    const db = client.db("tiktok_attempt1");
    const collection = db.collection("ag5");

    const comment = "cleaning sud scrub";

    mongodbPerformSimilaritySearch();
    console.log(
      `Similarity search complete for ${mongodbPerformSimilaritySearch()}`
    );

    // Ingesting Data to MongoDB
    //commented out for now because we will be using the data that is already in the database
    // ingestDataToMongoDB("cleaning sud scrub");

    // Close the connection to the MongoDB server.
    await client.close();
    console.log("Connection to MongoDB server has been closed");
  } catch (error) {
    // Log any errors.
    console.error("An error occurred:", error);
  }
};

// Run the processDataAndIngestToMongoDBAndPerformSearch function
processDataAndIngestToMongoDBAndPerformSearch().catch(console.error);
