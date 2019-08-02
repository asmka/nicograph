function drawGraph(sld, cmtCnts) {
    // draw destination
    sld.style.display = 'flex';
    sld.style['flex-direction'] = 'row';

    let sldRect = sld.getBoundingClientRect();
    let sumCmt = 0;
    let maxCnt = 0;

    // sum all comments
    for(let i=0; i<cmtCnts.length; i++) {
        if(cmtCnts[i] > maxCnt) {
            maxCnt = cmtCnts[i];
        }
        sumCmt += cmtCnts[i];
    }
    if (maxCnt == 0) maxCnt = 1;

    // create comment rectangles
    let baseWidth = sldRect.width / cmtCnts.length;
    let frag = document.createDocumentFragment();
    for(let i=0; i<cmtCnts.length; i++) {
        // create element
        let e = document.createElement('div');
        e.className = 'cmtrecs';
        e.style.backgroundColor = '#66CCFF';
        e.style.opacity =  0.5;
        e.style.position = 'relative';

        // calc rectangle 
        let eWidth = baseWidth;
        let eHeight = sldRect.height * (cmtCnts[i] / maxCnt);
        e.style.width = eWidth + 'px';
        e.style.height = eHeight + 'px';
        e.style.top = sldRect.height - eHeight + 'px';

        // add element 
        frag.appendChild(e);
    }
    sld.insertBefore(frag, sld.firstChild);
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
        let cmtCnts = Array(divNum);
        cmtCnts.fill(0);

        let movieDuration = document.getElementsByClassName('PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;
        let durs = movieDuration.split(':');
        let movieTime = durs[0]*60*100 + durs[1]*100;

        // check either display niconico advertisement or not
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

        // draw graph over seekbar
        let sld = document.getElementsByClassName('XSlider')[0];
        drawGraph(sld, cmtCnts);

        // in case of resizing seekbar
        let prevWidth = sld.getBoundingClientRect().width;
        window.addEventListener('resize', () => {
            let curWidth = sld.getBoundingClientRect().width;
            // if seekbar is resized
            if (curWidth != prevWidth) {
                // re-draw
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


// main
window.onload = () => {
    // get data from html document
    let dstr = document.getElementById('js-initial-watch-data').getAttribute('data-api-data');
    let dobj = JSON.parse(dstr);
    console.debug(dstr);
    console.debug(dobj);

    // extract information to access the comment server
    let threadId = dobj['commentComposite']['threads'][0]['id'];
    let userId = dobj['viewer']['id'];
    let userKey = dobj['context']['userkey'];

    // calcurate timeRange
    let movieDuration = document.getElementsByClassName('PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;
    let durs = movieDuration.split(':');
    let timeRange = '0-' + parseInt(durs[0]) + ':100,1000';

    // access the comment server and draw the comment grapth
    getCmtAndProcess(threadId, userId, userKey, timeRange, createCmtGraph);
}

