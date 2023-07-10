import { MongoClient, ServerApiVersion } from "mongodb";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import "dotenv/config";
import { readSpreadsheet } from "../src/utils/readSpreadsheet.js";
import { processData } from "../src/utils/processData.js";
// Replace *** with your actual Cohere API key
const cohereApiKey = "WsQgaveHg37zzlX8dnFDXTxEwovkv8doKw90PfCy";
const uri = `mongodb+srv://sud-comarkco:sud1234@sudcluster1.44hacv6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const processDataAndIngestToMongoDB = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    const db = client.db("tiktok_attempt1");
    const collection = db.collection("main");

    const data = readSpreadsheet("../../tiktok-data.xlsx");
    console.log("Read data from spreadsheet:", data);

    const processedData = processData(data);
    console.log("Processed data:", processedData);

    await MongoDBAtlasVectorSearch.fromTexts(
      processedData.map((item) => item.comment),
      processedData,
      new CohereEmbeddings({ apiKey: cohereApiKey }),
      {
        collection: collection,
        indexName: "default",
        textKey: "comment",
        embeddingKey: "embedding",
      }
    );
    console.log("Data has been successfully inserted into the collection");

    const insertedData = await collection.find({}).limit(5).toArray();
    console.log("First 5 documents in the collection:", insertedData);

    await client.close();
    console.log("Connection to MongoDB server has been closed");
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

processDataAndIngestToMongoDB().catch(console.error);
