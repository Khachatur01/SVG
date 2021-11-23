import {XDrawable} from "../../XDrawable";
import {XFree} from "../../../../element/line/XFree";
import {XSVG} from "../../../../XSVG";

export class DrawFree implements XDrawable {
  private container: XSVG | null = null;
  private drawableElement: XFree | null = null;
  private _onStart = this.onStart.bind(this);
  private _onDraw = this.onDraw.bind(this);
  private _onEnd = this.onEnd.bind(this);

  onStart(event: MouseEvent) {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;

    let x1 = event.clientX - containerRect.left; //x position within the element.
    let y1 = event.clientY - containerRect.top;  //y position within the element.

    this.drawableElement = new XFree([
      {x: x1, y: y1}
    ]);
    if(this.drawableElement.boundingBox)
      this.drawableElement.boundingBox.SVG.style.display = "none";


    this.container?.add(this.drawableElement);
    this.container?.HTML.addEventListener('mousemove', this._onDraw);
  }

  onDraw(event: MouseEvent): void {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;
    let nextX = event.clientX - containerRect.left;
    let nextY = event.clientY - containerRect.top;

    if(!this.drawableElement) return;

    this.drawableElement.setAttr({
      points: this.drawableElement.getAttr("points") + " " + nextX + " " + nextY
    });
  }

  onEnd() {
    if(!this.drawableElement) return;

    if(this.drawableElement.getAttr("points").split(" ").length == 2)
      this.drawableElement.remove();

    this.container?.HTML.removeEventListener('mousemove', this._onDraw);

    /* calculate and set bounding box position and size */
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;
    let bBoxPosition: DOMRect = this.drawableElement.SVG.getBoundingClientRect();
    bBoxPosition.x -= containerRect.left;
    bBoxPosition.y -= containerRect.top;
    this.drawableElement.boundingBox?.setAttr({
      x: bBoxPosition.x,
      y: bBoxPosition.y,
      width: bBoxPosition.width,
      height: bBoxPosition.height
    });

    /* selects drawing on draw end */
    this.container?.focus(this.drawableElement);
  }

  set perfect(mode: boolean) {
  }

  start(container: XSVG): void {
    this.container = container;
    container.HTML.addEventListener('mousedown', this._onStart);
    document.addEventListener('mouseup', this._onEnd);
  }

  stop(): void {
    this.container?.HTML.removeEventListener('mousemove', this._onDraw);
    this.container?.HTML.removeEventListener('mousedown', this._onStart);
    document.removeEventListener('mouseup', this._onEnd);
  }

}
