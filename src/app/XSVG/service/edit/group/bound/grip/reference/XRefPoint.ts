import {XSVG} from "../../../../../../XSVG";
import {MoveTo} from "../../../../../../model/path/point/MoveTo";
import {Arc} from "../../../../../../model/path/curve/arc/Arc";
import {LineTo} from "../../../../../../model/path/line/LineTo";
import {XPath} from "../../../../../../element/path/XPath";
import {Point} from "../../../../../../model/Point";

export class XRefPoint extends XPath {
  private container: XSVG;
  private readonly _r: number = 5; /* radius */
  private _center: Point = {x: 0, y: 0};

  private lastPoint: Point = {x: 0, y: 0};

  private moving: boolean = false;
  private _start = this.start.bind(this);
  private _move = this.move.bind(this);
  private _end = this.end.bind(this);

  constructor(container: XSVG, x: number = 0, y: number = 0) {
    super();
    this.container = container;
    this.removeOverEvent();
    this.setStyle({
      fill: "transparent",
      stroke: "#002fff",
      "stroke-width": 0.7,
    });

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
    this._center = position;
    this.drawPoint(position);
  }

  get r(): number {
    return this._r;
  }

  private drawPoint(point: Point): void {
    let x = point.x;
    let y = point.y;
    this.path.setAll([
      new MoveTo({x: x - this._r, y: y}),
      new Arc(this._r, this._r, 0, 0, 1, {x: x + this._r, y: y}),
      new Arc(this._r, this._r, 0, 0, 1, {x: x - this._r, y: y}),
      new MoveTo({x: x - this._r - 2, y: y}),
      new LineTo({x: x + this._r + 2, y: y}),
      new MoveTo({x: x, y: y - this._r - 2}),
      new LineTo({x: x, y: y + this._r + 2})
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

  private start() {
    this.moving = true;
    this.container.activeTool.off();
    this.container.focused.fixRect();
    this.container.HTML.addEventListener("mousemove", this._move);
  }
  private move(event: MouseEvent) {
    let containerRect = this.container.HTML.getBoundingClientRect();

    this.lastPoint.x = event.clientX - containerRect.left;
    this.lastPoint.y = event.clientY - containerRect.top;

    this.container.focused.refPointView = {x: this.lastPoint.x, y: this.lastPoint.y};
  }
  private end() {
    if(!this.moving) return;

    this.container.focused.refPoint = {x: this.lastPoint.x, y: this.lastPoint.y};

    this.container.HTML.removeEventListener("mousemove", this._move);
    this.container.activeTool.on();
    this.moving = false;
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
