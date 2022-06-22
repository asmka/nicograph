type ForkType = "owner" | "main" | "easy";

interface GlobalComment {
  id: number;
}

export interface FetchCommentsRequest {
  params: {
    targets: Array<{
      id: string;
      fork: ForkType;
    }>;
    language: string;
  };
  threadKey: string;
  additionals: {
    when?: number;
  };
}

export interface FetchCommentsResponse {
  meta: {
    status: number;
    data: {
      globalComments: GlobalComment[];
    };
  };
}

export function fetchComments() {
  const apiData = parseApiData();
  const nvComment = apiData.comment.nvComment;

  const uri = "https://nvcomment.nicovideo.jp/v1/threads";
  const body: FetchCommentsRequest = {
    params: nvComment.params,
    threadKey: nvComment.threadKey,
    additionals: {},
  };
  const options = {
    method: "POST",
    headers: new Headers({
      "X-Frontend-Id": "6",
      "X-Frontend-Version": "0",
    }),
    body: JSON.stringify(body),
  };

  return fetch(uri, options);
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
