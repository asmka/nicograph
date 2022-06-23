export type ForkType = "owner" | "main" | "easy";

export interface GlobalComment {
  id: string;
  count: number;
}

export interface Thread {
  id: string;
  fork: ForkType;
  commentCount: number;
  comments: Comment[];
}

export interface Comment {
  body: string;
  commands: string[];
  id: string;
  isMyPost: boolean;
  isPremium: boolean;
  nicoruCount: number;
  nicoruId: string;
  no: number;
  postedAt: string; // data-time
  score: number;
  source: string; // "nicoru", "leaf", "trank"
  userId: string;
  vposMs: number;
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
  };
  data: {
    globalComments: GlobalComment[];
    threads: Thread[];
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
