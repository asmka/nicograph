export default async function reqVideoDoc(videoId) {
    return new Promise((resolve, reject) => {
        const url = `https://www.nicovideo.jp/watch/${videoId}`;

        fetch(url).then((response) => {
            return response.text();
        }).then((htmlText) => {
            // Convert html text to document
            let parser = new DOMParser();
            let doc = parser.parseFromString(htmlText, 'text/html');
            resolve(doc);
        }).catch((err) => {
            reject(err);
            //console.error(`[ERROR] Failed to GET request to ${url}`);
            //console.error('url: ' + url);
            //console.error('err: ', err);
        });
    });
}
