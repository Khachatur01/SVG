import {XGrip} from "../XGrip";
import {Point} from "../../../../../../../model/Point";

export class NEGrip extends XGrip {
  setPosition(points: Point[]): void {
    this.position = {
      x: points[1].x - this.halfSide,
      y: points[1].y - this.halfSide
    };
  }

  protected onStart(): void {
  }

  protected onMove(client: Point): void {
    let elementRect = this._container.focused.lastRect;

    let width = (client.x) - (elementRect.x);
    let height = client.y - (elementRect.y + elementRect.height);

    this._lastResize = {
      x: elementRect.x,
      y: elementRect.y + elementRect.height,
      width: width,
      height: height
    };
    this._container.focused.setSize(this._lastResize);
  }

  protected onEnd(): void {
  }
}
