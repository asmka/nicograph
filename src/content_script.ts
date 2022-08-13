import {
  fetchVideoInfo,
  fetchComments,
  FetchVideoInfoResponse,
  FetchCommentsResponse,
} from "./scripts/api/comment";
import { fetchNicoad, FetchNicoadResponse } from "./scripts/api/nicoad";
import { CommentGraph } from "./scripts/graph";

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "movie_loaded") {
    drawGraph(request.url);
  }
});

let graph: CommentGraph;

function drawGraph(url: string) {
  const matched = url.match(/sm[0-9]+/);
  if (matched === null) {
    throw Error("url is not valid nicovideo url");
  }
  const videoId = matched[0];

  Promise.all([getComments(videoId), getNicoads(videoId)]).then((values) => {
    const commentsResponse = values[0];
    const nicoadResponse = values[1];

    const threads = commentsResponse.data.threads;
    const isNicoad = nicoadResponse.data.activePoint > 0;
    const target = document.getElementsByClassName("XSlider")[0] as HTMLElement;

    if (graph) {
      graph.elem.remove();
    }
    graph = new CommentGraph(threads, isNicoad, target);
    target.insertBefore(graph.elem, target.firstChild);
  });
}

async function getComments(videoId: string): Promise<FetchCommentsResponse> {
  const videoInfoResponse = await fetchVideoInfo(videoId)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const responseData: FetchVideoInfoResponse = data;
      return responseData;
    });

  return fetchComments(videoInfoResponse)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const responseData: FetchCommentsResponse = data;
      return responseData;
    });
}

async function getNicoads(videoId: string): Promise<FetchNicoadResponse> {
  return fetchNicoad(videoId)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const responseData: FetchNicoadResponse = data;
      return responseData;
    });
}
