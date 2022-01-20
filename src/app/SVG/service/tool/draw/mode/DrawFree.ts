import {Drawable} from "../Drawable";
import {Free} from "../../../../element/shape/pointed/polyline/Free";
import {SVG} from "../../../../SVG";
import {Point} from "../../../../model/Point";
import {Angle} from "../../../math/Angle";
import {PathObject} from "../../../../model/path/PathObject";
import {MoveTo} from "../../../../model/path/point/MoveTo";

export class DrawFree implements Drawable {
  private container: SVG;
  private perfectMode: boolean = false;
  private drawableElement: Free | null = null;
  private _onStart = this.onStart.bind(this);
  private _onDraw = this.onDraw.bind(this);
  private _onEnd = this.onEnd.bind(this);

  constructor(container: SVG) {
    this.container = container;
  }

  onStart(event: MouseEvent) {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;

    let snapPoint = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top
    }

    snapPoint = this.container.grid.getSnapPoint(snapPoint);

    let pathObject = new PathObject();
    pathObject.add(new MoveTo(snapPoint));
    this.drawableElement = new Free(this.container, pathObject);

    this.container?.add(this.drawableElement);
    this.container?.HTML.addEventListener('mousemove', this._onDraw);
    document.addEventListener('mouseup', this._onEnd);
  }

  onDraw(event: MouseEvent): void {
    let containerRect = this.container?.HTML.getBoundingClientRect();
    if(!containerRect) return;

    if(!this.drawableElement) return;

    let snapPoint = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top
    };

    if(this.container.grid.isSnap()) {
      snapPoint = this.container.grid.getSnapPoint(snapPoint);
      this.drawableElement.pushPoint(snapPoint);
    } else if(this.perfectMode) {
      let lastPoint: Point = this.drawableElement.getPoint(-2);
      snapPoint = Angle.snapLineEnd(lastPoint.x, snapPoint.x, lastPoint.y, snapPoint.y) as Point;
      this.drawableElement.replacePoint(-1, snapPoint);
    } else {
      this.drawableElement.pushPoint(snapPoint);
    }
  }

  onEnd() {
    if (!this.drawableElement || !this.container) return;

    this.container.HTML.removeEventListener('mousemove', this._onDraw);
    document.removeEventListener('mouseup', this._onEnd);

    if (this.drawableElement.getAttr("points").split(" ").length == 2) {
      this.container.remove(this.drawableElement);
    } else {
      this.drawableElement.refPoint = this.drawableElement.center;
    }
  }

  set perfect(mode: boolean) {
    this.perfectMode = mode;
  }

  start(container: SVG): void {
    this.container = container;
    this.container.HTML.addEventListener('mousedown', this._onStart);
  }

  stop(): void {
    this.container?.HTML.removeEventListener('mousedown', this._onStart);
  }

}
