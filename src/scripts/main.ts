import { fetchComments, FetchCommentsResponse } from "./api/comment";
import { fetchNicoad, FetchNicoadResponse } from "./api/nicoad";
import { drawGraph } from "./graph";

main();

function main() {
  Promise.all([
    fetchComments()
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const responseData: FetchCommentsResponse = data;
        return responseData;
      }),
    fetchNicoad()
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const responseData: FetchNicoadResponse = data;
        return responseData;
      }),
  ]).then((values) => {
    const commentsResponse = values[0];
    const nicoadResponse = values[1];

    const threads = commentsResponse.data.threads;
    const isNicoad = nicoadResponse.data.activePoint > 0;
    drawGraph(threads, isNicoad);
  });
}
