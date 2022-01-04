import {XEllipse} from "../../../element/shape/XEllipse";
import {Point} from "../../../model/Point";
import {XEditTool} from "./XEditTool";
import {Rect} from "../../../model/Rect";
import {Matrix} from "../../math/Matrix";
import {XSVG} from "../../../XSVG";

export class XNode extends XEllipse {
  private readonly editTool: XEditTool;
  private readonly order: number;
  private editing: boolean = false;

  private _start = this.onStart.bind(this);
  private _move = this.onMove.bind(this);
  private _end = this.onEnd.bind(this);

  constructor(container: XSVG, editTool: XEditTool, position: Point, order: number) {
    super(container, position.x - 8, position.y - 8, 8, 8);
    this.removeOverEvent();
    this.setAttr({
      fill: "white",
      stroke: "black",
      "stroke-width": "1",
    });
    this.on();
    this.svgElement.style.cursor = "move";
    this.editTool = editTool;
    this.order = order;
  }

  protected onStart(): void {
    this.editing = true;
    this.editTool.getContainer().HTML.addEventListener("mousemove", this._move);
  };
  protected onMove(event: MouseEvent): void {
    if(!this.editTool.editableElement) return;

    let containerRect: Rect = this.editTool.getContainer().HTML.getBoundingClientRect();
    let position: Point = Matrix.rotate(
      [{x: event.clientX - containerRect.x, y: event.clientY - containerRect.y}],
      this.editTool.editableElement.refPoint,
      this.editTool.editableElement.angle
    )[0];

    this.editTool.editableElement.replacePoint(this.order, position);
    this.position = position;
  };
  protected onEnd(): void {
    if(!this.editing) return;
    this.editTool.getContainer().HTML.removeEventListener("mousemove", this._move);
    this.editing = true;
  };

  private on() {
    this.svgElement.addEventListener("mousedown", this._start);
    document.addEventListener("mouseup", this._end);
  }

}
