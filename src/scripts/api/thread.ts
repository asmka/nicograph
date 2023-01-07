export const ForkType = {
  Owner: "owner",
  Main: "main",
  Easy: "easy",
} as const;
export type ForkType = typeof ForkType[keyof typeof ForkType];

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

export interface NVComment {
  threadKey: string;
  server: string;
  params: {
    targets: Array<{
      id: string;
      fork: ForkType;
    }>;
    language: string;
  };
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
      nvComment: NVComment;
    };
  };
}

export interface FetchThreadsRequest {
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

export interface FetchThreadsResponse {
  meta: {
    status: number;
  };
  data: {
    globalComments: GlobalComment[];
    threads: Thread[];
  };
}

export interface FetchThreadKeyResponse {
  meta: {
    status: number;
  };
  data: {
    threadKey: string;
  };
}

export async function fetchThreadKey(
  videoId: string
): Promise<FetchThreadKeyResponse> {
  const uri = `https://nvapi.nicovideo.jp/v1/comment/keys/thread?videoId=${videoId}`;
  const options: RequestInit = {
    method: "GET",
    headers: new Headers({
      "X-Frontend-Id": "6",
      "X-Frontend-Version": "0",
    }),
  };

  return fetch(uri, options).then((response) => response.json());
}

export async function fetchThreads(
  nvComment: NVComment,
): Promise<FetchThreadsResponse> {
  const uri = "https://nvcomment.nicovideo.jp/v1/threads";
  const body: FetchThreadsRequest = {
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

  return fetch(uri, options).then((response) => response.json());
}
