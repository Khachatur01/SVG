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
  private onStart = this._onStart.bind(this);
  private onDraw = this._onDraw.bind(this);
  private onEnd = this._onEnd.bind(this);

  constructor(container: SVG) {
    this.container = container;
  }

  _onStart(event: MouseEvent) {
    let containerRect = this.container.HTML.getBoundingClientRect();
    let snapPoint = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top
    }

    snapPoint = this.container.grid.getSnapPoint(snapPoint);

    let pathObject = new Path();
    pathObject.add(new MoveTo(snapPoint));
    this.drawableElement = new FreeView(this.container, pathObject);

    this.container.add(this.drawableElement);
    this.container.HTML.addEventListener('mousemove', this.onDraw);
    document.addEventListener('mouseup', this.onEnd);
    this.container.call(Callback.DRAW_CLICK);
  }

  _onDraw(event: MouseEvent): void {
    let containerRect = this.container.HTML.getBoundingClientRect();
    if (!this.drawableElement) return;

    let snapPoint = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top
    };

    if (this.container.grid.isSnap()) {
      snapPoint = this.container.grid.getSnapPoint(snapPoint);
      this.drawableElement.pushPoint(snapPoint);
    } else if (this.container.perfect) {
      try {
        let lastPoint: Point = this.drawableElement.getPoint(-2);
        snapPoint = Angle.snapLineEnd(lastPoint.x, snapPoint.x, lastPoint.y, snapPoint.y) as Point;
        this.drawableElement.replacePoint(-1, snapPoint);
      } catch (typeError) {
        /* lastPoint may be undefined */
      }
    } else {
      this.drawableElement.pushPoint(snapPoint);
    }
    this.container.call(Callback.DRAW_MOVE);
  }

  _onEnd() {
    if (!this.drawableElement) return;

    this.container.HTML.removeEventListener('mousemove', this.onDraw);
    document.removeEventListener('mouseup', this.onEnd);

    if (this.drawableElement.getAttr("points").split(" ").length == 2) {
      this.container.remove(this.drawableElement);
    } else {
      this.drawableElement.refPoint = this.drawableElement.center;
    }
    this.container.call(Callback.DRAW_END);
  }

  start(container: SVG): void {
    this.container = container;
    this.container.HTML.addEventListener('mousedown', this.onStart);
    container.call(Callback.FREE_HAND_TOOL_ON);
  }

  stop(): void {
    this.container.HTML.removeEventListener('mousedown', this.onStart);
    this.container.call(Callback.FREE_HAND_TOOL_OFF);
  }

}
