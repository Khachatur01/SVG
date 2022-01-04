import {Size} from "../../model/Size";
import {Point} from "../../model/Point";
import {Rect} from "../../model/Rect";
import {XElement} from "../XElement";
import {XSVG} from "../../XSVG";

export class XEllipse extends XElement {
  constructor(container: XSVG, x: number = 0, y: number = 0, rx: number = 0, ry: number = 0) {
    super(container);
    this.svgElement = document.createElementNS(XElement.svgURI, "ellipse");

    this.position = {x: x, y: y};
    this.setSize({x: x, y: y, width: rx * 2, height: ry * 2});

    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  override get rotatedBoundingRect(): Rect {
    let containerRect: Rect = this.container.HTML.getBoundingClientRect();
    let stoke = parseInt(this.style.strokeWidth);
    let rotatedBoundingRect: Rect = this.svgElement.getBoundingClientRect();

    rotatedBoundingRect.x += stoke / 2 - containerRect.x;
    rotatedBoundingRect.y += stoke / 2 - containerRect.y;
    rotatedBoundingRect.width -= stoke;
    rotatedBoundingRect.height -= stoke

    return rotatedBoundingRect;
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

  setSize(rect: Rect): void {
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

  get size(): Size {
    return {
      width: parseInt(this.getAttr("rx")) * 2,
      height: parseInt(this.getAttr("ry")) * 2
    };
  }

  isComplete(): boolean {
    let size: Size = this.size;
    return size.width > 0 && size.height > 0;
  }
}







/* make ellipse from path, with 4 arcs
   makeEllipse(x: number, y: number, rx: number, ry: number): void {
     let path: Path = new Path();

     if(rx < 0) {
       rx = -rx;
       x -= rx * 2;
     }
     if(ry < 0) {
       ry = -ry;
       y -= ry * 2;
     }

     let points: Point[] = [
       {x:        x,  y: ry   + y},
       {x: rx   + x,  y:        y},
       {x: rx*2 + x,  y: ry   + y},
       {x: rx   + x,  y: ry*2 + y},
       {x: x,         y: ry   + y}
     ];

     path.add(new MoveTo(points[0]));
     path.add(new Arc(rx, ry, 0, 0, 1, points[1]));
     path.add(new Arc(rx, ry, 0, 0, 1, points[2]));
     path.add(new Arc(rx, ry, 0, 0, 1, points[3]));
     path.add(new Arc(rx, ry, 0, 0, 1, points[4]));

     this.path = path;
     this.setAttr({
       d: path.toString()
     })
   }
*/
