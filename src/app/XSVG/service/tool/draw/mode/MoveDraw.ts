import {XDrawable} from "../XDrawable";
import {XElement} from "../../../../element/XElement";
import {XSVG} from "../../../../XSVG";
import {Point} from "../../../../model/Point";

export abstract class MoveDraw implements XDrawable {
  protected container: XSVG | null = null;
  private perfectMode: boolean = false;
  protected startPos: Point = {x: 0, y: 0}

  private drawStart = this._onStart.bind(this);
  private draw = this._onDraw.bind(this);
  private drawEnd = this._onEnd.bind(this);

  private drawableElement: XElement | null = null;

  private _onStart(event: MouseEvent) {
    if(!this.container) return;

    let containerRect = this.container.HTML.getBoundingClientRect();

    this.drawableElement = this.onStart(containerRect, event);
    this.container.add(this.drawableElement);
    this.container.HTML.addEventListener('mousemove', this.draw);
    this.container.drawTool.drawing();
  }
  private _onDraw(event: MouseEvent) {
    if(!this.container || !this.drawableElement) return;

    let containerRect = this.container.HTML.getBoundingClientRect();
    this.onDraw(containerRect, event, this.drawableElement, this.perfectMode);
  }
  private _onEnd() {
    if(!this.container || !this.drawableElement) return;

    this.container.HTML.removeEventListener('mousemove', this.draw);

    /* if element isn't drawn */
    if (this.drawableElement.isComplete()) {
      this.container.blur();

      let center: Point = this.drawableElement.center;
      this.drawableElement.refPoint = center;
      // this.container.focused.lastRefPoint = center;

      this.container.focus(this.drawableElement);
      this.container.focused.fixRect();
    } else {
      this.container.remove(this.drawableElement);
    }

    this.container.drawTool.drawingEnd();
    this.drawableElement = null;
  }

  abstract onStart(containerRect: DOMRect, event: MouseEvent): XElement;
  onDraw(containerRect: DOMRect, event: MouseEvent, xElement: XElement, perfectMode: boolean): void {
    let width = event.clientX - containerRect.left - this.startPos.x;
    let height = event.clientY - containerRect.top - this.startPos.y;

    if(perfectMode) {
      let averageSize = (Math.abs(width) + Math.abs(height)) / 2
      if(width < 0)
        width = -averageSize;
      else
        width = averageSize;
      if(height < 0)
        height = -averageSize;
      else
        height = averageSize;
    }
    xElement.setSize({
      x: this.startPos.x,
      y: this.startPos.y,
      width: width,
      height: height
    });
  };

  start(container: XSVG): void {
    this.container = container;
    container.HTML.addEventListener('mousedown', this.drawStart);
    document.addEventListener('mouseup', this.drawEnd);
  }

  stop(): void {
    this.container?.HTML.removeEventListener('mousemove', this.draw);
    this.container?.HTML.removeEventListener('mousedown', this.drawStart);
    document.removeEventListener('mouseup', this.drawEnd);
  }

  set perfect(mode: boolean) {
    this.perfectMode = mode;
  }

}
