function drawGraph(sld, cmt_cnts) {
    // draw destination
    sld.style.display = 'flex';
    sld.style['flex-direction'] = 'row';

    let sld_rect = sld.getBoundingClientRect();
    let sumcmt = 0;
    let maxcnt = 0;

    // sum all comments
    for(let i=0; i<cmt_cnts.length; i++) {
        if(cmt_cnts[i] > maxcnt) {
            maxcnt = cmt_cnts[i];
        }
        sumcmt += cmt_cnts[i];
    }
    if (maxcnt == 0) maxcnt = 1;

    // create comment rectangles
    let base_width = sld_rect.width / cmt_cnts.length;
    let frag = document.createDocumentFragment();
    for(let i=0; i<cmt_cnts.length; i++) {
        // create element
        let e = document.createElement('div');
        e.className = 'cmtrecs';
        e.style.backgroundColor = '#66CCFF';
        e.style.opacity =  0.5;
        e.style.position = 'relative';

        // calc rectangle 
        let e_width = base_width;
        let e_height = sld_rect.height * (cmt_cnts[i] / maxcnt);
        e.style.width = e_width + 'px';
        e.style.height = e_height + 'px';
        e.style.top = sld_rect.height - e_height + 'px';

        // add element 
        frag.appendChild(e);
    }
    sld.insertBefore(frag, sld.firstChild);
}


function createCmtGraph(res_str) {
    let video_id = location.href.match(/sm\d+/)[0];

    getAdsAndProcess(video_id, function(ads_str) {
        let res_json = JSON.parse(res_str);
        let vpos = [];
        for (let obj of res_json) {
            if ('chat' in obj) {
                vpos.push(obj['chat']['vpos']);
            }
        }
        const divNum = 100;
        let cmt_cnts = Array(divNum);
        cmt_cnts.fill(0);

        let movie_duration = document.getElementsByClassName('PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;
        let durs = movie_duration.split(':');
        let movie_time = durs[0]*60*100 + durs[1]*100;

        // check either display niconico advertisement or not
        let ads_time = 0;
        if (video_id) {
            let ads_json = JSON.parse(ads_str);
            if (ads_json.data.activePoint > 0) {
                ads_time = 10*100;
            }
        }

        let base_time = (movie_time + ads_time) / divNum;
        for (let time of vpos) {
            let p = parseInt(time / base_time);
            if (p >= divNum) p = divNum - 1;
            cmt_cnts[p] += 1;
        }

        // draw graph over seekbar
        let sld = document.getElementsByClassName('XSlider')[0];
        drawGraph(sld, cmt_cnts);

        // in case of resizing seekbar
        let prev_width = sld.getBoundingClientRect().width;
        window.addEventListener('resize', () => {
            let cur_width = sld.getBoundingClientRect().width;
            // if seekbar is resized
            if (cur_width != prev_width) {
                // re-draw
                let cmtelems = document.getElementsByClassName('cmtrecs');
                let base_width = cur_width / cmt_cnts.length;
                for (let e of cmtelems) {
                    e.style.width = base_width + 'px';
                }
                prev_width = cur_width;
            }
        });
    });
}


// main
window.onload = () => {
    // create test comments data
    let cmt_cnts = [];
    for(let i=0; i<200; i++) {
        cmt_cnts.push(Math.random()%100);
    }

    // get data from html document
    let dstr = document.getElementById('js-initial-watch-data').getAttribute('data-api-data');
    let dobj = JSON.parse(dstr);

    // extract information to access the comment server
    let thread_id = dobj['commentComposite']['threads'][0]['id'];
    let user_id = dobj['viewer']['id'];
    let user_key = dobj['context']['userkey'];

    // calcurate time_range
    let movie_duration = document.getElementsByClassName('PlayTimeFormatter PlayerPlayTime-duration')[0].innerHTML;
    let durs = movie_duration.split(':');
    let time_range = '0-' + parseInt(durs[0]) + ':100,1000';

    // access the comment server and draw the comment grapth
    getCmtAndProcess(thread_id, user_id, user_key, time_range, createCmtGraph);
}

