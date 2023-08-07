import { MongoClient, ServerApiVersion } from "mongodb";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import "dotenv/config";
import { readSpreadsheet } from "../src/utils/readSpreadsheet.js";
import { processData, processJSONData } from "../src/utils/processData.js";
import { readAndProcessJSON } from "../src/utils/processing/jsonProcessor.js";

// Set up Cohere API key and MongoDB Atlas URI.
import { COHERE_API_KEY } from "../src/data/hidden/hiddenenvVars.js";

const NEXT_PUBLIC_COHERE_API_KEY = `${process.env.COHERE_API_KEY}`;
console.log(`env var: ${NEXT_PUBLIC_COHERE_API_KEY}`);
console.log(`The hidden var from the js file : ${COHERE_API_KEY}`);

const cohereApiKey = `${COHERE_API_KEY}`;
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
    const collection = db.collection("main");

    // Read data from a spreadsheet.
    const spreadsheetData = readSpreadsheet("../../tiktok-data.xlsx");
    const processedSpreadsheetData = processData(spreadsheetData);

    // Read and process data from the JSON file.
    const jsonData = readAndProcessJSON("../../data/comments.json");
    const processedJSONData = processJSONData(jsonData);

    // Combine the data from the spreadsheet and the JSON file.
    const combinedData = [...processedSpreadsheetData, ...processedJSONData];

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

    // Initialize vectorStore for similarity search.
    const vectorStore = new MongoDBAtlasVectorSearch(
      new CohereEmbeddings({ apiKey: cohereApiKey }),
      {
        collection: collection,
        indexName: "default",
        textKey: "comment",
        embeddingKey: "embedding",
      }
    );

    //will be our comment test variable for now, until we build out the UI to enter comment
    const comment = "cleaning sud scrub";

    // Perform a similarity search, getting 5 most similar
    // const similarComments = await vectorStore.similaritySearch(comment, 5);

    // console.log(
    //   `The amount of similar comments to '${comment}':`,
    //   similarComments.length
    // );

    // var as the docs does it
    // const relevantDocs = await vectorStore.similaritySearch(comment, (k = 5));

    const relevantDocs = await vectorStore.similaritySearch(comment, 10);

    console.log(
      `The amount of similar comments to '${comment}':`,
      relevantDocs.length
    );

    console.log(
      `The most similar comments to '${comment}':`,
      relevantDocs[0],
      relevantDocs[1],
      relevantDocs[2],
      relevantDocs[3],
      relevantDocs[4],
      relevantDocs[5],
      relevantDocs[6],
      relevantDocs[7],
      relevantDocs[8],
      relevantDocs[9],
      relevantDocs[10]
    );

    // // Retrieve the first 5 documents in the collection.
    // const insertedData = await collection.find({}).limit(5).toArray();
    // console.log("First 5 documents in the collection:", insertedData);

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
