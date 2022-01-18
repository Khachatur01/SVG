import {XSVG} from "../../XSVG";
import {XForeignObject} from "../foreign/XForeignObject";

export class XVideo extends XForeignObject {
  private readonly source: HTMLSourceElement;
  constructor(container: XSVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container, x, y, width, height);
    let video = document.createElement("video");
    video.style.width = "calc(100% - 20px)";
    video.style.height = "calc(100% - 20px)";
    video.style.marginLeft = "10px";
    video.style.marginTop = "10px";
    video.style.height = "calc(100% - 20px)";
    video.setAttribute("controls", "");
    this.source = document.createElement("source");
    video.appendChild(this.source);
    this.setContent(video, false);
  }

  override get copy(): XVideo {
    return super.copy as XVideo;
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
