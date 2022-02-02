import {EllipseView} from "../../../element/shape/EllipseView";
import {Point} from "../../../model/Point";
import {EditTool} from "./EditTool";
import {Rect} from "../../../model/Rect";
import {Matrix} from "../../math/Matrix";
import {SVG} from "../../../SVG";
import {Callback} from "../../../dataSource/Callback";

export class Node extends EllipseView {
  private readonly editTool: EditTool;
  private readonly order: number;

  private _start = this.onStart.bind(this);
  private _move = this.onMove.bind(this);
  private _end = this.onEnd.bind(this);

  constructor(container: SVG, editTool: EditTool, position: Point, order: number) {
    super(container, position.x - 8, position.y - 8, 8, 8);
    this.removeOverEvent();
    this.style.fillColor = "white";
    this.style.strokeColor = "black";
    this.style.strokeWidth = "1";
    this.svgElement.style.cursor = "move";
    this.editTool = editTool;
    this.order = order;
    this.on();
  }

  protected onStart(): void {
    this.editTool.getContainer().HTML.addEventListener("mousemove", this._move);
    document.addEventListener("mouseup", this._end);
    this._container.call(Callback.NODE_EDIT_START);
  };

  protected onMove(event: MouseEvent): void {
    if (!this.editTool.editableElement) return;

    let containerRect: Rect = this.editTool.getContainer().HTML.getBoundingClientRect();

    let position = this._container.grid.getSnapPoint({
      x: event.clientX - containerRect.x,
      y: event.clientY - containerRect.y
    });

    position = Matrix.rotate(
      [position],
      this.editTool.editableElement.refPoint,
      this.editTool.editableElement.angle
    )[0];

    this.editTool.editableElement.replacePoint(this.order, position);
    this.position = position;
    this._container.call(Callback.NODE_EDIT, {position: position});
  };

  protected onEnd(): void {
    this.editTool.getContainer().HTML.removeEventListener("mousemove", this._move);
    document.removeEventListener("mouseup", this._end);
    this._container.call(Callback.NODE_EDIT_END);
  };

  private on() {
    this.svgElement.addEventListener("mousedown", this._start);
  }

}
