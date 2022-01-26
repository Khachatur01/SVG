import {SVG} from "../../../SVG";
import {ForeignObjectView} from "../ForeignObjectView";

export class VideoView extends ForeignObjectView {
  private readonly source: HTMLSourceElement;
  private readonly _video: HTMLVideoElement;

  constructor(container: SVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container, x, y, width, height);
    this._video = document.createElement("video");
    this._video.style.width = "calc(100% - 20px)";
    this._video.style.height = "calc(100% - 20px)";
    this._video.style.marginLeft = "10px";
    this._video.style.marginTop = "10px";
    this._video.style.height = "calc(100% - 20px)";
    this._video.style.cursor = "pointer";
    this._video.controls = true;
    this.source = document.createElement("source");
    this._video.appendChild(this.source);
    this.setContent(this._video, false);
  }

  override get copy(): VideoView {
    return super.copy as VideoView;
  }

  set src(URI: string | null) {
    this.source.setAttribute("src", !URI ? "" : URI);
  }

  get src(): string | null {
    return this.source.getAttribute("src");
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width > 15 && size.height > 15;
  }

  get video(): HTMLVideoElement {
    return this._video;
  }

}
