import {XElement} from "../XElement";
import {Size} from "../../model/Size";
import {Point} from "../../model/Point";

export class XPath extends XElement {
  constructor() {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "path");
    this.setOverEvent();
    this.setDefaultStyle();
  }
  /*
  M x, ry+y
  A rx, ry 0 0 1 x+rx,   y
  A rx, ry 0 0 1 rx*2+x, ry+y
  A rx, ry 0 0 1 rx+x,   ry*2+y
  A rx, ry 0 0 1 x, ry+y

  function ellipse(x, y, rx, ry) {
    return "M " + x + "," + (ry+y) +
      " A " + rx + "," + ry + " 0 0 1 " + (rx + x) + "," + (y) +
      " A " + rx + "," + ry + " 0 0 1 " + (rx*2+x) + "," + (ry + y) +
      " A " + rx + "," + ry + " 0 0 1 " + (rx + x) + "," + (ry*2+y) +
      " A " + rx + "," + ry + " 0 0 1 " + (x)      + "," + (ry+y)

  }
  * */
  override get size(): Size {
    return {width: 0, height: 0}
  }
  override set size(size: Size) {

  }
  get position(): Point {
    return {x: 0, y: 0};
  }

  set position(point: Point) {
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width != 0 && size.height != 0;
  }

}
