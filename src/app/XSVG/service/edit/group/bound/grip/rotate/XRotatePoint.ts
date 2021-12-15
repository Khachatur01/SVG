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
    this.rotating = true;
    this.container.activeTool.off();
    this.container.HTML.addEventListener("mousemove", this._move);
  }
  private move(event: MouseEvent) {
    let containerRect = this.container.HTML.getBoundingClientRect();

    let x = event.clientX - containerRect.left;
    let y = event.clientY - containerRect.top;

    this.container.focused.rotate(this.container.focused.refPoint,
      Angle.fromPoints(
        {x: this.container.focused.refPoint.x, y: 0},
        this.container.focused.refPoint,
        {x: x, y: y}
      )
    );
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
