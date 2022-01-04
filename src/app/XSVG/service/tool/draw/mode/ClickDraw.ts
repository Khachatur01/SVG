import {XDrawable} from "../XDrawable";
import {XSVG} from "../../../../XSVG";
import {XPointed} from "../../../../element/type/XPointed";

export abstract class ClickDraw implements XDrawable {
  protected container: XSVG;
  private perfectMode: boolean = false;
  protected drawableElement: XPointed | null = null;
  private click = this._click.bind(this);
  private move = this._move.bind(this);

  constructor(container: XSVG) {
    this.container = container;
  }

  _click(event: MouseEvent) {
    if(!this.container) return;

    this.container.drawTool.drawing();

    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;

    let element = this.onClick(containerRect, event);
    if(element) {
      this.drawableElement = element;
      this.container?.add(this.drawableElement);
    }
  }
  _move(event: MouseEvent) {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;

    this.onMove(containerRect, event, this.perfectMode);
  }

  abstract onClick(containerRect: DOMRect, event: MouseEvent): XPointed | null;
  onMove(containerRect: DOMRect, event: MouseEvent, perfectMode: boolean): void {
    if(!this.drawableElement) return;

    let x = event.clientX - containerRect.left; //x position within the element.
    let y = event.clientY - containerRect.top;  //y position within the element.

    this.drawableElement.replacePoint(-1,{x: x, y: y});
  };

  start(container: XSVG): void {
    this.container = container;
    this.container.HTML.addEventListener('mousedown', this.click);
    document.addEventListener("mousemove", this.move);
  }

  stop(): void {
    this.container?.HTML.removeEventListener('mousedown', this.click);
    document.removeEventListener('mousemove', this.move);
    if(!this.drawableElement || !this.container) return;

    if (this.drawableElement.isComplete()) {
      this.drawableElement.removePoint(-1);
      this.container.drawTool.drawingEnd();

      this.drawableElement.refPoint = this.drawableElement.center;

      this.container.focus(this.drawableElement);
      this.container.focused.fixRect();
    } else {
      this.container.remove(this.drawableElement);
    }
    this.drawableElement = null;
  }

  set perfect(mode: boolean) {
    this.perfectMode = mode;
  }
}
