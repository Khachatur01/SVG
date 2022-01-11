import {XElement} from "../XElement";
import {Point} from "../../model/Point";
import {Size} from "../../model/Size";
import {Rect} from "../../model/Rect";
import {XPath} from "../path/XPath";
import {Path} from "../../model/path/Path";
import {MoveTo} from "../../model/path/point/MoveTo";
import {LineTo} from "../../model/path/line/LineTo";

export abstract class XPointed extends XElement {
  protected _lastPoints: Point[] = [];
  override set points(points: Point[]) {};
  abstract getPoint(index: number): Point;
  abstract pushPoint(point: Point): void;
  abstract removePoint(index: number): void;
  abstract replacePoint(index: number, point: Point): void;

  override fixRect() {
    super.fixRect();
    this.fixPoints();
  }
  fixPoints() {
    this._lastPoints = this.points.slice();
  }

  get position(): Point {
    let points = this.points;
    let leftTop: Point = points[0];

    for(let i = 1; i < points.length; i++) {
      if (points[i].x < leftTop.x)
        leftTop.x = points[i].x;
      if (points[i].y < leftTop.y)
        leftTop.y = points[i].y;
    }
    return leftTop;
  }
  set position(delta: Point) {
    let points = this.points;

    for(let i = 0; i < points.length; i++) {
      if(!this._lastPoints[i])
        this._lastPoints[i] = {x: points[i].x, y: points[i].y};

      points[i].x = (delta.x + this._lastPoints[i].x);
      points[i].y = (delta.y + this._lastPoints[i].y);
    }

    this.points = points;
  }

  override correct(refPoint:Point, lastRefPoint:Point) {
    let delta = this.getCorrectionDelta(refPoint, lastRefPoint);
    if(delta.x == 0 && delta.y == 0) return;

    let points = this.points;

    for(let i = 0; i < points.length; i++) {
      this._lastPoints[i] = {x: points[i].x, y: points[i].y};

      points[i].x = (delta.x + this._lastPoints[i].x);
      points[i].y = (delta.y + this._lastPoints[i].y);
    }

    this.points = points;
  }
  get size(): Size {
    let points = this.points
    let maxX = points[0].x;
    let maxY = points[0].y;
    let minX = points[0].x;
    let minY = points[0].y;

    for(let i = 1; i < points.length; i++) {
      if(points[i].x > maxX)
        maxX = points[i].x;
      if(points[i].y > maxY)
        maxY = points[i].y;
      if(points[i].x < minX)
        minX = points[i].x;
      if(points[i].y < minY)
        minY = points[i].y;
    }

    return  {
      width: maxX - minX,
      height: maxY - minY
    };
  }
  setSize(rect: Rect): void {
    let dw = 1;
    let dh = 1;

    if(this._lastSize.width != 0)
      dw = rect.width / this._lastSize.width;
    if(this._lastSize.height != 0)
      dh = rect.height / this._lastSize.height;

    let points = this.points;
    for(let i = 0; i < points.length; i++) {
      /* points may not be fixed, and this._lastPoints[i] may be undefined */
      if(!this._lastPoints[i]) this._lastPoints[i] = {x: 0, y: 0};

      points[i].x = rect.x + Math.abs(this._lastPoints[i].x - rect.x) * dw;
      points[i].y = rect.y + Math.abs(this._lastPoints[i].y - rect.y) * dh;
    }

    this.points = points;
  }

  override toPath(): XPath {
    let rotatedPoints = this.rotatedPoints;
    let path = new Path();

    path.add(new MoveTo(rotatedPoints[0]));
    for(let i = 1; i < rotatedPoints.length; i++)
      path.add(new LineTo(rotatedPoints[i]));

    return new XPath(this.container, path);
  }
}
