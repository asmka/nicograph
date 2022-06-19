import { FetchCommentsRequest } from "./api";

main();

function main() {
  const apiData = parseApiData();
  console.debug("apiData: ", apiData);

  const nvComment = apiData.comment.nvComment;
  console.debug("nvComment", nvComment);

  const body: FetchCommentsRequest = {
    params: {
      targets: nvComment.params.targets,
      language: nvComment.params.language,
    },
    threadKey: nvComment.threadKey,
    additionals: {},
  };

  // const fmt: FetchCommentsRequest = nvComment;
  // console.debug("fmt", fmt);

  // fetchComments(apiData);
  nvComment.additionals = {};
  const uri = "https://nvcomment.nicovideo.jp/v1/threads";
  const options = {
    method: "POST",
    headers: new Headers({
      "X-Frontend-Id": "6",
      "X-Frontend-Version": "0",
      "X-Client-Os-Type": "others",
    }),
    // body: JSON.stringify(nvComment),
    body: JSON.stringify(body),
  };
  fetch(uri, options)
    .then((response) => {
      console.debug(response);
      return response.json();
    })
    .then((data) => {
      console.debug(data);
    });
}

function parseApiData() {
  const apiDataValue = document
    .getElementById("js-initial-watch-data")
    ?.getAttribute("data-api-data");
  if (apiDataValue === undefined || apiDataValue === null) {
    throw new Error('"data-api-data" is not exist.');
  }

  return JSON.parse(apiDataValue);
}

// function fetchComments(apiData: any) {
//   const nvComment = apiData.comment.nvComment;
//   console.debug("nvComment", nvComment);
//   const uri = "https://nvcomment.nicovideo.jp/v1/threads";
//   fetch(uri, options)
//     .then((response) => {})
//     .then((data) => {});
//   return fetch();
//
//   // fetch("https://nvcomment.nicovideo.jp/v1/threads", {
//   //   method: "POST",
//   //   mode: "cors",
//   //   cache: "no-cache",
//   //   credentials: "same-origin",
//   //   headers: [("Content-Type": "application/json")],
//   //   redirect: "follow",
//   //   reffferPolicy: "no-referrer",
//   //   body: JSON.stringify(data),
//   // })
//   //   .then((response) => console.log(response.json()))
//   //   .then((data) => console.log(data));
// }
