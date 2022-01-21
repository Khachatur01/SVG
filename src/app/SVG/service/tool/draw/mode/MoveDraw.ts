import {Drawable} from "../Drawable";
import {Element} from "../../../../element/Element";
import {SVG} from "../../../../SVG";
import {Point} from "../../../../model/Point";
import {MoveDrawable} from "../type/MoveDrawable";

export abstract class MoveDraw implements Drawable {
  protected container: SVG;
  protected startPos: Point = {x: 0, y: 0}

  private drawStart = this._onStart.bind(this);
  private draw = this._onDraw.bind(this);
  private drawEnd = this._onEnd.bind(this);

  protected drawableElement: Element | null = null;

  constructor(container: SVG) {
    this.container = container;
  }

  private _onStart(event: MouseEvent) {
    if(!this.container) return;

    let containerRect = this.container.HTML.getBoundingClientRect();
    this.startPos.x = event.clientX - containerRect.left; //x position within the element.
    this.startPos.y = event.clientY - containerRect.top;  //y position within the element.

    this.startPos = this.container.grid.getSnapPoint(this.startPos);

    this.drawableElement = this.onStart(this.startPos);
    this.container.add(this.drawableElement);
    this.container.HTML.addEventListener('mousemove', this.draw);
    document.addEventListener('mouseup', this.drawEnd);
    this.container.drawTool.drawing();
  }
  private _onDraw(event: MouseEvent) {
    if(!this.container || !this.drawableElement) return;

    let containerRect = this.container.HTML.getBoundingClientRect();
    this.onDraw(containerRect, event, this.drawableElement, this.container.perfect);
  }
  private _onEnd() {
    if(!this.container || !this.drawableElement) return;

    this.container.HTML.removeEventListener('mousemove', this.draw);
    document.removeEventListener('mouseup', this.drawEnd);

    /* if element isn't drawn */
    if (this.drawableElement.isComplete()) {
      this.container.blur();

      this.drawableElement.refPoint = this.drawableElement.center;
      this.container.focused.lastRefPoint = this.drawableElement.refPoint;

      this.container.focus(this.drawableElement);
      this.container.focused.fixRect();
      this.container.selectTool.on();
    } else {
      this.onIsNotComplete();
    }

    this.onEnd();
    this.container.drawTool.drawingEnd();
    this.drawableElement = null;
  }

  abstract onStart(position: Point): Element;

  onDraw(containerRect: DOMRect, event: MouseEvent, xElement: Element, perfectMode: boolean): void {
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

    if(this.container.grid.isSnap()) {
      let snapPoint = this.container.grid.getSnapPoint({
        x: this.startPos.x + width,
        y: this.startPos.y + height
      });
      width = snapPoint.x - this.startPos.x;
      height = snapPoint.y - this.startPos.y;
    }

    /* if xElement instance of MoveDrawable, set drawSize */
    (xElement as unknown as MoveDrawable)?.drawSize({
      x: this.startPos.x,
      y: this.startPos.y,
      width: width,
      height: height
    });
  };
  onIsNotComplete() {
    if(this.drawableElement)
      this.container.remove(this.drawableElement);
  }
  onEnd() {}

  start(container: SVG): void {
    this.container = container;
    this.container.HTML.addEventListener('mousedown', this.drawStart);
  }

  stop(): void {
    this.container?.HTML.removeEventListener('mousedown', this.drawStart);
  }

}
