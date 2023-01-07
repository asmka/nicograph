import { fetchThreads, Thread, NVComment } from "./scripts/api/thread";
import { fetchNicoad } from "./scripts/api/nicoad";
import { CommentGraph } from "./scripts/graph";

chrome.runtime.onMessage.addListener(async (request) => {
  switch (request.message) {
    case "updateCompleted":
    case "activated":
      await drawGraph();
      return;
    default:
      return;
  }
});

let graph: CommentGraph;

async function drawGraph() {
  Promise.all([getThreads(), hasNicoad()]).then(([threads, hasNicoad]) => {
    const target = document.getElementsByClassName("XSlider")[0] as HTMLElement;

    if (graph) {
      graph.elem.remove();
    }
    graph = new CommentGraph(threads, hasNicoad, target);
    target.insertBefore(graph.elem, target.firstChild);
  });
}

async function getThreads(): Promise<Thread[]> {
  const nvComment: NVComment = parseApiData().comment.nvComment;
  const threads = (await fetchThreads(nvComment)).data.threads;
  return threads;
}

async function hasNicoad(): Promise<boolean> {
  const watchId: string = parseApiData().client.watchId;
  return await fetchNicoad(watchId)
    .then((response) => response.data.activePoint > 0)
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
