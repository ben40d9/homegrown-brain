# Homegrown Brain

Welcome to the Homegrown Brain project! This application is designed to process, categorize, and ingest data from a spreadsheet into a MongoDB database. The data represents a series of comments and responses from a TikTok post. The goal of this project is to structure and store this data in a way that's easy to access, analyze, and apply for automatic response generation.

## Functionality

The application works in several steps:

1. **Reading the Spreadsheet:** The application begins by reading an Excel spreadsheet using the `readSpreadsheet.js` utility. This utility uses the `xlsx` library to read the spreadsheet and convert the first sheet into a JSON object.

2. **Processing the Data:** The `processData.js` utility then takes this JSON object and processes it. It filters out any rows that don't have a value for the 'Comment' or 'Reply3' fields, and then maps the data to a new format that's suitable for our MongoDB database. During this step, comments are also categorized into predefined categories for better organization.

3. **Connecting to MongoDB:** Using the MongoDB Node.js driver, the application connects to a MongoDB server. The connection string and server API version are specified in the `mongo.js` file.

4. **Generating Embeddings:** The application uses the Cohere API to generate embeddings for each comment. These embeddings capture the semantic meaning of the comments and are used for semantic search functionality.

5. **Ingesting the Data:** The application then ingests the processed data and the generated embeddings into the MongoDB database using MongoDB Atlas Vector Search. This ensures that the data can be semantically searched later on.

6. **Verifying the Insertion:** The application retrieves and prints the first 5 documents in the collection to verify the successful insertion of data.

## Intended Use

This application is intended as a robust and efficient solution for processing, categorizing, embedding, and storing TikTok comment data in a MongoDB database. This structured and embedded data will allow semantic search for similar comments and can be used for automated response generation by mimicking the responses to similar comments found in the database.

The application is designed to be flexible and adaptable. The `readSpreadsheet.js` and `processData.js` utilities can be modified to handle different spreadsheet formats or data processing requirements. The MongoDB connection settings and embedding generation can be adjusted to suit different databases or data structures.

## Future Work

While the application is currently functional, there are several areas where it could be improved:

- **Error Handling:** More comprehensive error handling could be added to catch and handle any errors that might occur during the reading, processing, and inserting of data.

- **Code Review:** The code could benefit from a review by another developer. They might be able to spot any issues or areas for improvement that have been missed.

- **Documentation:** More detailed documentation could be added to explain how each part of the application works and how to use it.

- **Unit Testing:** Unit tests could be added to ensure that each part of the application is working correctly.

- **Security:** The security of the MongoDB connection could be improved by storing the connection string in an environment variable instead of in the code.

- **Performance:** The performance of the application could be improved by optimizing the data processing and ingestion processes.

I hope you find this application useful and keep an eye out to see how it evolves in the future!
