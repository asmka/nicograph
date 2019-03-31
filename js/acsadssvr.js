function getAdsAndProcess(videoId, callback) {
    let url = `https://api.nicoad.nicovideo.jp/v1/contents/video/${videoId}`;

    fetch(url).then((response) => {
        return response.json();
    }).then((json) => {
        callback(json);
    }).catch((err) => {
        console.error(`[ERROR] Failed to GET request to ${url}`);
        console.error('url: ' + url);
        console.error('err: ', err);
    });

    return;
}
