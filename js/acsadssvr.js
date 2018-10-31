function getAdsAndProcess(video_id, func_process) {
    let url = 'https://api.nicoad.nicovideo.jp/v1/contents/video/' + video_id;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
        switch ( xhr.readyState ) {
            case 0: // non inited
                break;
            case 1: // sending
                break;
            case 2: // waiting response
                break;
            case 3: // receiving
                break;
            case 4: // received
                if( xhr.status == 200 || xhr.status == 304 ) {
                    func_process(xhr.responseText)
                } else {
                    console.error('[ERROR] GET request is failed.');
                    console.error('        url: ' + url);
                    console.error('        status: ' + xhr.statusText );
                }
                break;
        }
    };
    xhr.send(null);

    return;
}
