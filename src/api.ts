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
