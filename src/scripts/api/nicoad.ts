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

export function fetchNicoad() {
  const videoId = getVideoId();

  const uri = `https://api.nicoad.nicovideo.jp/v1/contents/video/${videoId}`;
  const options = {
    method: "GET",
  };

  return fetch(uri, options);
}

function getVideoId(): string {
  // const re = "*://www.nicovideo.jp/watch/*";
  const commonHeader = document
    .getElementById("CommonHeader")
    ?.getAttribute("data-common-header");
  if (commonHeader === undefined || commonHeader === null) {
    throw new Error('"data-common-header" is not exist.');
  }
  const nextUrl = JSON.parse(commonHeader).initConfig.customization.nextUrl;
  const videoId = nextUrl.match(/sm.*/);

  return videoId;
}
