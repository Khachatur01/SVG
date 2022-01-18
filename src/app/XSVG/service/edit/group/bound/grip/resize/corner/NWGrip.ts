import {XGrip} from "../XGrip";
import {Point} from "../../../../../../../model/Point";

export class NWGrip extends XGrip {
  setPosition(points: Point[]) {
    this.position = {
      x: points[0].x - this.halfSide,
      y: points[0].y - this.halfSide
    }
  }
  protected onStart(): void {
  }

  protected onMove(client: Point): void {
    let elementRect = this._container.focused.lastRect;
    let width = (client.x) - (elementRect.x + elementRect.width);
    let height = (client.y) - (elementRect.y + elementRect.height);

    this._lastResize = {
      x: elementRect.x + elementRect.width,
      y: elementRect.y + elementRect.height,
      width: width,
      height: height
    };
    this._container.focused.setSize(this._lastResize);
  }

  protected onEnd(): void {
  }
}
