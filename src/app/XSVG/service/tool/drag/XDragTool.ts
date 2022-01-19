import {XSVG} from "../../../XSVG";
import {Point} from "../../../model/Point";
import {XElement} from "../../../element/XElement";
import {XTool} from "../XTool";

export class XDragTool extends XTool {
  private isDrag: boolean = false;

  private mouseStartPos: Point = {x: 0, y: 0};
  private elementStartPos: Point = {x: 0, y: 0};

  private dragStart = this.onDragStart.bind(this);
  private drag = this.onDrag.bind(this);
  private dragEnd = this.onDragEnd.bind(this);

  constructor(container: XSVG) {
    super(container);
  }

  private onDragStart(event: MouseEvent) {
    if(event.target == this.container.HTML) return;
    this.mouseStartPos.x = event.clientX;

    this.mouseStartPos.y = event.clientY;
    this.elementStartPos = this.container.focused?.position as Point;
    this.container.focused.fixPosition();

    this.container.focused.fixRefPoint();
    this.container.focused?.children.forEach((child: XElement) => {
      child.fixRect();
    });
    this.container.focused.highlight();

    this.container.HTML.addEventListener("mousemove", this.drag);
    document.addEventListener("mouseup", this.dragEnd);
  }
  private onDrag(event: MouseEvent) {
    this.container.focused.position = {
      x: event.clientX - this.mouseStartPos.x,
      y: event.clientY - this.mouseStartPos.y
    };
  }
  private onDragEnd() {
    this.container.HTML.removeEventListener("mousemove", this.drag);
    document.removeEventListener("mouseup", this.dragEnd);
    this.container.focused.lowlight();
  }

  override on() {
    this._on();
  }

  public _on(): void {
    this.container.HTML.addEventListener("mousedown", this.dragStart);
    this.isDrag = true;
  }

  public off(): void {
    this.container.HTML.removeEventListener("mousedown", this.dragStart);
    this.isDrag = false;
  }

  public isOn(): boolean {
    return this.isDrag;
  }
}
