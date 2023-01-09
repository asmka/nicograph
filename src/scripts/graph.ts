import { Thread } from "./api/comment";

const DIVISION = 100;
const NICOAD_TIME_MS = 10 * 1000;
const GRAPH_ELEMENT_ID = "NicoGraph";

export class CommentGraph {
  private readonly target: HTMLElement;
  readonly elem: HTMLElement;

  constructor(threads: Thread[], isNicoad: boolean, target: HTMLElement) {
    const counts = this.getCommentCounts(threads, isNicoad);

    // Set graph area
    const graphWidth = target.getBoundingClientRect().width;
    const graphHeight = 18;
    const graphFixTop = 4;

    // Insert a graph element
    const elem = document.createElement("div");
    elem.id = GRAPH_ELEMENT_ID;
    elem.style.position = "relative";
    elem.style.top = graphFixTop + "px";
    elem.style.lineHeight = graphHeight + "px";

    // Create comment rectangles
    const barWidth = graphWidth / counts.length;
    const maxBarHeight = graphHeight;
    const maxCount = Math.max.apply(null, counts);
    for (let i = 0; i < counts.length; i++) {
      // Create a rectangle element
      const e = document.createElement("div");
      e.style.backgroundColor = "#66CCFF";
      e.style.opacity = "0.5";
      e.style.display = "inline-block";
      e.style.verticalAlign = "bottom";

      // Calc rectangle
      const eWidth = barWidth;
      const eHeight = Math.floor(maxBarHeight * (counts[i] / maxCount));
      e.style.width = eWidth + "px";
      e.style.height = eHeight + "px";

      // Add element
      elem.appendChild(e);
    }

    this.setResizeObserver(target);
    target.insertBefore(elem, target.firstChild);

    this.target = target;
    this.elem = elem;
  }

  private setResizeObserver(target: HTMLElement): ResizeObserver {
    const observer = new ResizeObserver(() => {
      this.redraw();
    });
    observer.observe(target);

    return observer;
  }

  private redraw(): void {
    const graphWidth = this.target.getBoundingClientRect().width;
    const rects = this.elem.children as HTMLCollectionOf<HTMLElement>;
    const barWidth = graphWidth / rects.length;
    for (const e of rects) {
      e.style.width = barWidth + "px";
    }
  }

  private getCommentCounts(threads: Thread[], isNicoad: boolean): number[] {
    const movieTimeMs = this.getMovieTimeMs();
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

  private getMovieTimeMs(): number {
    const movieDuration = document.getElementsByClassName(
      "PlayTimeFormatter PlayerPlayTime-duration"
    )[0].innerHTML;

    const durs = movieDuration.split(":");
    const movieTimeMs = (parseInt(durs[0]) * 60 + parseInt(durs[1])) * 1000;

    return movieTimeMs;
  }
}
