import {XElement} from "../XElement";
import {XPath} from "../pointed/XPath";
import {Size} from "../../model/Size";
import {Rect} from "../../model/Rect";
import {Point} from "../../model/Point";
import {XSVG} from "../../XSVG";

export class XImage extends XElement {
  constructor(container: XSVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container);
    this.svgElement = document.createElementNS(XElement.svgURI, "image");

    this.svgElement.ondragstart = function () {
      return false;
    }

    this.position = {x: x, y: y};

    this.setSize({
      x: x, y: y,
      width: width, height: height
    });
    this.setOverEvent();

    this.setAttr({
      preserveAspectRatio: "none"
    });
  }
  isComplete(): boolean {
    return false;
  }

  get copy(): XImage {
    let position = this.position;
    let size = this.size;

    let image: XImage = new XImage(this.container);
    image.setImage(this.getImage());
    image.position = position;
    image.setSize({
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height
    });

    image.refPoint = Object.assign({}, this.refPoint);
    image.rotate(this._angle);

    image.style.set = this.style.get;

    return image;
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

  override set position(delta: Point) {
    this.setAttr({
      x: this._lastPosition.x + delta.x,
      y: this._lastPosition.y + delta.y
    });
  }

  override correct(refPoint: Point, lastRefPoint: Point) {
    let delta = this.getCorrectionDelta(refPoint, lastRefPoint);
    if(delta.x == 0 && delta.y == 0) return;
    let position = this.position;

    this.setAttr({
      x: position.x + delta.x,
      y: position.y + delta.y
    });
  }

  get size(): Size {
    return {
      width: parseInt(this.getAttr("width")),
      height: parseInt(this.getAttr("height"))
    };
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

  getImage(): string {
    return this.getAttr("href");
  }
  setImage(URI: string): void {
    this.setAttr({href: URI});
  }

  toPath(): XPath {
    return new XPath(this.container);
  }

}
