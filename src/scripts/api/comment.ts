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

export interface FetchVideoInfoResponse {
  meta: {
    status: number;
  };
  data: {
    client: {
      nicosid: string;
      watchId: string;
      watchTrackId: string;
    };
    comment: {
      nvComment: {
        threadKey: string;
        server: string;
        params: {
          targets: Array<{
            id: string;
            fork: ForkType;
          }>;
          language: string;
        };
      };
    };
  };
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

export async function fetchVideoInfo(videoId: string): Promise<Response> {
  // 通常動画(smあり)の場合はリクエストヘッダーにX-Frontend-IdとX-Frontend-Versionが必要
  // 公式動画(smなし)の場合はクエリパラメータに_frontendIdと_frontendVersionが必要
  // 冗長だが、両パラメータを含めることで両対応する

  const actionTrackId =
    Math.floor(Math.random() * (10 ** 12 - 10 ** 11) + 10 ** 11).toString() +
    "_" +
    Math.floor(Math.random() * (10 ** 14 - 10 ** 13) + 10 ** 13).toString();

  // Ex1. https://www.nicovideo.jp/api/watch/v3/sm32616754?actionTrackId=524752859435_76330043291330
  // Ex2. https://www.nicovideo.jp/api/watch/v3/1658885530?_frontendId=6&_frontendVersion=0&actionTrackId=Omel7iuW9p_1660416244073
  const uri = `https://www.nicovideo.jp/api/watch/v3/${videoId}?_frontendId=6&_frontendVersion=0&actionTrackId=${actionTrackId}`;
  const options = {
    method: "POST",
    headers: new Headers({
      "X-Frontend-Id": "6",
      "X-Frontend-Version": "0",
    }),
  };

  return fetch(uri, options);
}

export async function fetchComments(
  videoInfo: FetchVideoInfoResponse
): Promise<Response> {
  const uri = 'https://nv-comment.nicovideo.jp/v1/threads';
  const body: FetchCommentsRequest = {
    params: videoInfo.data.comment.nvComment.params,
    threadKey: videoInfo.data.comment.nvComment.threadKey,
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
