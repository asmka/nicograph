export interface FetchNicoadResponse {
  meta: {
    status: number;
  };
  data: {
    id: string;
    title: string;
    targetUrl: string;
    thumbnailUrl: string;
    nonSchemeThumbnail: string;
    tags: string[];
    totalPoint: number;
    activePoint: number;
    publishable: boolean;
    ownerId: number;
    ownerName: string;
    ownerIcon: string;
    decoration: string;
  };
}

export function fetchNicoad(videoId: string) {
  const uri = `https://api.nicoad.nicovideo.jp/v1/contents/video/${videoId}`;
  const options = {
    method: "GET",
  };

  return fetch(uri, options);
}
