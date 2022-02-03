import {MoveDraw} from "../../mode/MoveDraw";
import {Point} from "../../../../../model/Point";
import {ElementView} from "../../../../../element/ElementView";
import {TextBoxView} from "../../../../../element/foreign/text/TextBoxView";
import {SVG} from "../../../../../SVG";
import {Callback} from "../../../../../dataSource/Callback";

export class DrawTextBox extends MoveDraw {
  getDrawableElement(position: Point): ElementView {
    let textBox = new TextBoxView(this.container, position.x, position.y);
    textBox.SVG.style.outline = textBox.outline;
    return textBox
  }

  override onIsNotComplete() {
    if (!this.drawableElement) return;
    this.drawableElement.setSize({
      x: this.startPos.x,
      y: this.startPos.y,
      width: 200,
      height: 100
    }, null);
    this.drawableElement.refPoint = this.drawableElement?.center;
  }

  override onEnd() {
    this.container.editTool.on();
    let textBox = (this.drawableElement as TextBoxView);
    textBox.content?.focus();
    textBox.onFocus();
  }

  override start(container: SVG) {
    super.start(container);
    container.call(Callback.TEXT_TOOL_ON);
  }

  override stop() {
    super.stop();
    this.container.call(Callback.TEXT_TOOL_OFF);
  }
  _new(): DrawTextBox {
    return new DrawTextBox(this.container);
  }
}
