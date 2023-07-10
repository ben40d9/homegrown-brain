// Importing necessary dependencies from the MongoDB driver and your own custom modules
import { MongoClient, ServerApiVersion } from "mongodb";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import "dotenv/config";
import { readSpreadsheet } from "../src/utils/readSpreadsheet.js";
import { processData } from "../src/utils/processData.js";

// Set up your Cohere API key and MongoDB Atlas URI
const cohereApiKey = "WsQgaveHg37zzlX8dnFDXTxEwovkv8doKw90PfCy";
const uri = `mongodb+srv://sud-comarkco:sud1234@sudcluster1.44hacv6.mongodb.net/?retryWrites=true&w=majority`;

// Create a new MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Define an async function that processes data and ingests it into MongoDB
const processDataAndIngestToMongoDB = async () => {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    // Get the database and collection where the data will be stored
    const db = client.db("tiktok_attempt1");
    const collection = db.collection("hero");

    // Read data from a spreadsheet
    const data = readSpreadsheet("../../tiktok-data.xlsx");
    console.log("Read data from spreadsheet:", data);

    // Process the data to prepare it for ingestion
    const processedData = processData(data);
    console.log("Processed data:", processedData);

    // Generate embeddings for the comments and store them in the MongoDB Atlas collection
    await MongoDBAtlasVectorSearch.fromTexts(
      processedData.map((item) => item.comment), // Extract comments from the processed data
      processedData, // Use the processed data as metadata
      new CohereEmbeddings({ apiKey: cohereApiKey }), // Use the Cohere API to generate embeddings
      {
        collection: collection,
        indexName: "default",
        textKey: "comment",
        embeddingKey: "embedding",
      }
    );
    console.log("Data has been successfully inserted into the collection");

    // Retrieve the first 5 documents in the collection
    const insertedData = await collection.find({}).limit(5).toArray();
    console.log("First 5 documents in the collection:", insertedData);

    // Close the connection to the MongoDB server
    await client.close();
    console.log("Connection to MongoDB server has been closed");
  } catch (error) {
    // Log any errors that occur
    console.error("An error occurred:", error);
  }
};

// Run the processDataAndIngestToMongoDB function
processDataAndIngestToMongoDB().catch(console.error);
