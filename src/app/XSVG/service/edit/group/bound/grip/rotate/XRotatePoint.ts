import {XEllipse} from "../../../../../../element/shape/XEllipse";
import {Point} from "../../../../../../model/Point";
import {XSVG} from "../../../../../../XSVG";

export class XRotatePoint extends XEllipse {
  private container: XSVG;

  private moving: boolean = false;
  private _start = this.start.bind(this);
  private _move = this.move.bind(this);
  private _end = this.end.bind(this);

  constructor(container: XSVG, x: number = 0, y: number = 0) {
    super(x - 5, y - 5, 5, 5);
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
      x: position.x + 5,
      y: position.y + 5
    };
  }

  override set position(position: Point) {
    super.position = {
      x: position.x - 5,
      y: position.y - 5
    };
  }

  show() {
    this.svgElement.style.display = "block";
  }
  hide() {
    this.svgElement.style.display = "none";
  }

  private start() {
    this.container.HTML.addEventListener("mousemove", this._move);
  }
  private move(event: MouseEvent) {

  }
  private end() {
    if(!this.moving) return;

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
