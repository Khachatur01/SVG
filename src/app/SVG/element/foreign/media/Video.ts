import {SVG} from "../../../SVG";
import {ForeignObject} from "../ForeignObject";

export class Video extends ForeignObject {
  private readonly source: HTMLSourceElement;
  constructor(container: SVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container, x, y, width, height);
    let video = document.createElement("video");
    video.style.width = "calc(100% - 20px)";
    video.style.height = "calc(100% - 20px)";
    video.style.marginLeft = "10px";
    video.style.marginTop = "10px";
    video.style.height = "calc(100% - 20px)";
    video.style.cursor = "pointer";
    video.setAttribute("controls", "");
    this.source = document.createElement("source");
    video.appendChild(this.source);
    this.setContent(video, false);
  }

  override get copy(): Video {
    return super.copy as Video;
  }

  set src(URI: string | null) {
    this.source.setAttribute("src", !URI ? "": URI);
  }
  get src(): string | null {
    return this.source.getAttribute("src");
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width > 15 && size.height > 15;
  }
}
