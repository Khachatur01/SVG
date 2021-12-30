import {XDrawable} from "../XDrawable";
import {XFree} from "../../../../element/pointed/XFree";
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
    if (!this.drawableElement || !this.container) return;

    this.container.HTML.removeEventListener('mousemove', this._onDraw);

    if (this.drawableElement.getAttr("points").split(" ").length == 2) {
      this.container.remove(this.drawableElement);
    } else {
      this.drawableElement.refPoint = this.drawableElement.center;

      this.container.focus(this.drawableElement);
      this.container.focused.fixRect();
    }
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
