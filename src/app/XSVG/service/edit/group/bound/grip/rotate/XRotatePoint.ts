import {XEllipse} from "../../../../../../element/shape/XEllipse";
import {Point} from "../../../../../../model/Point";
import {XSVG} from "../../../../../../XSVG";
import {Angle} from "../../../../../math/Angle";

export class XRotatePoint extends XEllipse {
  private container: XSVG;

  private rotating: boolean = false;
  private _start = this.start.bind(this);
  private _move = this.move.bind(this);
  private _end = this.end.bind(this);

  private dAngle: number = 0;

  constructor(container: XSVG, x: number = 0, y: number = 0) {
    super(x - 8, y - 8, 8, 8);
    this.container = container;
    this.removeOverEvent();
    this.setStyle({
      fill: "transparent",
      stroke: "#002fff",
      "stroke-width": 1,
    });

    this.svgElement.style.display = "none";
    this.svgElement.style.cursor = "move";
    this.on();
  }

  override get position(): Point {
    let position = super.position;
    return {
      x: position.x + 8,
      y: position.y + 8
    };
  }

  override set position(position: Point) {
    super.position = {
      x: position.x - 8,
      y: position.y - 8
    };
  }

  show() {
    this.svgElement.style.display = "block";
  }
  hide() {
    this.svgElement.style.display = "none";
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
  }
  private move(event: MouseEvent) {
    let containerRect = this.container.HTML.getBoundingClientRect();

    let x = event.clientX - containerRect.left;
    let y = event.clientY - containerRect.top;

    let angle = Angle.fromPoints(
      {x: 0, y: this.container.focused.refPoint.y},
      this.container.focused.refPoint,
      {x: x, y: y}
    );

    angle -= this.dAngle;

    if(angle < 0)
      angle += 360;

    this.container.focused.rotate(angle);
  }
  private end() {
    if(!this.rotating) return;

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
