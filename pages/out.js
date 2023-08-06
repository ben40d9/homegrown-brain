// // Import necessary dependencies from the MongoDB driver and custom modules.
// import { MongoClient, ServerApiVersion } from "mongodb";
// import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
// import { CohereEmbeddings } from "langchain/embeddings/cohere";
// import "dotenv/config";
// import { readSpreadsheet } from "../src/utils/readSpreadsheet.js";
// import { processData } from "../src/utils/processData.js";
// import { readAndProcessJSON } from "../src/utils/processing/jsonProcessor.js";
// import { processJSONData } from "../src/utils/processData.js";

// // Set up Cohere API key and MongoDB Atlas URI.
// const cohereApiKey = "WsQgaveHg37zzlX8dnFDXTxEwovkv8doKw90PfCy";
// const uri = `mongodb+srv://sud-comarkco:sud1234@sudcluster1.44hacv6.mongodb.net/?retryWrites=true&w=majority`;

// // Create a new MongoDB client with server API configurations.
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: false,
//     deprecationErrors: true,
//     apiStrict: false, // apiStrict is set to false.
//   },
// });

// // Define an async function to process and store data in MongoDB and then perform a similarity search.
// const processDataAndIngestToMongoDBAndPerformSearch = async () => {
//   try {
//     // Connect to the MongoDB server.
//     await client.connect();
//     console.log("Connected successfully to MongoDB server");

//     // Get the database and collection where data will be stored.
//     const db = client.db("tiktok_attempt1");
//     const collection = db.collection("beta");

//     // Read data from a spreadsheet.
//     const spreadsheetData = readSpreadsheet("../../tiktok-data.xlsx");
//     // console.log("Read data from spreadsheet:", spreadsheetData);
//     const processedSpreadsheetData = processData(spreadsheetData);

//     // Read and process data from the JSON file.
//     const jsonData = readAndProcessJSON("../../data/comments.json");
//     const processedJSONData = processJSONData(jsonData);
//     console.log("Processed JSON data:", processedJSONData);

//     // Process the combined data to prepare it for ingestion.
//     const combinedData = processData(spreadsheetData);
//     console.log("Processed data:", combinedData);

//     // Combine the data from the spreadsheet and the JSON file.
//     const processedData = [...combinedData, ...processedJSONData];
//     console.log("Combined data:", processedData);

//     // Generate embeddings for the comments and store them in MongoDB Atlas collection.
//     await MongoDBAtlasVectorSearch.fromTexts(
//       processedData.map((item) => item.comment),
//       processedData,
//       new CohereEmbeddings({ apiKey: cohereApiKey }),
//       {
//         collection: collection,
//         indexName: "default",
//         textKey: "comment",
//         embeddingKey: "embedding",
//       }
//     );
//     console.log("Data has been successfully inserted into the collection");

//     // Initialize vectorStore for similarity search.
//     const vectorStore = new MongoDBAtlasVectorSearch(
//       new CohereEmbeddings({ apiKey: cohereApiKey }),
//       {
//         collection: collection,
//         indexName: "default",
//         textKey: "comment",
//         embeddingKey: "embedding",
//       }
//     );

//     // Perform a similarity search on the comment "I LOVE SUD SCRUB"
//     const similarComments = await vectorStore.similaritySearch(
//       "I LOVE SUD SCRUB",
//       5
//     );
//     console.log(
//       "Five most similar comments to 'I LOVE SUD SCRUB':",
//       similarComments
//     );

//     // Retrieve the first 5 documents in the collection.
//     const insertedData = await collection.find({}).limit(5).toArray();
//     console.log("First 5 documents in the collection:", insertedData);

//     // Close the connection to the MongoDB server.
//     await client.close();
//     console.log("Connection to MongoDB server has been closed");
//   } catch (error) {
//     // Log any errors.
//     console.error("An error occurred:", error);
//   }
// };

// // Run the processDataAndIngestToMongoDBAndPerformSearch function
// processDataAndIngestToMongoDBAndPerformSearch().catch(console.error);

// Import necessary dependencies from the MongoDB driver and custom modules.
import { MongoClient, ServerApiVersion } from "mongodb";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import "dotenv/config";
import { readSpreadsheet } from "../src/utils/readSpreadsheet.js";
import { processData, processJSONData } from "../src/utils/processData.js";
import { readAndProcessJSON } from "../src/utils/processing/jsonProcessor.js";
import { mongodbPerformSimilaritySearch } from "../src/utils/findSimilarComments.js";
// Set up Cohere API key and MongoDB Atlas URI.
const cohereApiKey = "WsQgaveHg37zzlX8dnFDXTxEwovkv8doKw90PfCy";
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

    // Read data from a spreadsheet.
    const spreadsheetData = readSpreadsheet("../../tiktok-data.xlsx");
    const processedSpreadsheetData = processData(spreadsheetData);
    // console.log("Processed spreadsheet data:", processedSpreadsheetData);

    // Read and process data from the JSON file.
    const jsonData = readAndProcessJSON("../../data/comments.json");
    const processedJSONData = processJSONData(jsonData);
    // console.log("Processed JSON data:", processedJSONData);

    // Combine the data from the spreadsheet and the JSON file.
    const combinedData = [...processedSpreadsheetData, ...processedJSONData];
    // console.log("Combined data:", combinedData);

    // Generate embeddings for the comments and store them in MongoDB Atlas collection.
    await MongoDBAtlasVectorSearch.fromTexts(
      combinedData.map((item) => item.comment),
      combinedData,
      new CohereEmbeddings({ apiKey: cohereApiKey }),
      {
        collection: collection,
        indexName: "default",
        textKey: "comment",
        embeddingKey: "embedding",
      }
    );
    console.log("Data has been successfully inserted into the collection");

    mongodbPerformSimilaritySearch();

    // // Retrieve the first 5 documents in the collection.
    // const insertedData = await collection.find({}).limit(5).toArray();
    // console.log("First 5 documents in the collection:", insertedData);

    // // Close the connection to the MongoDB server.
    // await client.close();
    // console.log("Connection to MongoDB server has been closed");
  } catch (error) {
    // Log any errors.
    console.error("An error occurred:", error);
  }
};

// Run the processDataAndIngestToMongoDBAndPerformSearch function
processDataAndIngestToMongoDBAndPerformSearch().catch(console.error);
