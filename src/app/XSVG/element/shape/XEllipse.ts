import {Size} from "../../model/Size";
import {Point} from "../../model/Point";
import {Rect} from "../../model/Rect";
import {XElement} from "../XElement";
import {XSVG} from "../../XSVG";
import {MoveDrawable} from "../../service/tool/draw/type/MoveDrawable";
import {XPath} from "../pointed/XPath";
import {Path} from "../../model/path/Path";
import {Arc} from "../../model/path/curve/arc/Arc";
import {MoveTo} from "../../model/path/point/MoveTo";

export class XEllipse extends XElement implements MoveDrawable {
  constructor(container: XSVG, x: number = 0, y: number = 0, rx: number = 0, ry: number = 0) {
    super(container);
    this.svgElement = document.createElementNS(XElement.svgURI, "ellipse");

    this.position = {x: x, y: y};
    this.setSize({x: x, y: y, width: rx * 2, height: ry * 2});

    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  get copy(): XEllipse {
    let position = this.position;
    let size = this.size;
    let ellipse: XEllipse = new XEllipse(this._container);
    ellipse.position = position;
    ellipse.setSize({
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height
    });
    ellipse.refPoint = Object.assign({}, this.refPoint);
    ellipse.rotate(this._angle);

    ellipse.style.set = this.style.get;

    return ellipse;
  }
  get points(): Point[] {
    let position: Point = this.position;
    let size: Size = this.size;
    return [
      {x: position.x, y: position.y + size.height / 2},
      {x: position.x + size.width / 2, y: position.y},
      {x: position.x + size.width, y: position.y + size.height / 2},
      {x: position.x + size.width / 2, y: position.y + size.height}
    ];
  }

  get position(): Point {
    let centerPos: Point = {
      x: parseInt(this.getAttr("cx")),
      y: parseInt(this.getAttr("cy"))
    }
    let radius: Size = {
      width: parseInt(this.getAttr("rx")),
      height: parseInt(this.getAttr("ry"))
    }

    return {
      x: centerPos.x - radius.width,
      y: centerPos.y - radius.height
    };
  }
  set position(delta: Point) {
    this.setAttr({
      cx: this._lastPosition.x + this._lastSize.width / 2 + delta.x,
      cy: this._lastPosition.y + this._lastSize.height / 2 + delta.y
    });
  }

  override correct(refPoint: Point, lastRefPoint: Point) {
    let delta = this.getCorrectionDelta(refPoint, lastRefPoint);
    if(delta.x == 0 && delta.y == 0) return;

    let position = this.position;
    let size = this.size;

    this.setAttr({
      cx: position.x + size.width / 2 + delta.x,
      cy: position.y + size.height / 2 + delta.y
    });
  }

  drawSize(rect: Rect) {
    this.setSize(rect);
  }

  get size(): Size {
    return {
      width: parseInt(this.getAttr("rx")) * 2,
      height: parseInt(this.getAttr("ry")) * 2
    };
  }

  setSize(rect: Rect, delta: Point | null = null): void {
    if(delta) {
      rect.width = this._lastSize.width * delta.x;
      rect.height = this._lastSize.height * delta.y;
    }

    let rx = rect.width / 2;
    let ry = rect.height / 2;

    /* calculate positive position and size if size is negative */
    if(rect.width < 0) {
      rx = -rx;
      rect.x += rect.width;
    }
    if(rect.height < 0) {
      ry = -ry;
      rect.y += rect.height;
    }

    rect.x += rx;
    rect.y += ry;
    this.setAttr({
      cx: rect.x,
      cy: rect.y,
      rx: rx,
      ry: ry
    });

  }

  get boundingRect(): Rect {
    let points = this.points;
    return this.calculateBoundingBox(points);
  }
  get rotatedBoundingRect(): Rect {
    let containerRect: Rect = this._container.HTML.getBoundingClientRect();
    let stoke = parseInt(this.style.strokeWidth);
    let rotatedBoundingRect: Rect = this.svgElement.getBoundingClientRect();

    rotatedBoundingRect.x += stoke / 2 - containerRect.x;
    rotatedBoundingRect.y += stoke / 2 - containerRect.y;
    rotatedBoundingRect.width -= stoke;
    rotatedBoundingRect.height -= stoke

    return rotatedBoundingRect;
  }

  isComplete(): boolean {
    let size: Size = this.size;
    return size.width > 0 && size.height > 0;
  }

  override toPath(): XPath {
    let path: Path = new Path();
    let size = this.size;
    let rx = size.width / 2;
    let ry = size.height / 2;
    let points = this.rotatedPoints;

    path.add(new MoveTo(points[0]));
    path.add(new Arc(rx, ry, this._angle, 0, 1, points[1]));
    path.add(new Arc(rx, ry, this._angle, 0, 1, points[2]));
    path.add(new Arc(rx, ry, this._angle, 0, 1, points[3]));
    path.add(new Arc(rx, ry, this._angle, 0, 1, points[0]));

    this.setAttr({
      d: path.toString()
    })

    return new XPath(this._container, path);
  }
}
