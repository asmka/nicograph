function drawGraph(sld, cmtCnts) {
    // Draw destination
    let sldRect = sld.getBoundingClientRect();
    let sumCmt = 0;
    let maxCnt = 0;

    // Sum all comments
    for(let i=0; i<cmtCnts.length; i++) {
        if(cmtCnts[i] > maxCnt) {
            maxCnt = cmtCnts[i];
        }
        sumCmt += cmtCnts[i];
    }
    if (maxCnt == 0) maxCnt = 1;
        
    // Insert a graph element
    const graphId= 'CmtGraph';
    let graphElem = document.getElementById(graphId);
    // Remove before graph
    if (graphElem) {
        graphElem.remove();
    }
    graphElem = document.createElement('div');
    graphElem.id = graphId;
    graphElem.style.display = 'flex';
    graphElem.style['flex-direction'] = 'row';
    sld.insertBefore(graphElem, sld.firstChild);

    // Create comment rectangles
    let baseWidth = sldRect.width / cmtCnts.length;
    let frag = document.createDocumentFragment();
    for(let i=0; i<cmtCnts.length; i++) {
        // Create a rectangle element
        let e = document.createElement('div');
        e.style.backgroundColor = '#66CCFF';
        e.style.opacity =  0.5;
        e.style.position = 'relative';

        // Calc rectangle
        let eWidth = baseWidth;
        let eHeight = sldRect.height * (cmtCnts[i] / maxCnt);
        e.style.width = eWidth + 'px';
        e.style.height = eHeight + 'px';
        e.style.top = sldRect.height - eHeight + 'px';

        // Add element 
        frag.appendChild(e);
    }
    graphElem.appendChild(frag);
}


function createCmtGraph(jsonRes) {
    let videoId = location.href.match(/sm\d+/)[0];

    getAdsAndProcess(videoId, (jsonAds) => {
        let vpos = [];
        for (let obj of jsonRes) {
            if ('chat' in obj) {
                vpos.push(obj['chat']['vpos']);
            }
        }
        const divNum = 100;
        let cmtCnts = new Array(divNum);
        cmtCnts.fill(0);

        let movieDuration = document.getElementsByClassName('PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;
        let durs = movieDuration.split(':');
        let movieTime = durs[0]*60*100 + durs[1]*100;

        // Check either display niconico advertisement or not
        let adsTime = 0;
        if (videoId) {
            if (jsonAds.data.activePoint > 0) {
                adsTime = 10*100;
            }
        }

        let baseTime = (movieTime + adsTime) / divNum;
        for (let time of vpos) {
            let p = parseInt(time / baseTime);
            if (p >= divNum) p = divNum - 1;
            cmtCnts[p] += 1;
        }

        // Draw graph over seekbar
        let sld = document.getElementsByClassName('XSlider')[0];
        drawGraph(sld, cmtCnts);

        // In case of resizing seekbar
        let prevWidth = sld.getBoundingClientRect().width;
        window.addEventListener('resize', () => {
            let curWidth = sld.getBoundingClientRect().width;
            // If seekbar is resized
            if (curWidth != prevWidth) {
                // Re-draw
                let cmtelems = document.getElementsByClassName('cmtrecs');
                let baseWidth = curWidth / cmtCnts.length;
                for (let e of cmtelems) {
                    e.style.width = baseWidth + 'px';
                }
                prevWidth = curWidth;
            }
        });
    });
}


function getInfAndCreateGraph(doc) {
    // Get data from html document
    let dataStr = doc.getElementById('js-initial-watch-data').getAttribute('data-api-data');
    let dataObj = JSON.parse(dataStr);

    // Extract information to access the comment server
    let threadId = dataObj['commentComposite']['threads'][0]['id'];
    let userId = dataObj['viewer']['id'];
    let userKey = dataObj['context']['userkey'];

    // Loop in case PlayerPlayTime-duration value is not updated yet
    let timer = setInterval(() => {
        let movieDuration = document.getElementsByClassName('PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;
        if (movieDuration !== '00:00') {
            let durs = movieDuration.split(':');
            let timeRange = '0-' + parseInt(durs[0]) + ':100,1000';

            // Access the comment server and draw the comment graph
            getCmtAndProcess(threadId, userId, userKey, timeRange, createCmtGraph);

            clearInterval(timer);
        }
    }, 100);
}


// Main
window.onload = () => {
    getInfAndCreateGraph(document);

    let videoId = location.href.match(/sm\d+/)[0];

    // On click another video link: 
    // In this case, html document is not updated to new video page completely.
    // So, we parse new video page html document by re-accessing it and extract 
    // needed information (e.g. thread id).
    const observer = new MutationObserver((mutations) => {
        let newVideoId = location.href.match(/sm\d+/)[0];
        if (newVideoId !== videoId) {
            // Get thread id and re-draw comment graph
            const url = `https://www.nicovideo.jp/watch/${newVideoId}`;
            //const url = `https://flapi.nicovideo.jp/api/getflv/${newVideoId}`;

            fetch(url).then((response) => {
                return response.text();
            }).then((htmlText) => {
                // Convert html text to document
                let parser = new DOMParser();
                let doc = parser.parseFromString(htmlText, 'text/html');
                // Re-draw comment graph with by new video
                getInfAndCreateGraph(doc);
            }).catch((err) => {
                console.error(`[ERROR] Failed to GET request to ${url}`);
                console.error('url: ' + url);
                console.error('err: ', err);
            });

            videoId = newVideoId;
        }
    });

    // On click another video link, A child element is inserted under
    // 'ja-jp is-autoResize' class's element.
    // So, monitor this element for now.
    const target = document.getElementsByClassName('ja-jp is-autoResize')[0];
    const config = {
        childList: true
    };
    observer.observe(target, config);
}

