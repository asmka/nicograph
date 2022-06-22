import { fetchComments } from "./api";

main();

function main() {
  fetchComments()
    .then((response) => {
      console.debug(response);
      return response.json();
    })
    .then((data) => {
      console.debug(data);
    });
}
