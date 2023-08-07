//this file is going to be our similarity search function for mongodb
import { MongoClient, ServerApiVersion } from "mongodb";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import "dotenv/config";

import { COHERE_API_KEY } from "../../data/hidden/hiddenenvVars.js";

const NEXT_PUBLIC_COHERE_API_KEY = `${process.env.COHERE_API_KEY}`;
console.log(`env var: ${NEXT_PUBLIC_COHERE_API_KEY}`);
console.log(`The hidden var from the js file : ${COHERE_API_KEY}`);

const cohereApiKey = `${COHERE_API_KEY}`;

// Set up your Cohere API key and MongoDB Atlas URI
// const cohereApiKey = COHERE_API_KEY;
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

// Define an async function to perform a similarity search on data in mongodb
export const mongodbPerformSimilaritySearch = async (comment) => {
  try {
    // Connect to the MongoDB server.
    await client.connect();
    console.log(
      "Similarity Function Code is connected successfully to MongoDB server"
    );

    // Get the database and collection where data will be stored.
    const db = client.db("tiktok_attempt1");
    const collection = db.collection("ag5");

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

    // will be our comment test variable for now, until we build out the UI to enter comment
    const comment = "cleaning sud scrub";

    // Perform a similarity search, getting the 10 most similar comments to the comment variable
    const relevantDocs = await vectorStore.similaritySearch(comment, 10);

    // Log the amount of similar comments to the comment variable
    console.log(
      `The amount of similar comments to '${comment}':`,
      relevantDocs.length
    );

    // Log the 10 most similar comments to the comment variable
    console.log(
      `The most similar comments to '${comment}':`,
      `# 1: "${relevantDocs[0].pageContent}"`,
      `# 2: "${relevantDocs[1].pageContent}"`,
      `# 3: "${relevantDocs[2].pageContent}"`,
      `# 4: "${relevantDocs[3].pageContent}"`,
      `# 5: "${relevantDocs[4].pageContent}"`,
      `# 6: "${relevantDocs[5].pageContent}"`,
      `# 7: "${relevantDocs[6].pageContent}"`,
      `# 8: "${relevantDocs[7].pageContent}"`,
      `# 9: "${relevantDocs[8].pageContent}"`,
      `# 10: "${relevantDocs[9].pageContent}"`
    );
  } catch (error) {
    // Log any errors.
    console.error("An error occurred:", error);
  }
};

// Run the processDataAndIngestToMongoDBAndPerformSearch function
mongodbPerformSimilaritySearch().catch(console.error);
