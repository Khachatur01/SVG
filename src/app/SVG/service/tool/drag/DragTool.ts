import {SVG} from "../../../SVG";
import {Point} from "../../../model/Point";
import {ElementView} from "../../../element/ElementView";
import {Tool} from "../Tool";
import {Callback} from "../../../dataSource/Callback";

export class DragTool extends Tool {
  private mouseStartPos: Point = {x: 0, y: 0};
  private elementStartPos: Point = {x: 0, y: 0};

  private _dragStart = this.dragStart.bind(this);
  private _drag = this.drag.bind(this);
  private _dragEnd = this.dragEnd.bind(this);

  constructor(container: SVG) {
    super(container);
  }

  private dragStart(event: MouseEvent | TouchEvent) {
    if (event.target == this._container.HTML) return;
    this._container.HTML.addEventListener("mousemove", this._drag);
    this._container.HTML.addEventListener("touchmove", this._drag);
    document.addEventListener("mouseup", this._dragEnd);
    document.addEventListener("touchend", this._dragEnd);

    let eventPosition = SVG.eventToPosition(event);
    event.preventDefault();

    this.mouseStartPos.x = eventPosition.x;
    this.mouseStartPos.y = eventPosition.y;
    this._container.focused.fixPosition();
    this._container.focused.fixRefPoint();
    this.elementStartPos = this._container.focused.lastRect;

    this._container.focused?.children.forEach((child: ElementView) => {
      child.fixRect();
    });
    this._container.focused.highlight();

    this._container.call(Callback.DRAG_START);
  }

  private drag(event: MouseEvent | TouchEvent) {
    let eventPosition = SVG.eventToPosition(event);
    event.preventDefault();

    let delta = {
      x: eventPosition.x - this.mouseStartPos.x,
      y: eventPosition.y - this.mouseStartPos.y
    };
    this._container.focused.translate = delta;

    this._container.call(Callback.DRAG, {delta: delta});
  }

  private dragEnd(event: MouseEvent | TouchEvent) {
    let eventPosition = SVG.eventToPosition(event);
    event.preventDefault();

    this._container.focused.translate = {
      x: 0,
      y: 0
    };
    let delta = {
      x: eventPosition.x - this.mouseStartPos.x,
      y: eventPosition.y - this.mouseStartPos.y
    };
    this._container.focused.position = delta;

    this._container.HTML.removeEventListener("mousemove", this._drag);
    this._container.HTML.removeEventListener("touchmove", this._drag);
    document.removeEventListener("mouseup", this._dragEnd);
    document.removeEventListener("touchend", this._dragEnd);
    this._container.focused.lowlight();

    this._container.call(Callback.DRAG_END, {delta: delta});
  }

  override on() {
    this._on();
  }

  public _on(): void {
    this._container.HTML.addEventListener("mousedown", this._dragStart);
    this._container.HTML.addEventListener("touchstart", this._dragStart);
    this._isOn = true;

    this._container.call(Callback.DRAG_TOOL_ON);
  }

  public off(): void {
    this._container.HTML.removeEventListener("mousedown", this._dragStart);
    this._container.HTML.removeEventListener("touchstart", this._dragStart);
    this._isOn = false;

    this._container.call(Callback.DRAG_TOOL_OFF);
  }
}
