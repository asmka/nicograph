export default function createCmtGraph(threads) {
    // [ToDo]
    // Get movie time from default called library

    // Loop in case PlayerPlayTime-duration value is not updated yet
    let timer = setInterval(() => {
        // Get movie duration from document
        let movieDuration = document.getElementsByClassName(
            'PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;

        // PlayerPlayTime-document value is updated
        if (movieDuration && movieDuration !== '00:00') {
            let durs = movieDuration.split(':');
            let movieTimeMs = (parseInt(durs[0]) * 60 + parseInt(durs[1])) * 1000;

            const cmtCnts = aggrCmtCnts(threads, movieTimeMs);
            keepCmtGraph(cmtCnts);

            clearInterval(timer);
        }
    }, 100);
}

function aggrCmtCnts(threads, movieTimeMs, divNum = 100) {
    let vposMs = [];
    threads.forEach((thread) => {
        thread.chats.forEach((chat) => {
            vposMs.push(chat.vpos * 10);
        });
    });

    let cmtCnts = new Array(divNum);
    cmtCnts.fill(0);

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

    let baseTimeMs = movieTimeMs / divNum;
    //let baseTime = (movieTime + adsTime) / divNum;
    vposMs.forEach((timeMs) => {
        let p = parseInt(timeMs / baseTimeMs);
        if (p >= divNum) p = divNum - 1;
        cmtCnts[p] += 1;
    });

    return cmtCnts;
}

function keepCmtGraph(cmtCnts) {
    // Draw graph over seekbar
    let drawTgt = document.getElementsByClassName('XSlider')[0];

    drawGraph(drawTgt, cmtCnts);
    addRedrawJobOnResize(drawTgt);
}

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
    let baseHeight = drawTgtRect.height - 4     // Stick out over video if not minus 4
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
        let eHeight = baseHeight * (cmtCnts[i] / maxCnt);
        e.style.width = eWidth + 'px';
        e.style.height = eHeight + 'px';
        e.style.top = baseHeight - eHeight + 4 + 'px';

        // Add element 
        frag.appendChild(e);
    }
    graphElem.appendChild(frag);
}

function addRedrawJobOnResize(drawTgt) {
    const observer = new ResizeObserver((entries) => {
        let curWidth = drawTgt.getBoundingClientRect().width;
        // Re-draw
        let cmtElems = document.getElementsByClassName('CmtRect');
        let baseWidth = curWidth / cmtElems.length;
        for (let e of cmtElems) {
            e.style.width = baseWidth + 'px';
        }
        entries;    // For ESLint no-unused-vars
    });
    observer.observe(drawTgt);
}
