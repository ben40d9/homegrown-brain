import { processData } from "./processData.js";
import { readSpreadsheet } from "./readSpreadsheet.js";

//get all of the data from the spreadsheet
const data = readSpreadsheet("../../tiktok-data.xlsx");
// console.log(data);

// const processedData = processData(data);
// console.log(processedData.vector);
