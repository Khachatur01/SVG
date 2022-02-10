import {Drawable} from "../Drawable";
import {FreeView} from "../../../../element/shape/pointed/polyline/FreeView";
import {SVG} from "../../../../SVG";
import {Point} from "../../../../model/Point";
import {Angle} from "../../../math/Angle";
import {Path} from "../../../../model/path/Path";
import {MoveTo} from "../../../../model/path/point/MoveTo";
import {Callback} from "../../../../dataSource/Callback";

export class DrawFree implements Drawable {
  private container: SVG;
  private drawableElement: FreeView | null = null;

  private _drawStart = this.drawStart.bind(this);
  private _draw = this.draw.bind(this);
  private _drawEnd = this.drawEnd.bind(this);

  public constructor(container: SVG) {
    this.container = container;
  }

  public _new(): DrawFree {
    return new DrawFree(this.container);
  }

  private drawStart(event: MouseEvent | TouchEvent) {
    this.container.HTML.addEventListener('mousemove', this._draw);
    this.container.HTML.addEventListener('touchmove', this._draw);
    document.addEventListener('mouseup', this._drawEnd);
    document.addEventListener('touchend', this._drawEnd);

    let containerRect = this.container.HTML.getBoundingClientRect();
    let eventPosition = SVG.eventToPosition(event);
    event.preventDefault();
    let snapPoint = {
      x: eventPosition.x - containerRect.left,
      y: eventPosition.y - containerRect.top
    }

    snapPoint = this.container.grid.getSnapPoint(snapPoint);

    let pathObject = new Path();
    pathObject.add(new MoveTo(snapPoint));
    this.drawableElement = new FreeView(this.container, pathObject);

    this.container.add(this.drawableElement);
    this.container.call(Callback.DRAW_CLICK, {position: snapPoint});
  }
  private draw(event: MouseEvent | TouchEvent): void {
    let containerRect = this.container.HTML.getBoundingClientRect();
    if (!this.drawableElement) return;

    let eventPosition = SVG.eventToPosition(event);
    event.preventDefault();
    let snapPoint = {
      x: eventPosition.x - containerRect.left,
      y: eventPosition.y - containerRect.top
    }

    if (this.container.grid.isSnap()) {
      snapPoint = this.container.grid.getSnapPoint(snapPoint);
      this.drawableElement.pushPoint(snapPoint);
    } else if (this.container.perfect) {
      try {
        let lastPoint: Point = this.drawableElement.getPoint(-2);
        snapPoint = Angle.snapLineEnd(lastPoint, snapPoint) as Point;
        this.drawableElement.replacePoint(-1, snapPoint);
      } catch (typeError) {
        /* lastPoint may be undefined */
      }
    } else {
      this.drawableElement.pushPoint(snapPoint);
    }
    this.container.call(Callback.DRAW_MOVE,
      {position: snapPoint}
    );
  }
  private drawEnd() {
    if (!this.drawableElement) return;

    this.container.HTML.removeEventListener('mousemove', this._draw);
    this.container.HTML.removeEventListener('touchmove', this._draw);
    document.removeEventListener('mouseup', this._drawEnd);
    document.removeEventListener('touchend', this._drawEnd);

    if (this.drawableElement.getAttr("points").split(" ").length == 2) {
      this.container.remove(this.drawableElement);
    } else {
      this.drawableElement.refPoint = this.drawableElement.center;
    }
    this.container.call(Callback.DRAW_END);
  }

  public start(container: SVG): void {
    this.container = container;
    this.container.HTML.addEventListener('mousedown', this._drawStart);
    this.container.HTML.addEventListener('touchstart', this._drawStart);
    container.call(Callback.FREE_HAND_TOOL_ON);
  }
  public stop(): void {
    this.container.HTML.removeEventListener('mousedown', this._drawStart);
    this.container.HTML.removeEventListener('touchstart', this._drawStart);
    this.container.call(Callback.FREE_HAND_TOOL_OFF);
  }
}
