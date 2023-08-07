import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

// Set up your Cohere API key and MongoDB Atlas URI
import { COHERE_API_KEY } from "../../data/hidden/hiddenenvVars.js";

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

export const maxMarginalRelevanceSearch = async () => {
  try {
    // Connect to the MongoDB server.
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    // Get the database and collection where data will be stored.
    const db = client.db("tiktok_attempt1");
    const collection = db.collection("ag5");

    const vectorStore = new MongoDBAtlasVectorSearch(
      new CohereEmbeddings({ apiKey: cohereApiKey }),
      {
        collection: collection,
        indexName: "default", // The name of the Atlas search index. Defaults to "default"
        textKey: "comment", // The name of the collection field containing the raw content. Defaults to "text"
        embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
      }
    );

    console.log(`Vector Store complete: ${vectorStore}`);

    const comment = "cleaning sud scrub";

    const resultOne = await vectorStore.maxMarginalRelevanceSearch(
      "I love sud scrub",
      {
        k: 4,
        fetchK: 20, // The number of documents to return on initial fetch
      }
    );
    console.log(resultOne);

    // Using MMR in a vector store retriever

    const retriever = await vectorStore.asRetriever({
      searchType: "mmr",
      searchKwargs: {
        fetchK: 20,
        lambda: 0.1,
      },
    });

    const retrieverOutput = await retriever.getRelevantDocuments(
      "I love sud scrub"
    );

    console.log(retrieverOutput);
  } catch (err) {
    console.log(err);
    await client.close();
  }
};

maxMarginalRelevanceSearch();
