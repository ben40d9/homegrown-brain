import { MongoClient, ServerApiVersion } from "mongodb";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { z } from "zod";
import "dotenv/config";
import { readSpreadsheet } from "../src/utils/readSpreadsheet.js";
import { processData } from "../src/utils/processData.js"; // Assuming processData is exported from this file

const pw = process.env.MONGO_URI_PW;

// MongoDB connection string
const uri = `mongodb+srv://sud-comarkco:sud1234@sudcluster1.44hacv6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Define the schema for the data
const outputParser = StructuredOutputParser.fromZodSchema(
  z
    .array(
      z.object({
        fields: z.object({
          comment: z.string().describe("The comment made on the TikTok post"),
          response: z.string().describe("The response to the comment"),
        }),
      })
    )
    .describe(
      "An array of objects, each representing a TikTok comment and its response"
    )
);

// Define the output fixing parser
const outputFixingParser = OutputFixingParser.fromLLM(ChatOpenAI, outputParser);

const processDataAndIngestToMongoDB = async () => {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to MongoDB server");
  } catch (error) {
    // Log any errors that occur during connection
    console.error("An error occurred while connecting to MongoDB:", error);
    return;
  }

  try {
    // Get the database and collection
    const db = client.db("tiktok");
    const collection = db.collection("comments");

    // Get all of the data from the spreadsheet
    const data = readSpreadsheet("../../tiktok-data.xlsx");
    console.log("Read data from spreadsheet");

    // Process the data
    const processedData = processData(data);
    console.log(processedData);

    // Insert the processed data into the collection
    const insertResult = await collection.insertMany(processedData);
    console.log("Data has been successfully inserted into the collection");

    // Get the inserted data
    const insertedData = await collection
      .find({ _id: { $in: insertResult.insertedIds } })
      .toArray();
    console.log("Inserted data:", insertedData);

    // Check that the inserted data contains text
    for (const doc of insertedData) {
      if (!doc.text) {
        console.log("Document does not contain text:", doc);
      } else {
        console.log("Document contains text:", doc);
      }
    }

    // Close the connection
    await client.close();
    console.log("Connection to MongoDB server has been closed");
  } catch (error) {
    // Log any errors that occur during data processing or insertion
    console.error("An error occurred:", error);
  }
};

processDataAndIngestToMongoDB().catch(console.error);
