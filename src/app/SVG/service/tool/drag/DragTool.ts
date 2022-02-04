import {SVG} from "../../../SVG";
import {Point} from "../../../model/Point";
import {ElementView} from "../../../element/ElementView";
import {Tool} from "../Tool";
import {Callback} from "../../../dataSource/Callback";

export class DragTool extends Tool {
  private mouseStartPos: Point = {x: 0, y: 0};
  private elementStartPos: Point = {x: 0, y: 0};

  private dragStart = this.onDragStart.bind(this);
  private drag = this.onDrag.bind(this);
  private dragEnd = this.onDragEnd.bind(this);

  constructor(container: SVG) {
    super(container);
  }

  private onDragStart(event: MouseEvent) {
    if (event.target == this._container.HTML) return;
    this.mouseStartPos.x = event.clientX;
    this.mouseStartPos.y = event.clientY;
    this._container.focused.fixPosition();
    this._container.focused.fixRefPoint();
    this.elementStartPos = this._container.focused.lastRect;

    this._container.focused?.children.forEach((child: ElementView) => {
      child.fixRect();
    });
    this._container.focused.highlight();

    this._container.HTML.addEventListener("mousemove", this.drag);
    document.addEventListener("mouseup", this.dragEnd);

    this._container.call(Callback.DRAG_START);
  }

  private onDrag(event: MouseEvent) {
    let delta = {
      x: event.clientX - this.mouseStartPos.x,
      y: event.clientY - this.mouseStartPos.y
    };
    this._container.focused.translate = delta;

    this._container.call(Callback.DRAG, {delta: delta});
  }

  private onDragEnd(event: MouseEvent) {
    this._container.focused.translate = {
      x: 0,
      y: 0
    };
    let delta = {
      x: event.clientX - this.mouseStartPos.x,
      y: event.clientY - this.mouseStartPos.y
    };
    this._container.focused.position = delta;

    this._container.HTML.removeEventListener("mousemove", this.drag);
    document.removeEventListener("mouseup", this.dragEnd);
    this._container.focused.lowlight();

    this._container.call(Callback.DRAG_END, {delta: delta});
  }

  override on() {
    this._on();
  }

  public _on(): void {
    this._container.HTML.addEventListener("mousedown", this.dragStart);
    this._isOn = true;

    this._container.call(Callback.DRAG_TOOL_ON);
  }

  public off(): void {
    this._container.HTML.removeEventListener("mousedown", this.dragStart);
    this._isOn = false;

    this._container.call(Callback.DRAG_TOOL_OFF);
  }
}
