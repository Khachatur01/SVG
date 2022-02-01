import {SVG} from "../../../SVG";
import {Point} from "../../../model/Point";
import {ElementView} from "../../../element/ElementView";
import {Tool} from "../Tool";
import {Callback} from "../../../dataSource/Callback";

export class DragTool extends Tool {
  private isDrag: boolean = false;

  private mouseStartPos: Point = {x: 0, y: 0};
  private elementStartPos: Point = {x: 0, y: 0};

  private dragStart = this.onDragStart.bind(this);
  private drag = this.onDrag.bind(this);
  private dragEnd = this.onDragEnd.bind(this);

  constructor(container: SVG) {
    super(container);
  }

  private onDragStart(event: MouseEvent) {
    if (event.target == this.container.HTML) return;
    this.mouseStartPos.x = event.clientX;
    this.mouseStartPos.y = event.clientY;
    this.container.focused.fixPosition();
    this.container.focused.fixRefPoint();
    this.elementStartPos = this.container.focused.lastRect;

    this.container.focused?.children.forEach((child: ElementView) => {
      child.fixRect();
    });
    this.container.focused.highlight();

    this.container.HTML.addEventListener("mousemove", this.drag);
    document.addEventListener("mouseup", this.dragEnd);

    this.container.call(Callback.DRAG_START);
  }

  private onDrag(event: MouseEvent) {
    this.container.focused.translate = {
      x: event.clientX - this.mouseStartPos.x,
      y: event.clientY - this.mouseStartPos.y
    };

    this.container.call(Callback.DRAG);
  }

  private onDragEnd(event: MouseEvent) {
    this.container.focused.translate = {
      x: 0,
      y: 0
    };
    this.container.focused.position = {
      x: event.clientX - this.mouseStartPos.x,
      y: event.clientY - this.mouseStartPos.y
    };

    this.container.HTML.removeEventListener("mousemove", this.drag);
    document.removeEventListener("mouseup", this.dragEnd);
    this.container.focused.lowlight();

    this.container.call(Callback.DRAG_END);
  }

  override on() {
    this._on();
  }

  public _on(): void {
    this.container.HTML.addEventListener("mousedown", this.dragStart);
    this.isDrag = true;

    this.container.call(Callback.DRAG_TOOL_ON);
  }

  public off(): void {
    this.container.HTML.removeEventListener("mousedown", this.dragStart);
    this.isDrag = false;

    this.container.call(Callback.DRAG_TOOL_OFF);
  }

  public isOn(): boolean {
    return this.isDrag;
  }
}
