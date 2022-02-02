import {MoveDraw} from "../../mode/MoveDraw";
import {Point} from "../../../../../model/Point";
import {ElementView} from "../../../../../element/ElementView";
import {SVG} from "../../../../../SVG";
import {Callback} from "../../../../../dataSource/Callback";
import {ImageView} from "../../../../../element/foreign/media/ImageView";

export class DrawImage extends MoveDraw {
  public src: string = "";
  getDrawableElement(position: Point): ElementView {
    let imageView = new ImageView(this.container, position.x, position.y);
    imageView.src = this.src;
    return imageView;
  }

  override onIsNotComplete() {
    if (!this.drawableElement) return;
    this.drawableElement.setSize({
      x: this.startPos.x - 150,
      y: this.startPos.y - 100,
      width: 300,
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
    container.call(Callback.IMAGE_TOOL_ON);
  }

  override stop() {
    super.stop();
    this.container.call(Callback.IMAGE_TOOL_OFF);
  }
  _new(): DrawImage {
    return new DrawImage(this.container);
  }
}
