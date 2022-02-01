import {Drawable} from "../Drawable";
import {ElementView} from "../../../../element/ElementView";
import {SVG} from "../../../../SVG";
import {Point} from "../../../../model/Point";
import {MoveDrawable} from "../type/MoveDrawable";
import {Callback} from "../../../../dataSource/Callback";

export abstract class MoveDraw implements Drawable {
  protected container: SVG;
  protected startPos: Point = {x: 0, y: 0}

  private drawStart = this._onStart.bind(this);
  private draw = this._onDraw.bind(this);
  private drawEnd = this._onEnd.bind(this);

  protected drawableElement: ElementView | null = null;

  constructor(container: SVG) {
    this.container = container;
  }

  abstract getDrawableElement(position: Point): ElementView;

  protected _onStart(event: MouseEvent) {
    let containerRect = this.container.HTML.getBoundingClientRect();
    this.startPos.x = event.clientX - containerRect.left; //x position within the element.
    this.startPos.y = event.clientY - containerRect.top;  //y position within the element.

    this.startPos = this.container.grid.getSnapPoint(this.startPos);

    this.drawableElement = this.getDrawableElement(this.startPos);
    this.container.add(this.drawableElement);
    this.container.HTML.addEventListener('mousemove', this.draw);
    document.addEventListener('mouseup', this.drawEnd);
    this.container.drawTool.drawing();
    this.container.call(Callback.DRAW_CLICK);
  }
  protected _onDraw(event: MouseEvent) {
    if (!this.drawableElement) return;

    let containerRect = this.container.HTML.getBoundingClientRect();

    let width = event.clientX - containerRect.left - this.startPos.x;
    let height = event.clientY - containerRect.top - this.startPos.y;

    if (this.container.perfect) {
      let averageSize = (Math.abs(width) + Math.abs(height)) / 2
      if (width < 0)
        width = -averageSize;
      else
        width = averageSize;
      if (height < 0)
        height = -averageSize;
      else
        height = averageSize;
    }

    if (this.container.grid.isSnap()) {
      let snapPoint = this.container.grid.getSnapPoint({
        x: this.startPos.x + width,
        y: this.startPos.y + height
      });
      width = snapPoint.x - this.startPos.x;
      height = snapPoint.y - this.startPos.y;
    }

    /* if xElement instance of MoveDrawable, set drawSize */
    (this.drawableElement as unknown as MoveDrawable)?.drawSize({
      x: this.startPos.x,
      y: this.startPos.y,
      width: width,
      height: height
    });
    this.container.call(Callback.DRAW_MOVE);
  }
  private _onEnd() {
    if (!this.drawableElement) return;

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
    this.container.call(Callback.DRAW_END);
  }

  onEnd() {}
  onIsNotComplete() {
    if (this.drawableElement)
      this.container.remove(this.drawableElement);
  }

  start(container: SVG): void {
    this.container = container;
    this.container.HTML.addEventListener('mousedown', this.drawStart);
  }
  stop(): void {
    this.container?.HTML.removeEventListener('mousedown', this.drawStart);
  }
}
