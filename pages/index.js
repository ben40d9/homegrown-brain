// Import necessary modules and functions
import { PineconeClient } from "@pinecone-database/pinecone";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { z } from "zod";
import "dotenv/config";
import { readSpreadsheet } from "../src/utils/readSpreadsheet.js";

// Read the data from the spreadsheet
const data = readSpreadsheet("../../tiktok-data.xlsx");
const tiktokData = [data];

// Create the output parser with a Zod schema
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

// Create the chat model
const chatModel = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
  openAIApiKey: `${process.env.OPENAI_API_KEY}`,
});

// Create the output fixing parser
const outputFixingParser = OutputFixingParser.fromLLM(chatModel, outputParser);

const processDataAndIngestToPinecone = async () => {
  // Create a new Pinecone client and initialize it
  const pinecone = new PineconeClient();

  console.log(process.env.PINECONE_ENVIRONMENT);
  console.log(process.env.PINECONE_API_KEY);

  const PINECONE_API_KEY = "0311d5eb-cf36-4c63-b591-66777ba9d7ec";
  const PINECONE_ENVIRONMENT = "tiktok-comments";

  console.log(PINECONE_ENVIRONMENT);
  console.log(PINECONE_API_KEY);

  const init = await pinecone.init({
    environment: `${PINECONE_ENVIRONMENT}`,
    apiKey: `${PINECONE_API_KEY}`,
    namespace: "a006d08",
  });

  console.log(init);
  init.namespace = "a006d08";

  // pinecone.projectName = "";
  // console.log(pinecone.projectName);
};
processDataAndIngestToPinecone();

// const processDataAndIngestToPinecone = async () => {
//   // Create a new Pinecone client and initialize it
//   const client = new PineconeClient();

//   await client.init({
//     environment: `${process.env.PINECONE_ENVIRONMENT}`,
//     apiKey: `${process.env.PINECONE_API_KEY}`,
//   });

//   client.projectName = "";
//   console.log(client.projectName);

//   // Create an index
//   const index = client.Index("tiktok-comments");

//   // Loop over the TikTok data
//   for (const item of tiktokData) {
//     // Create a new LLM chain for each item
//     const chain = new LLMChain({
//       llm: chatModel,
//       prompt: item.comment,
//       outputKey: "records",
//       outputParser: outputFixingParser,
//     });

//     // Call the chain to get the result
//     const result = await chain.call();

//     // Map the result to a vector
//     const vector = result.records.map((record) => record.fields);

//     // Upsert the vector into the Pinecone index
//     await index.upsert({
//       upsertRequest: {
//         vectors: [{ id: item.id, values: vector }],
//         namespace: "",
//       },
//     });
//   }
// };

// // Call the function to process the data and ingest it into Pinecone
// processDataAndIngestToPinecone();
