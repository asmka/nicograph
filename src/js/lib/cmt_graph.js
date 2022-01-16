let cmtGraphComp = {
  vposMsList: [],
  movieTimeMs: 0,
  isNicoads: false,
  divNum: 0,
  resizeObserver: null,
};

function extractVposMsList(threads) {
  let vposMsList = [];
  threads.forEach((thread) => {
    thread.chats.forEach((chat) => {
      // Omit deleted comment that has no 'content' property
      if (Object.prototype.hasOwnProperty.call(chat, "content")) {
        vposMsList.push(chat.vpos * 10);
      }
    });
  });

  return vposMsList;
}

function aggrCmtCnts(vposMsList, movieTimeMs, isNicoads, divNum) {
  let cmtCnts = new Array(divNum);
  cmtCnts.fill(0);

  // Nicoads time at the movie end
  let nicoadsTimeMs = 0;
  if (isNicoads) {
    nicoadsTimeMs = 10 * 1000;
  }

  let intervalTimeMs = (movieTimeMs + nicoadsTimeMs) / divNum;
  vposMsList.forEach((timeMs) => {
    // [ToDo]
    // Test in case zero division
    let p = parseInt(timeMs / intervalTimeMs);
    if (p >= divNum) p = divNum - 1;
    cmtCnts[p] += 1;
  });

  return cmtCnts;
}

function drawGraph(drawTgt, cmtCnts) {
  // Sum all comments
  let maxCnt = 1;
  for (let i = 0; i < cmtCnts.length; i++) {
    if (cmtCnts[i] > maxCnt) {
      maxCnt = cmtCnts[i];
    }
  }

  // Insert a graph element
  const graphId = "CmtGraph";
  let graphElem = document.getElementById(graphId);
  // Remove before graph
  if (graphElem) {
    graphElem.remove();
  }
  graphElem = document.createElement("div");
  graphElem.id = graphId;

  // Set graph area
  const graphWidth = drawTgt.getBoundingClientRect().width;
  const graphHeight = 18;
  const graphFixTop = 4;
  graphElem.style.position = "relative";
  graphElem.style.top = graphFixTop + "px";
  graphElem.style.lineHeight = graphHeight + "px";
  drawTgt.insertBefore(graphElem, drawTgt.firstChild);

  // Create comment rectangles
  const barWidth = graphWidth / cmtCnts.length;
  const maxBarHeight = graphHeight;
  for (let i = 0; i < cmtCnts.length; i++) {
    // Create a rectangle element
    const e = document.createElement("div");
    e.className = "CmtRect";
    e.style.backgroundColor = "#66CCFF";
    e.style.opacity = 0.5;
    e.style.display = "inline-block";
    e.style["vertical-align"] = "bottom";

    // Calc rectangle
    const eWidth = barWidth;
    const eHeight = Math.floor(maxBarHeight * (cmtCnts[i] / maxCnt));
    e.style.width = eWidth + "px";
    e.style.height = eHeight + "px";

    // Add element
    graphElem.appendChild(e);
  }
}

function createResizeObserverToRedraw(drawTgt) {
  const observer = new ResizeObserver(() => {
    let curWidth = drawTgt.getBoundingClientRect().width;
    // Re-draw
    let cmtElems = document.getElementsByClassName("CmtRect");
    let baseWidth = curWidth / cmtElems.length;
    for (let e of cmtElems) {
      e.style.width = baseWidth + "px";
    }
  });
  observer.observe(drawTgt);

  return observer;
}

// If already drawn graph, reconstruct one
function keepCmtGraph(cmtCnts) {
  // Draw graph over seekbar
  let drawTgt = document.getElementsByClassName("XSlider")[0];

  drawGraph(drawTgt, cmtCnts);
  if (!cmtGraphComp.resizeObserver) {
    let resizeObserver = createResizeObserverToRedraw(drawTgt);
    cmtGraphComp.resizeObserver = resizeObserver;
  }
}

export function overwriteCmtGraph({
  vposMsList = cmtGraphComp.vposMsList,
  movieTimeMs = cmtGraphComp.movieTimeMs,
  isNicoads = cmtGraphComp.isNicoads,
  divNum = cmtGraphComp.divNum,
}) {
  // Preserve vars for recreating graph
  cmtGraphComp.movieTimeMs = movieTimeMs;
  cmtGraphComp.vposMsList = vposMsList;
  cmtGraphComp.isNicoads = isNicoads;
  cmtGraphComp.divNum = divNum;

  const cmtCnts = aggrCmtCnts(vposMsList, movieTimeMs, isNicoads, divNum);
  keepCmtGraph(cmtCnts);
}

export function createCmtGraph(threads) {
  // [ToDo]
  // Get movie time from default called library

  // Loop in case PlayerPlayTime-duration value is not updated yet
  let timer = setInterval(() => {
    // Get movie duration from document
    const movieDuration = document.getElementsByClassName(
      "PlayTimeFormatter PlayerPlayTime-duration"
    )[0].innerHTML;

    // PlayerPlayTime-document value is updated
    if (movieDuration && movieDuration !== "00:00") {
      const durs = movieDuration.split(":");
      const movieTimeMs = (parseInt(durs[0]) * 60 + parseInt(durs[1])) * 1000;

      const vposMsList = extractVposMsList(threads);
      overwriteCmtGraph({
        vposMsList: vposMsList,
        movieTimeMs: movieTimeMs,
        divNum: 100,
      });

      clearInterval(timer);
    }
  }, 100);
}
