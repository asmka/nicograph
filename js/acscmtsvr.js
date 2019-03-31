function createCmtReq(threadId, userId, userKey, timeRange) {
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
    req[2]['thread']['thread'] = String(threadId);
    req[2]['thread']['user_id'] = String(userId);
    req[2]['thread']['userkey'] = String(userKey);
    req[5]['thread_leaves']['thread'] = String(threadId);
    req[5]['thread_leaves']['user_id'] = String(userId);
    req[5]['thread_leaves']['content'] = String(timeRange);
    req[5]['thread_leaves']['userkey'] = String(userKey);

    return req;
}


function getCmtAndProcess(threadId, userId, userKey, timeRange, callback) {
    const req = createCmtReq(threadId, userId, userKey, timeRange);
    const url = 'https://nmsg.nicovideo.jp/api.json/';
    
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify(req);
    fetch(url, {method: "POST", headers: headers, body: body}).then((response) => {
        return response.json();
    }).then((json) => {
        callback(json);
    }).catch((err) => {
        console.error(`[ERROR] Failed to POST request to ${url}`);
        console.error('url: ' + url);
        console.error('err: ', err);
    });

    return;
}
