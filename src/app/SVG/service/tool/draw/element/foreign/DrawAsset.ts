import {MoveDraw} from "../../mode/MoveDraw";
import {Point} from "../../../../../model/Point";
import {ElementView} from "../../../../../element/ElementView";
import {ForeignObjectView} from "../../../../../element/foreign/ForeignObjectView";
import {TextBoxView} from "../../../../../element/foreign/text/TextBoxView";
import {SVG} from "../../../../../SVG";
import {Callback} from "../../../../../dataSource/Callback";
import {ImageView} from "../../../../../element/foreign/media/ImageView";
import {VideoView} from "../../../../../element/foreign/media/VideoView";

export class DrawAsset extends MoveDraw {
  public content: HTMLDivElement = document.createElement("div");
  getDrawableElement(position: Point): ElementView {
    let videoView = new ForeignObjectView(this.container, position.x, position.y);
    videoView.setContent(this.content);
    return videoView;
  }

  override onIsNotComplete() {
    if (!this.drawableElement) return;
    this.drawableElement.setSize({
      x: this.startPos.x - 300,
      y: this.startPos.y - 100,
      width: 600,
      height: 200
    }, null);
    this.drawableElement.refPoint = this.drawableElement?.center;
  }

  override onEnd() {
    this.container.selectTool.on();
    if (this.drawableElement)
      this.container.focus(this.drawableElement);
  }

  override start(container: SVG) {
    super.start(container);
    container.call(Callback.ASSET_TOOL_ON);
  }

  override stop() {
    super.stop();
    this.container.call(Callback.ASSET_TOOL_OFF);
  }
  _new(): DrawAsset {
    return new DrawAsset(this.container);
  }
}
