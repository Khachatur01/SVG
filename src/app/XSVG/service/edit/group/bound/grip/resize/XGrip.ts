import {Point} from "../../../../../../model/Point";
import {XSVG} from "../../../../../../XSVG";
import {Rect} from "../../../../../../model/Rect";
import {XBox} from "../../../../../../element/shape/XBox";
import {Matrix} from "../../../../../math/Matrix";

export abstract class XGrip extends XBox {
  protected container: XSVG;
  private resizing: boolean = false;
  protected _lastResize: Rect = {x: 0, y: 0, width: 0, height: 0};
  private _lastRefPoint: Point = {x: 0, y: 0};
  private _start = this.start.bind(this);
  private _move = this.move.bind(this);
  private _end = this.end.bind(this);

  protected side: number = 10;
  protected halfSide: number = 5;

  constructor(container: XSVG) {
    super(0, 0, 10, 10);
    this.container = container;
    this.svgElement.style.cursor = "crosshair";
    this.setAttr({
      fill: "white",
      "stroke-width": 0.8,
      stroke: "#002fff"
    });

    this.svgElement.style.display = "none";
    this.on();
  }

  override highlight() {
    this.setAttr({
      stroke: "#00ff00"
    });
  }
  override lowlight() {
    this.setAttr({
      stroke: "#002fff"
    });
  }

  show() {
    this.svgElement.style.display = "block";
  }
  hide() {
    this.svgElement.style.display = "none";
  }

  abstract setPosition(points: Point[]): void;

  protected abstract onStart(): void;
  protected abstract onMove(client: Point): void;
  protected abstract onEnd(): void;

  private start(event: MouseEvent) {
    this.resizing = true;
    this.container.activeTool.off();
    this.container.focused.fixRect();
    this.container.focused.fixRefPoint();

    this.container.HTML.addEventListener("mousemove", this._move);
  }
  private move(event: MouseEvent) {
    let containerRect = this.container.HTML.getBoundingClientRect();

    let client: Point = Matrix.rotate(
      [{x: event.clientX - containerRect.x, y: event.clientY - containerRect.y}],
      this.container.focused.refPoint,
      this.container.focused.angle
    )[0];

    this.onMove(client);

    // this._lastRefPoint = this.container.focused.getRefPointByRect(this._lastResize);
    // this.container.focused.refPointView = this._lastRefPoint;
  }
  private end() {
    if(!this.resizing) return;

    // this.container.focused.refPoint = this._lastRefPoint;
    // this.container.focused.correct(this._lastRefPoint);

    this.container.HTML.removeEventListener("mousemove", this._move);
    this.container.activeTool.on();
    this.resizing = false;
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
