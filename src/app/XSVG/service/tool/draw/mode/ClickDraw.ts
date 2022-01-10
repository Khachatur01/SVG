import {XDrawable} from "../XDrawable";
import {XSVG} from "../../../../XSVG";
import {XPointed} from "../../../../element/type/XPointed";
import {Point} from "../../../../model/Point";
import {Angle} from "../../../math/Angle";

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

    let snapPoint = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top
    };

    snapPoint = this.container.grid.getSnapPoint(snapPoint);

    let element = this.onClick(snapPoint);
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

  abstract onClick(position: Point): XPointed | null;
  onMove(containerRect: DOMRect, event: MouseEvent, perfectMode: boolean): void {
    if(!this.drawableElement) return;

    let snapPoint = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top
    };

    if(this.container.grid.isSnap())
      snapPoint = this.container.grid.getSnapPoint(snapPoint);
    else if(perfectMode) {
      let lastPoint: Point = this.drawableElement.getPoint(-2);
      snapPoint = Angle.snapLineEnd(lastPoint.x, snapPoint.x, lastPoint.y, snapPoint.y) as Point;
    }

    this.drawableElement.replacePoint(-1, snapPoint);
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

      // this.container.focus(this.drawableElement);
      // this.container.focused.fixRect();
    } else {
      this.container.remove(this.drawableElement);
    }
    this.drawableElement = null;
  }

  set perfect(mode: boolean) {
    this.perfectMode = mode;
  }
}
