// Import necessary modules
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

// MongoDB connection string
const uri =
  "mongodb+srv://sud-comarkco:sud1234@sudcluster1.44hacv6.mongodb.net/?retryWrites=true&w=majority";

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

    for (const item of processedData) {
      const chain = new LLMChain({
        prompt: item.vector[0][0], // Assuming the comment is the first element of the first vector
        outputKey: "records",
        outputParser: outputFixingParser,
      });

      const result = await chain.call();

      const vector = result.records.map((record) => record.fields);

      // Insert the data into MongoDB
      await collection.insertOne({
        id: item.id,
        comment: item.vector[0][0], // Assuming the comment is the first element of the first vector
        response: item.vector[0][1], // Assuming the response is the second element of the first vector
        vector: vector,
      });

      console.log(`Inserted item with id ${item.id} into MongoDB`);
    }
  } catch (error) {
    // Log any errors that occur during processing or inserting data
    console.error(
      "An error occurred while processing or inserting data:",
      error
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("Closed the MongoDB connection");
  }
};

// Call the function directly
processDataAndIngestToMongoDB().catch(console.error);
