import {XElement} from "../XElement";
import {Point} from "../../model/Point";
import {Size} from "../../model/Size";
import {Rect} from "../../model/Rect";

export abstract class XPointed extends XElement {
  protected _size: Size = {width: 0, height: 0};
  protected _lastPoints: Point[] = [];
  abstract get points(): Point[]
  abstract set points(points: Point[]);
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
    let position = this.position;

    for(let point of points) {
      point.x += (delta.x - position.x + this._lastPosition.x);
      point.y += (delta.y - position.y + this._lastPosition.y);
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
        maxX = points[i].x
      if(points[i].y > maxY)
        maxY = points[i].y
      if(points[i].x < minX)
        minX = points[i].x
      if(points[i].y < minY)
        minY = points[i].y
    }

    this._size = {
      width: maxX - minX,
      height: maxY - minY
    };

    return this._size;
  }
  setSize(rect: Rect): void {
    let dw = 1;
    let dh = 1;

    if(this._lastSize.width != 0)
      dw = rect.width / this._lastSize.width;
    if(this._lastSize.height != 0)
      dh = rect.height / this._lastSize.height;

    let points = this.points;
    for(let i = 0; i < points.length; i++){
      points[i].x = rect.x + (this._lastPoints[i].x - rect.x) * dw;
      points[i].y = rect.y + (this._lastPoints[i].y - rect.y) * dh;
    }

    this.points = points;
  }
}
