// This function categorizes a given comment into one of several predefined categories.
function categorizeComment(comment) {
  // Convert comment to lower case
  const lowerCaseComment = comment.toLowerCase();

  // Define keywords for each category
  const fanKeywords = [
    "love",
    "awesome",
    "great",
    "best",
    "amazing",
    "favorite",
    "😍",
  ];
  const questionKeywords = [
    "who",
    "what",
    "when",
    "where",
    "why",
    "how",
    "?",
    "sudscrub",
  ];
  const supportKeywords = [
    "problem",
    "issue",
    "doesn't work",
    "help",
    "broken",
    "refund",
    "return",
  ];

  // Check if comment contains any of the keywords for each category
  if (fanKeywords.some((keyword) => lowerCaseComment.includes(keyword))) {
    return "Fan Interaction";
  } else if (
    questionKeywords.some((keyword) => lowerCaseComment.includes(keyword))
  ) {
    return "Company Question";
  } else if (
    supportKeywords.some((keyword) => lowerCaseComment.includes(keyword))
  ) {
    return "Customer Support";
  } else {
    // If comment doesn't match any category, categorize as "General"
    return "General";
  }
}

// This function processes the raw data from the spreadsheet.
// It filters out any rows that don't have a value for the Comment or Reply3 fields,
// and it maps the remaining items into a format that can be ingested into the database.
export function processData(data) {
  return data
    .filter((item) => item.Comment.trim() !== "" && item.Reply3.trim() !== "")
    .map((item, index) => {
      return {
        id: index.toString(),
        comment: item.Comment,
        reply: item.Reply3,
        category: categorizeComment(item.Comment),
      };
    });
}

// This function processes the raw data from the JSON file.
// It iterates over each comment, and for each reply to the comment, it creates a new object
// with the comment, reply, unique id, and category, and adds these objects to the processed data array.
export function processJSONData(data) {
  let processedData = [];
  data.forEach((item, index) => {
    item.replies.forEach((reply, replyIndex) => {
      processedData.push({
        id: `${index}-${replyIndex}`, // Create a unique ID for each comment-reply pair
        comment: item.comment,
        reply: reply,
        category: categorizeComment(item.comment), // Replace this with the actual function you're using to categorize comments
      });
    });
  });
  return processedData;
}
