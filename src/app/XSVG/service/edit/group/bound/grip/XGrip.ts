import {Point} from "../../../../../model/Point";
import {XRectangle} from "../../../../../element/shape/XRectangle";
import {XSVG} from "../../../../../XSVG";
import {Rect} from "../../../../../model/Rect";

export abstract class XGrip extends XRectangle {
  protected container: XSVG;
  private _start = this.start.bind(this);
  private _move = this.move.bind(this);
  private _end = this.end.bind(this);

  protected side: number = 8;
  protected constructor(container: XSVG, cursor: string) {
    super(0, 0, 8, 8);
    this.container = container;
    this.svgElement.style.cursor = cursor;
    this.setAttr({
      fill: "white",
      "stroke-width": 1,
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
  protected abstract onMove(containerRect: Rect, event: MouseEvent): void;
  protected abstract onEnd(): void;

  private start() {
    this.container.activeTool.off();
    this.container.focused.fixRect();
    this.container.HTML.addEventListener("mousemove", this._move);
  }
  private move(event: MouseEvent) {
    let containerRect = this.container.HTML.getBoundingClientRect();
    this.onMove(containerRect, event);
  }
  private end() {
    this.container.HTML.removeEventListener("mousemove", this._move);
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
