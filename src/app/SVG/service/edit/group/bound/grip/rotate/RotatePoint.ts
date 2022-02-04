import {Point} from "../../../../../../model/Point";
import {SVG} from "../../../../../../SVG";
import {Angle} from "../../../../../math/Angle";
import {PathView} from "../../../../../../element/shape/pointed/PathView";
import {MoveTo} from "../../../../../../model/path/point/MoveTo";
import {Arc} from "../../../../../../model/path/curve/arc/Arc";
import {LineTo} from "../../../../../../model/path/line/LineTo";
import {ElementView} from "../../../../../../element/ElementView";
import {Rect} from "../../../../../../model/Rect";
import {Callback} from "../../../../../../dataSource/Callback";

export class RotatePoint extends PathView {
  private _start = this.start.bind(this);
  private _move = this.move.bind(this);
  private _end = this.end.bind(this);

  private _r: number = 8;
  private _lineLength: number = 25;
  private _center: Point = {x: 0, y: 0};
  private dAngle: number = 0; /* delta angle */

  public constructor(container: SVG, x: number = 0, y: number = 0) {
    super(container);
    this.removeOverEvent();
    this.style.fillColor = "transparent";
    this.style.strokeColor = "#002fff";
    this.style.strokeWidth = "1";

    this._center = {x: x, y: y};

    this.drawPoint(this._center);
    this.svgElement.style.display = "none";
    this.svgElement.style.cursor = "move";
    this.on();
  }

  public override get position(): Point {
    return this._center;
  }
  public override set position(position: Point) {
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
    this._path.setAll([
      new MoveTo({x: x - this._r, y: y}),
      new Arc(this._r, this._r, 0, 0, 1, {x: x + this._r, y: y}),
      new Arc(this._r, this._r, 0, 0, 1, {x: x - this._r, y: y}),
      new MoveTo({x: x, y: y + this._r}),
      new LineTo({x: x, y: y + this._lineLength}),
    ]);
    this.setAttr({
      d: this._path.toString()
    });
  }

  public show() {
    this.svgElement.style.display = "block";
  }
  public hide() {
    this.svgElement.style.display = "none";
  }

  public getAngle(containerRect: Rect, event: MouseEvent): number {
    let x = event.clientX - containerRect.x;
    let y = event.clientY - containerRect.y;

    let angle = Angle.fromPoints(
      {x: 0, y: this._container.focused.refPoint.y},
      this._container.focused.refPoint,
      {x: x, y: y}
    );

    angle -= this.dAngle;

    if (angle < 0)
      angle += 360;

    return angle;
  }

  private start(event: MouseEvent) {
    this._container.activeTool.off();
    this._container.HTML.addEventListener("mousemove", this._move);
    document.addEventListener("mouseup", this._end);

    let containerRect = this._container.HTML.getBoundingClientRect();
    let x = event.clientX - containerRect.left;
    let y = event.clientY - containerRect.top;

    this.dAngle = Angle.fromPoints(
      {x: 0, y: this._container.focused.refPoint.y},
      this._container.focused.refPoint,
      {x: x, y: y}
    ) - this._container.focused.angle;

    this._container.focused.children.forEach((child: ElementView) => {
      child.fixAngle();
    });
    this._container.focused.lastAngle = this.getAngle(containerRect, event);

    this._container.call(Callback.ROTATE_START);
  }
  private move(event: MouseEvent) {
    let angle = this.getAngle(this._container.HTML.getBoundingClientRect(), event);
    if (this._container.grid.isSnap())
      angle = Math.round(angle / 15) * 15;
    this._container.focused.rotate(angle);
  }
  private end() {
    this._container.selectTool.on();
    this._container.HTML.removeEventListener("mousemove", this._move);
    document.removeEventListener("mouseup", this._end);

    this._container.call(Callback.ROTATE_END);
  }

  public on() {
    this.svgElement.addEventListener("mousedown", this._start);
  }
  public off() {
    this.svgElement.removeEventListener("mousedown", this._start);
  }
}
