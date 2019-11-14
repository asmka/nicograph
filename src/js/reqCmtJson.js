function createCmtReqUser(threadId, userId, userKey, timeRange) {
    var req = [
        {
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
                "user_id": "53842185",
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
                "user_id": "53842185",
                "content": "0-22:100,1000", // The ceiling movie time of seconds
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
        }
    ];

    req[2]['thread']['thread'] = String(threadId);
    req[2]['thread']['user_id'] = String(userId);
    req[2]['thread']['userkey'] = String(userKey);

    req[5]['thread_leaves']['thread'] = String(threadId);
    req[5]['thread_leaves']['user_id'] = String(userId);
    req[5]['thread_leaves']['content'] = String(timeRange);
    req[5]['thread_leaves']['userkey'] = String(userKey);

    return req;
}


function createCmtReqChannel(threadId1, threadId2, threadKey, force184, userId, userKey, timeRange) {
    var req = [
        {
            "ping": {
                "content": "rs:0"
            }
        }, {
            "ping": {
                "content": "ps:0"
            }
        }, {
            "thread": {
                "thread": "1501742473",
                "version": "20090904",
                "language": 0,
                "user_id": "53842185",
                "with_global": 1,
                "scores": 1,
                "nicoru": 0,
                "userkey": "1502173804.~1~fwFqcTlwtEbO4ggddXkZLdbowXV9TrcE_NTbhDTmFlo"
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
                "thread": "1501742473",
                "language": 0,
                "user_id": "53842185",
                "content": "0-13:100,1000",
                "scores": 1,
                "nicoru": 0,
                "userkey": "1502173804.~1~fwFqcTlwtEbO4ggddXkZLdbowXV9TrcE_NTbhDTmFlo"
            }
        }, {
            "ping": {
                "content": "pf:1"
            }
        }, {
            "ping": {
                "content": "ps:2"
            }
        }, {
            "thread": {
                "thread": "1501742474",
                "version": "20090904",
                "language": 0,
                "user_id": "53842185",
                "force_184": "1",
                "with_global": 1,
                "scores": 1,
                "nicoru": 0,
                "threadkey": "1502173806.e_qPpM9yX3kUgW80nVYo32EdDCU"
            }
        }, {
            "ping": {
                "content": "pf:2"
            }
        }, {
            "ping": {
                "content": "ps:3"
            }
        }, {
            "thread_leaves": {
                "thread": "1501742474",
                "language": 0,
                "user_id": "53842185",
                "content": "0-13:100,1000",
                "scores": 1,
                "nicoru": 0,
                "force_184": "1",
                "threadkey": "1502173806.e_qPpM9yX3kUgW80nVYo32EdDCU"
            }
        }, {
            "ping": {
                "content": "pf:3"
            }
        }, {
            "ping": {
                "content": "rf:0"
            }
        }
    ];

    req[2]['thread']['thread'] = String(threadId1);
    req[2]['thread']['user_id'] = String(userId);
    req[2]['thread']['userkey'] = String(userKey);

    req[5]['thread_leaves']['thread'] = String(threadId1);
    req[5]['thread_leaves']['user_id'] = String(userId);
    req[5]['thread_leaves']['content'] = String(timeRange);
    req[5]['thread_leaves']['userkey'] = String(userKey);

    req[8]['thread']['thread'] = String(threadId2);
    req[8]['thread']['user_id'] = String(userId);
    req[8]['thread']['force_184'] = String(force184);
    req[8]['thread']['threadkey'] = String(threadKey);

    req[11]['thread_leaves']['thread'] = String(threadId2);
    req[11]['thread_leaves']['user_id'] = String(userId);
    req[11]['thread_leaves']['content'] = String(timeRange);
    req[11]['thread_leaves']['force_184'] = String(force184);
    req[11]['thread_leaves']['threadkey'] = String(threadKey);

    return req;
}


async function reqThreadKey(threadId) {
    return new Promise((resolve, reject) => {
        const url = `https://flapi.nicovideo.jp/api/getthreadkey?thread=${threadId}`;

        fetch(url).then((response) => {
            return response;
        }).then((text) => {
            resolve(text);
        }).catch((err) => {
            reject(err);
            //console.error(`[ERROR] Failed to GET request to ${url}`);
            //console.error('url: ' + url);
            //console.error('err: ', err);
        });
    });
}


async function reqCmtSvr(req) {
    return new Promise((resolve, reject) => {
        const url = 'https://nmsg.nicovideo.jp/api.json/';
        const headers = {'Content-Type': 'application/json'};
        const body = JSON.stringify(req);

        fetch(url, {method: "POST", headers: headers, body: body}).then((response) => {
            return response;
        }).then((json) => {
            resolve(json);
        }).catch((err) => {
            reject(err);
            //console.error(`[ERROR] Failed to POST request to ${url}`);
            //console.error('url: ' + url);
            //console.error('err: ', err);
        });
    });
}


export default async function reqCmtJson(dataObj, timeRange) {
    // Extract information to access the comment server
    const userId = dataObj['viewer']['id'];
    const userKey = dataObj['context']['userkey'];
    const threads = dataObj['commentComposite']['threads'];

    // Generate request JSON to comment server
    let req = null;
    if (threads.length >= 3) {
        // Channel video (workaround)
        const threadId1 = threads[1]['id'];
        const threadId2 = threads[2]['id'];
        const keys = await reqThreadKey(threadId2).split('&');
        const threadKey = keys[0];
        const force184 = keys[1];
        req = createCmtReqChannel(threadId1, threadId2, threadKey, force184, userId, userKey, timeRange);
    } else {
        // User video (workaround)
        const threadId = threads[0]['id'];
        req = createCmtReqUser(threadId, userId, userKey, timeRange);
    }

    let cmtJson = await reqCmtSvr(req);

    return cmtJson;
}
