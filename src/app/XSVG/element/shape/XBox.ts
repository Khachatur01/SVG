import {XElement} from "../XElement";
import {Point} from "../../model/Point";
import {Rect} from "../../model/Rect";
import {Size} from "../../model/Size";
import {XSVG} from "../../XSVG";
import {XPath} from "../pointed/XPath";

export class XBox extends XElement {
  constructor(container: XSVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container);
    this.svgElement = document.createElementNS(XElement.svgURI, "rect");

    this.position = {x: x, y: y};
    this.setSize({
      x: x, y: y,
      width: width, height: height
    });

    this.setOverEvent();
    // this.style.setDefaultStyle();
  }

  get copy(): XBox {
    let position = this.position;
    let size = this.size;
    let box: XBox = new XBox(this.container);
    box.position = position;
    box.setSize({
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height
    });
    box.style.set = this.style.get;

    box.refPoint = Object.assign({}, this.refPoint);
    box.rotate(this._angle);

    return box;
  }
  override isComplete(): boolean {
    let size = this.size;
    return size.width != 0 && size.height != 0;
  }

  get points(): Point[] {
    let position: Point = this.position;
    let size: Size = this.size;

    return [
      position,
      {x: position.x, y: position.y + size.height},
      {x: position.x + size.width, y: position.y + size.height},
      {x: position.x + size.width, y: position.y},
    ];
  }

  get position(): Point {
    return {
      x: parseInt(this.getAttr("x")),
      y: parseInt(this.getAttr("y"))
    };
  }
  set position(delta: Point) {
    this.setAttr({
      x: this._lastPosition.x + delta.x,
      y: this._lastPosition.y + delta.y
    });
  }

  setSize(rect: Rect): void {
    if(rect.width < 0) {
      rect.width = -rect.width;
      rect.x -= rect.width;
    }
    if(rect.height < 0) {
      rect.height = -rect.height;
      rect.y -= rect.height;
    }

    this.setAttr({
      x: rect.x + "",
      y: rect.y + "",
      width: rect.width + "",
      height: rect.height + ""
    });
  }
  get boundingRect(): Rect {
    let points = this.points;
    return this.calculateBoundingBox(points);
  }
  get rotatedBoundingRect(): Rect {
    let points = this.rotatedPoints;
    return this.calculateBoundingBox(points);
  }

  get size(): Size {
    return {
      width: parseInt(this.getAttr("width")),
      height: parseInt(this.getAttr("height"))
    };
  }

  override toPath(): XPath {
    return new XPath(this.container);
  }
}
