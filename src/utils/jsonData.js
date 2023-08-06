// This function processes the raw data from the spreadsheet.
// It filters out any rows that don't have a value for the Comment or Reply3 fields,
// and it maps the remaining items into a format that can be ingested into the database.
export function processData() {
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
