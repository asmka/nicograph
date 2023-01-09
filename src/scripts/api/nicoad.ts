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

// 公式動画の場合、watchIdは'so***'に変換したもの
export function fetchNicoad(watchId: string) {
  const uri = `https://api.nicoad.nicovideo.jp/v1/contents/video/${watchId}`;
  const options = {
    method: "GET",
  };

  return fetch(uri, options);
}
