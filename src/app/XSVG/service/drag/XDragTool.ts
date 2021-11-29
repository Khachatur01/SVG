import {XSVG} from "../../XSVG";
import {Point} from "../../model/Point";
import {XFocus} from "../edit/group/XFocus";
import {XDraggable} from "./XDraggable";
import {XElement} from "../../element/XElement";

export class XDragTool {
  private isDrag: boolean = false;
  private container: XSVG;

  private mouseStartPos: Point = {x: 0, y: 0};
  private elementStartPos: Point = {x: 0, y: 0};

  private dragStart = this.onDragStart.bind(this);
  private drag = this.onDrag.bind(this);
  private dragEnd = this.onDragEnd.bind(this);

  constructor(container: XSVG) {
    this.container = container;
  }

  private onDragStart(event: MouseEvent) {
    this.mouseStartPos.x = event.clientX;
    this.mouseStartPos.y = event.clientY;
    this.elementStartPos = this.container.focused?.position as Point;

    this.container.focused.fixPosition();
    this.container.focused?.children.forEach((child: XElement) => {
      child.fixPosition();
    });

    this.container.HTML.addEventListener("mousemove", this.drag);
  }
  private onDrag(event: MouseEvent) {
    let newX = this.elementStartPos.x + event.clientX - this.mouseStartPos.x;
    let newY = this.elementStartPos.y + event.clientY - this.mouseStartPos.y;
    this.container.focused.position = {x: newX, y: newY} as Point;
    this.container.focused.highlight();
  }
  private onDragEnd(){
    this.container.HTML.removeEventListener("mousemove", this.drag);
    this.container.focused.lowlight();
  }

  public on(): void {
    this.isDrag = true;
    this.container.HTML.addEventListener("mousedown", this.dragStart);
    document.addEventListener("mouseup", this.dragEnd);
  }

  public off(): void {
    this.isDrag = false;
    this.container.HTML.removeEventListener("mousedown", this.dragStart);
    this.container.HTML.removeEventListener("mousemove", this.drag);
    document.removeEventListener("mouseup", this.dragEnd);
  }

  public isOn(): boolean {
    return this.isDrag;
  }
}
