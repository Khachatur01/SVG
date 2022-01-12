import {Point} from "../../../../../../model/Point";
import {XSVG} from "../../../../../../XSVG";
import {Angle} from "../../../../../math/Angle";
import {XPath} from "../../../../../../element/path/XPath";
import {MoveTo} from "../../../../../../model/path/point/MoveTo";
import {Arc} from "../../../../../../model/path/curve/arc/Arc";
import {LineTo} from "../../../../../../model/path/line/LineTo";
import {XElement} from "../../../../../../element/XElement";
import {Rect} from "../../../../../../model/Rect";

export class XRotatePoint extends XPath {
  private rotating: boolean = false;
  private _start = this.start.bind(this);
  private _move = this.move.bind(this);
  private _end = this.end.bind(this);

  private _r: number = 8;
  private _lineLength: number = 25;
  private _center: Point = {x: 0, y: 0};

  private dAngle: number = 0;

  constructor(container: XSVG, x: number = 0, y: number = 0) {
    super(container);
    this.removeOverEvent();
    this.style.fill = "transparent";
    this.style.strokeColor = "#002fff";
    this.style.strokeWidth = "1";

    this._center = {x: x, y: y};

    this.drawPoint(this._center);
    this.svgElement.style.display = "none";
    this.svgElement.style.cursor = "move";
    this.on();
  }

  override get position(): Point {
    return this._center;
  }

  override set position(position: Point) {
    position.y -= this._lineLength;
    super.position = {
      x: position.x - this._center.x,
      y: position.y - this._center.y
    };
    this._center = position;
  }

  private drawPoint(point: Point): void {
    let x = point.x;
    let y = point.y;
    this.path.setAll([
      new MoveTo({x: x - this._r, y: y}),
      new Arc(this._r, this._r, 0, 0, 1, {x: x + this._r, y: y}),
      new Arc(this._r, this._r, 0, 0, 1, {x: x - this._r, y: y}),
      new MoveTo({x: x, y: y + this._r}),
      new LineTo({x: x, y: y + this._lineLength}),
    ]);
    this.setAttr({
      d: this.path.toString()
    });
  }

  show() {
    this.svgElement.style.display = "block";
  }
  hide() {
    this.svgElement.style.display = "none";
  }

  getAngle(containerRect: Rect, event: MouseEvent): number {
    let x = event.clientX - containerRect.x;
    let y = event.clientY - containerRect.y;

    let angle = Angle.fromPoints(
      {x: 0, y: this.container.focused.refPoint.y},
      this.container.focused.refPoint,
      {x: x, y: y}
    );

    angle -= this.dAngle;

    if(angle < 0)
      angle += 360;

    return angle;
  }

  private start(event: MouseEvent) {
    this.rotating = true;
    this.container.activeTool.off();
    this.container.HTML.addEventListener("mousemove", this._move);

    let containerRect = this.container.HTML.getBoundingClientRect();
    let x = event.clientX - containerRect.left;
    let y = event.clientY - containerRect.top;

    this.dAngle = Angle.fromPoints(
      {x: 0, y: this.container.focused.refPoint.y},
      this.container.focused.refPoint,
      {x: x, y: y}
    ) - this.container.focused.angle;

    this.container.focused.children.forEach((child: XElement) => {
      child.fixAngle();
    });
    this.container.focused.lastAngle = this.getAngle(containerRect, event);
  }
  private move(event: MouseEvent) {
    let angle = this.getAngle(this.container.HTML.getBoundingClientRect(), event);

    if(this.container.grid.isSnap())
      angle = Math.round(angle / 15) * 15;
    this.container.focused.rotate(angle);
  }
  private end() {
    if(!this.rotating) return;

    this.container.selectTool.on();
    this.container.HTML.removeEventListener("mousemove", this._move);
    this.rotating = false;
  }

  on() {
    this.svgElement.addEventListener("mousedown", this._start);
    document.addEventListener("mouseup", this._end);
  }
  off() {
    this.svgElement.removeEventListener("mousedown", this._start);
    this.container.HTML.removeEventListener("mousemove", this._move);
    document.removeEventListener("mouseup", this._end);
  }
}
