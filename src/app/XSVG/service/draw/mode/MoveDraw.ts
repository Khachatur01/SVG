import {XDrawable} from "../XDrawable";
import {XElement} from "../../../element/XElement";
import {XSVG} from "../../../XSVG";

export abstract class MoveDraw implements XDrawable {
  private container: XSVG | null = null;
  private perfectMode: boolean = false;
  private drawStart = this._onStart.bind(this);
  private draw = this._onDraw.bind(this);
  private drawEnd = this._onEnd.bind(this);

  private drawableElement: XElement | null = null;

  private _onStart(event: MouseEvent) {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;

    this.drawableElement = this.onStart(containerRect, event);

    this.container?.add(this.drawableElement);
    this.container?.HTML.addEventListener('mousemove', this.draw);
  }
  private _onDraw(event: MouseEvent) {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!this.drawableElement || !containerRect) return;
    this.onDraw(containerRect, event, this.drawableElement, this.perfectMode);

    let bBoxPosition: DOMRect = this.drawableElement.SVG.getBoundingClientRect();
    bBoxPosition.x -= containerRect.left;
    bBoxPosition.y -= containerRect.top;

    this.drawableElement.boundingBox?.setAttr({
      x: bBoxPosition.x,
      y: bBoxPosition.y,
      width: bBoxPosition.width,
      height: bBoxPosition.height
    });
    this.container?.focus(this.drawableElement);
  }
  private _onEnd(event: MouseEvent) {
    this.container?.HTML.removeEventListener('mousemove', this.draw);

    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!this.drawableElement || !containerRect) return;
    this.onEnd(containerRect, event, this.drawableElement);
  }

  abstract onStart(containerRect: DOMRect, event: MouseEvent): XElement;
  abstract onDraw(containerRect: DOMRect, event: MouseEvent, xElement: XElement, perfectMode: boolean): void;
  abstract onEnd(containerRect?: DOMRect, event?: MouseEvent, xElement?: XElement): boolean;

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
