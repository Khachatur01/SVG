import {XDrawable} from "../XDrawable";
import {XSVG} from "../../../XSVG";
import {XElement} from "../../../element/XElement";

export abstract class ClickDraw implements XDrawable {
  private container: XSVG | null = null;
  private perfectMode: boolean = false;
  private drawableElement: XElement | null = null;
  private click = this._click.bind(this);
  private move = this._move.bind(this);

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

  abstract onClick(containerRect: DOMRect, event: MouseEvent): XElement | null;
  abstract onMove(containerRect: DOMRect, event: MouseEvent, perfectMode: boolean): void;
  abstract onStop(): void;

  start(container: XSVG): void {
    this.container = container;
    container.HTML.addEventListener('mousedown', this.click);
    document.addEventListener("mousemove", this.move);
  }

  stop(): void {
    this.container?.HTML.removeEventListener('mousedown', this.click);
    document.removeEventListener('mousemove', this.move);
    this.onStop();
    if(this.drawableElement && this.container) {
      this.container.drawTool.drawingEnd();
      this.container?.focus(this.drawableElement);
    }
  }

  set perfect(mode: boolean) {
    this.perfectMode = mode;
  }
}
