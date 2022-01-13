import {MoveDraw} from "../../mode/MoveDraw";
import {Point} from "../../../../../model/Point";
import {XElement} from "../../../../../element/XElement";
import {XTextBox} from "../../../../../element/text/XTextBox";

export class DrawTextBox extends MoveDraw {
  onStart(position: Point): XElement {
    return new XTextBox(this.container, position.x, position.y);
  }

  override onEnd() {
    if(this.drawableElement?.isComplete())
      this.container.editTool.on();
  }
}
