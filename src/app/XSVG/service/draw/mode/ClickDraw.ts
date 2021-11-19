import {XDrawable} from "../XDrawable";
import {XSVG} from "../../../XSVG";
import {XElement} from "../../../element/XElement";

export abstract class ClickDraw implements XDrawable {
  private container: XSVG | null = null;
  private click = this._click.bind(this);
  private move = this._move.bind(this);

  _click(event: MouseEvent) {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;

    let xElement = this.onClick(containerRect, event);
    if(XElement) {
      this.container?.add(xElement as XElement);
    }
  }
  _move(event: MouseEvent) {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;

    this.onMove(containerRect, event);
  }

  abstract onClick(containerRect: DOMRect, event: MouseEvent): XElement | null;
  abstract onMove(containerRect: DOMRect, event: MouseEvent): void;
  abstract onStop(): void;

  start(container: XSVG): void {
    this.container = container;
    container.HTML.addEventListener('click', this.click);
    document.addEventListener("mousemove", this.move);
  }

  stop(): void {
    this.container?.HTML.removeEventListener('click', this.click);
    document.removeEventListener('mousemove', this.move);
    this.onStop();
  }

  set perfect(mode: boolean) {
  }
}
