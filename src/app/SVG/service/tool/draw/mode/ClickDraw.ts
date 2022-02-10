import {Drawable} from "../Drawable";
import {SVG} from "../../../../SVG";
import {PointedView} from "../../../../element/shape/pointed/PointedView";
import {Point} from "../../../../model/Point";
import {Angle} from "../../../math/Angle";
import {Callback} from "../../../../dataSource/Callback";

export abstract class ClickDraw implements Drawable {
  protected container: SVG;
  protected drawableElement: PointedView | null = null;
  private _click = this.click.bind(this);
  private _move = this.move.bind(this);

  public constructor(container: SVG) {
    this.container = container;
  }

  public abstract _new(): ClickDraw;
  protected abstract createDrawableElement(position: Point): PointedView;

  protected click(event: MouseEvent | TouchEvent) {
    this.container.drawTool.drawing();
    let containerRect = this.container?.HTML.getBoundingClientRect();

    let eventPosition = SVG.eventToPosition(event);
    event.preventDefault();
    let snapPoint = {
      x: eventPosition.x - containerRect.left,
      y: eventPosition.y - containerRect.top
    }

    snapPoint = this.container.grid.getSnapPoint(snapPoint);

    if (!this.drawableElement) {
      this.drawableElement = this.createDrawableElement(snapPoint);
      this.container.add(this.drawableElement);
    } else {
      this.drawableElement?.pushPoint(snapPoint);
    }
    this.container.call(Callback.DRAW_CLICK, {position: snapPoint});
  }
  protected move(event: MouseEvent | TouchEvent) {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if (!containerRect || !this.drawableElement) return;

    let eventPosition = SVG.eventToPosition(event);
    event.preventDefault();
    let snapPoint = {
      x: eventPosition.x - containerRect.left,
      y: eventPosition.y - containerRect.top
    }

    if (this.container.grid.isSnap())
      snapPoint = this.container.grid.getSnapPoint(snapPoint);
    else if (this.container.perfect) {
      let lastPoint: Point = this.drawableElement.getPoint(-2);
      snapPoint = Angle.snapLineEnd(lastPoint, snapPoint) as Point;
    }

    this.drawableElement.replacePoint(-1, snapPoint);
    this.container.call(Callback.DRAW_MOVE,
      {position: snapPoint}
    );
  }

  public start(container: SVG): void {
    this.container = container;
    this.container.HTML.addEventListener('mousedown', this._click);
    this.container.HTML.addEventListener('touchstart', this._click);
    document.addEventListener("mousemove", this._move);
    document.addEventListener("touchmove", this._move);
  }
  public stop(): void {
    this.container?.HTML.removeEventListener('mousedown', this._click);
    this.container?.HTML.removeEventListener('touchstart', this._click);
    document.removeEventListener('mousemove', this._move);
    document.removeEventListener('touchmove', this._move);
    if (!this.drawableElement || !this.container) return;

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
}
