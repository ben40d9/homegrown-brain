export function processData(data) {
  return (
    data

      // Remove any rows that don't have a value for the Comment or Reply3 fields
      .filter((item) => item.Comment.trim() !== "" && item.Reply3.trim() !== "")
      .map((item, index) => {
        // console.log(
        //   `Processing item ${index}: Comment = ${item.Comment}, Reply3 = ${item.Reply3}`
        // );
        return {
          id: index.toString(),
          vector: [
            data.map((item) => {
              return [item.Comment, item.Reply3];
            }),
          ],
        };
      })
  );
}
