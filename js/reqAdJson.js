async function reqAdJson(videoId) {
    return new Promise((resolve, reject) => {
        let url = `https://api.nicoad.nicovideo.jp/v1/contents/video/${videoId}`;

        fetch(url).then((response) => {
            return response.json();
        }).then((json) => {
            resolve(json);
        }).catch((err) => {
            reject(err);
            //console.error(`[ERROR] Failed to GET request to ${url}`);
            //console.error('url: ' + url);
            //console.error('err: ', err);
        });
    });
}
