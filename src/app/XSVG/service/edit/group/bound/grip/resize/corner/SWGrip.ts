import {XGrip} from "../XGrip";
import {Point} from "../../../../../../../model/Point";

export class SWGrip extends XGrip {
  setPosition(points: Point[]): void {
    this.position = {
      x: points[3].x - this.halfSide,
      y: points[3].y - this.halfSide
    }
  }

  protected onEnd(): void {
  }

  protected onMove(client: Point): void {
    let elementRect = this.container.focused.lastRect;
    let width = (client.x) - (elementRect.x + elementRect.width);
    let height = client.y - (elementRect.y);

    this._lastResize = {
      x: elementRect.x + elementRect.width,
      y: elementRect.y,
      width: width,
      height: height
    };
    this.container.focused.setSize(this._lastResize);
  }

  protected onStart(): void {
  }
}
