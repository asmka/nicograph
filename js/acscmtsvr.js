function createCmtReq(thread_id, user_id, user_key, time_range) {
    var req =
        [{
            "ping": {
                "content": "rs:0"
            }
        }, {
            "ping": {
                "content": "ps:0"
            }
        }, {
            "thread": {
                "thread": "1463483922",
                "version": "20090904",
                "language": 0,
                "user_id": 53842185,
                "with_global": 1,
                "scores": 1,
                "nicoru": 0,
                "userkey": "1502173042.~1~MzCxfaTZL7rDZztXT4fhmR3fXdyv-_24iGol36KOkRA"
            }
        }, {
            "ping": {
                "content": "pf:0"
            }
        }, {
            "ping": {
                "content": "ps:1"
            }
        }, {
            "thread_leaves": {
                "thread": "1463483922",
                "language": 0,
                "user_id": 53842185,
                "content": "0-22:100,1000", // the ceiling movie time of seconds
                "scores": 1,
                "nicoru": 0,
                "userkey": "1502173042.~1~MzCxfaTZL7rDZztXT4fhmR3fXdyv-_24iGol36KOkRA"
            }
        }, {
            "ping": {
                "content": "pf:1"
            }
        }, {
            "ping": {
                "content": "rf:0"
            }
        }];
    req[2]['thread']['thread'] = String(thread_id);
    req[2]['thread']['user_id'] = String(user_id);
    req[2]['thread']['userkey'] = String(user_key);
    req[5]['thread_leaves']['thread'] = String(thread_id);
    req[5]['thread_leaves']['user_id'] = String(user_id);
    req[5]['thread_leaves']['content'] = String(time_range);
    req[5]['thread_leaves']['userkey'] = String(user_key);

    return req;
}


function getCmtAndProcess(thread_id, user_id, user_key, time_range, 
        func_process) {
    let req = createCmtReq(thread_id, user_id, user_key, time_range);
    let url = 'https://nmsg.nicovideo.jp/api.json/';
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
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
    xhr.send(JSON.stringify(req));

    return;
}
