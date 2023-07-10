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

// export function processData(data) {
//   return (
//     data

//       // Remove any rows that don't have a value for the Comment or Reply3 fields
//       .filter((item) => item.Comment.trim() !== "" && item.Reply3.trim() !== "")
//       .map((item, index) => {
//         // console.log(
//         //   `Processing item ${index}: Comment = ${item.Comment}, Reply3 = ${item.Reply3}`
//         // );
//         return {
//           id: index.toString(),
//           vector: [
//             data.map((item) => {
//               return [item.Comment, item.Reply3];
//             }),
//           ],
//         };
//       })
//   );
// }
