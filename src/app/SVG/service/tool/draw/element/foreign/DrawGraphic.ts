import {Point} from "../../../../../model/Point";
import {Graphic} from "../../../../../element/foreign/graphic/Graphic";
import {Element} from "../../../../../element/Element";
import {MoveDraw} from "../../mode/MoveDraw";

export class DrawGraphic extends MoveDraw {
  onStart(position: Point): Element {
    // return new Graphic(this.container, (x: number) => Math.sin(x * (180 / Math.PI)), position)
    return new Graphic(this.container, (x: number) => x * x, position)
    // return new Graphic(this.container, (x: number) => x, position)
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
    this.container.selectTool.on();
  }
}
