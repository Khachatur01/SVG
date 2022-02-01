import {MoveDraw} from "../../mode/MoveDraw";
import {Point} from "../../../../../model/Point";
import {ElementView} from "../../../../../element/ElementView";
import {ForeignObjectView} from "../../../../../element/foreign/ForeignObjectView";
import {TextBoxView} from "../../../../../element/foreign/text/TextBoxView";
import {SVG} from "../../../../../SVG";
import {Callback} from "../../../../../dataSource/Callback";
import {VideoView} from "../../../../../element/foreign/media/VideoView";

export class DrawVideo extends MoveDraw {
  public src: string = "";
  getDrawableElement(position: Point): ElementView {
    let videoView = new VideoView(this.container, position.x, position.y);
    videoView.src = this.src;
    return videoView;
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
    container.call(Callback.VIDEO_TOOL_ON);
  }

  override stop() {
    super.stop();
    this.container.call(Callback.VIDEO_TOOL_OFF);
  }
}
