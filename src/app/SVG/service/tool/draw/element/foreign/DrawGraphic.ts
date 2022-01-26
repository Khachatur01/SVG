import {Point} from "../../../../../model/Point";
import {GraphicView} from "../../../../../element/foreign/graphic/GraphicView";
import {ElementView} from "../../../../../element/ElementView";
import {MoveDraw} from "../../mode/MoveDraw";

export class DrawGraphic extends MoveDraw {
  onStart(position: Point): ElementView {
    let graphicView = new GraphicView(this.container, position);
    // graphicView.addFunction((x: number) => Math.pow(2, x + 1), "#486fff");
    // graphicView.addFunction((x: number) => x * x * x, "#b700ff");
    // graphicView.addFunction((x: number) => x, "#007d16");
    graphicView.addFunction((x: number) => x * x, "#000", 3);
    graphicView.addFunction((x: number) => Math.sin(x), "#ff7f3f");
    return graphicView;
  }

  override onIsNotComplete() {
    if (!this.drawableElement) return;
    this.drawableElement.setSize({
      x: this.startPos.x - 150,
      y: this.startPos.y - 100,
      width: 300,
      height: 200
    }, null);
    this.drawableElement.refPoint = this.drawableElement.center;
    this.container.focus(this.drawableElement);
    this.container.selectTool.on();
  }
}
