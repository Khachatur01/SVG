import {XElement} from "../XElement";
import {Point} from "../../model/Point";
import {Size} from "../../model/Size";
import {Rect} from "../../model/Rect";

export abstract class XPointed extends XElement {
  protected _size: Size = {width: 0, height: 0};
  abstract get points(): Point[]
  abstract set points(points: Point[]);
  abstract pushPoint(point: Point): void;
  abstract removePoint(index: number): void;
  abstract replacePoint(index: number, point: Point): void;

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
    let dx = 1;
    let dy = 1;

    if(this._size.width != 0)
      dx = rect.width / this._size.width;
    if(this._size.height != 0)
      dy = rect.height / this._size.height;

    let points = this.points;
    for(let point of points){
      point.x = rect.x + (point.x - rect.x) * dx;
      point.y = rect.y + (point.y - rect.y) * dy;
    }

    this.points = points;

    this._size = rect;
  }
}
