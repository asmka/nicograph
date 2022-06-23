import { Thread } from "./api/comment";

export function drawGraph(threads: Thread[], isNicoad: boolean) {
  const drawTgt = document.getElementsByClassName("XSlider")[0];
  const cmtCnts = getCommentCounts(threads, isNicoad);

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
    e.style.opacity = "0.5";
    e.style.display = "inline-block";
    e.style.verticalAlign = "bottom";

    // Calc rectangle
    const eWidth = barWidth;
    const eHeight = Math.floor(maxBarHeight * (cmtCnts[i] / maxCnt));
    e.style.width = eWidth + "px";
    e.style.height = eHeight + "px";

    // Add element
    graphElem.appendChild(e);
  }
}

function getCommentCounts(threads: Thread[], isNicoad: boolean): number[] {
  const DIVISION = 100;
  const NICOAD_TIME_MS = 10 * 1000;
  const movieTimeMs = getMovieTimeMs();

  const totalTimeMs = movieTimeMs + (isNicoad ? NICOAD_TIME_MS : 0);

  const commentCounts = new Array<number>(DIVISION);
  commentCounts.fill(0);
  for (const t of threads) {
    for (const c of t.comments) {
      const p = Math.min(
        Math.floor((c.vposMs * DIVISION) / totalTimeMs),
        DIVISION - 1
      );
      commentCounts[p]++;
    }
  }

  return commentCounts;
}

function getMovieTimeMs(): number {
  const movieDuration = document.getElementsByClassName(
    "PlayTimeFormatter PlayerPlayTime-duration"
  )[0].innerHTML;

  const durs = movieDuration.split(":");
  const movieTimeMs = (parseInt(durs[0]) * 60 + parseInt(durs[1])) * 1000;

  return movieTimeMs;
}
