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
    (async () => {
      drawGraph(request.url);
    })();
  }
});

let graph: CommentGraph;

async function drawGraph(url: string) {
  const matched = url.match(/https:\/\/www.nicovideo.jp\/watch\/([a-z0-9]+)/);
  if (matched === null) {
    throw Error("url is not valid nicovideo url");
  }
  const videoId = matched[1];

  const videoInfo = await getVideoInfo(videoId);
  Promise.all([getComments(videoInfo), getNicoads(videoInfo)]).then(
    (values) => {
      const commentsResponse = values[0];
      const nicoadResponse = values[1];

      const threads = commentsResponse.data.threads;
      const isNicoad = nicoadResponse.data.activePoint > 0;
      const target = document.getElementsByClassName(
        "XSlider"
      )[0] as HTMLElement;

      if (graph) {
        graph.elem.remove();
      }
      graph = new CommentGraph(threads, isNicoad, target);
      target.insertBefore(graph.elem, target.firstChild);
    }
  );
}

async function getVideoInfo(videoId: string): Promise<FetchVideoInfoResponse> {
  return fetchVideoInfo(videoId)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const responseData: FetchVideoInfoResponse = data;
      return responseData;
    });
}

async function getComments(
  videoInfo: FetchVideoInfoResponse
): Promise<FetchCommentsResponse> {
  return fetchComments(videoInfo)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const responseData: FetchCommentsResponse = data;
      return responseData;
    });
}

async function getNicoads(
  videoInfo: FetchVideoInfoResponse
): Promise<FetchNicoadResponse> {
  return fetchNicoad(videoInfo.data.client.watchId)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const responseData: FetchNicoadResponse = data;
      return responseData;
    });
}
