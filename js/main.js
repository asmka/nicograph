//import reqAdJson from 'reqAdJson';
import reqCmtJson from 'reqCmtJson';
import reqVideoDoc from 'reqVideoDoc';


function drawGraph(drawTgt, cmtCnts) {
    // Draw destination
    let drawTgtRect = drawTgt.getBoundingClientRect();
    let maxCnt = 0;

    // Sum all comments
    for(let i=0; i<cmtCnts.length; i++) {
        if(cmtCnts[i] > maxCnt) {
            maxCnt = cmtCnts[i];
        }
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
    drawTgt.insertBefore(graphElem, drawTgt.firstChild);

    // Create comment rectangles
    let baseWidth = drawTgtRect.width / cmtCnts.length;
    let frag = document.createDocumentFragment();
    for(let i=0; i<cmtCnts.length; i++) {
        // Create a rectangle element
        let e = document.createElement('div');
        e.className = 'CmtRect';
        e.style.backgroundColor = '#66CCFF';
        e.style.opacity =  0.5;
        e.style.position = 'relative';

        // Calc rectangle
        let eWidth = baseWidth;
        let eHeight = drawTgtRect.height * (cmtCnts[i] / maxCnt);
        e.style.width = eWidth + 'px';
        e.style.height = eHeight + 'px';
        e.style.top = drawTgtRect.height - eHeight + 'px';

        // Add element 
        frag.appendChild(e);
    }
    graphElem.appendChild(frag);
}


function aggrCmtCnts(jsonRes, divNum = 100) {
    let vpos = [];
    for (let obj of jsonRes) {
        if ('chat' in obj) {
            vpos.push(obj['chat']['vpos']);
        }
    }

    let cmtCnts = new Array(divNum);
    cmtCnts.fill(0);

    let movieDuration = document.getElementsByClassName(
        'PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;
    let durs = movieDuration.split(':');
    let movieTime = durs[0]*60*100 + durs[1]*100;

    // [Todo] Adapt to AdBlock
    /*
    // Check either display niconico advertisement or not
    let adsTime = 0;
    if (videoId) {
        if (jsonAds.data.activePoint > 0) {
            adsTime = 10*100;
        }
    }
    */

    let baseTime = movieTime / divNum;
    //let baseTime = (movieTime + adsTime) / divNum;
    for (let time of vpos) {
        let p = parseInt(time / baseTime);
        if (p >= divNum) p = divNum - 1;
        cmtCnts[p] += 1;
    }

    return cmtCnts;
}


function addRedrawJobOnResize(drawTgt, cmtCnts) {
    // In case of resizing seekbar
    let prevWidth = drawTgt.getBoundingClientRect().width;
    window.addEventListener('resize', () => {
        let curWidth = drawTgt.getBoundingClientRect().width;
        // If seekbar is resized
        if (curWidth != prevWidth) {
            // Re-draw
            let cmtElems = document.getElementsByClassName('CmtRect');
            let baseWidth = curWidth / cmtCnts.length;
            for (let e of cmtElems) {
                e.style.width = baseWidth + 'px';
            }
            prevWidth = curWidth;
        }
    });
}


function keepCmtGraph(cmtJson) {
    // Draw graph over seekbar
    let drawTgt = document.getElementsByClassName('XSlider')[0];
    let cmtCnts = aggrCmtCnts(cmtJson);

    drawGraph(drawTgt, cmtCnts);
    addRedrawJobOnResize(drawTgt, cmtCnts);
}



function createCmtGraph(doc) {
    // Get data from html document
    let dataStr = doc.getElementById('js-initial-watch-data').getAttribute('data-api-data');
    let dataObj = JSON.parse(dataStr);

    // Extract information to access the comment server
    let threadId = dataObj['commentComposite']['threads'][0]['id'];
    let userId = dataObj['viewer']['id'];
    let userKey = dataObj['context']['userkey'];

    // Loop in case PlayerPlayTime-duration value is not updated yet
    let timer = setInterval(() => {
        let movieDuration = document.getElementsByClassName(
            'PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;

        // PlayerPlayTime-document value is updated
        if (movieDuration && movieDuration !== '00:00') {
            let durs = movieDuration.split(':');
            let timeRange = '0-' + parseInt(durs[0]) + ':100,1000';

            // Access the comment server and draw the comment graph
            (async () => {
                try {
                    let cmtJson = await reqCmtJson(threadId, userId, userKey, timeRange);
                    keepCmtGraph(cmtJson);
                } catch (err) {
                    console.log(err);
                }
            })();

            clearInterval(timer);
        }
    }, 100);
}


function addRedrawJobOnClickLink() {
    let videoId = location.href.match(/s[mo]\d+/)[0];   // e.g. 'sm12345'

    // On click another video link: 
    // In this case, html document is not updated to new video page completely.
    // So, we parse new video page html document by re-accessing it and extract 
    // needed information (e.g. thread id).
    const observer = new MutationObserver((mutations) => {
        let newVideoId = location.href.match(/s[mo]\d+/)[0];
        if (newVideoId !== videoId) {
            // Re-draw comment graph with by new video
            (async () => {
                try {
                    let doc = await reqVideoDoc(newVideoId);
                    createCmtGraph(doc);
                } catch (err) {
                    console.log(err);
                }
            })();
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


// Main
window.onload = () => {
    createCmtGraph(document);
    addRedrawJobOnClickLink();
}

