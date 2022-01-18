import {XGrip} from "../XGrip";
import {Point} from "../../../../../../../model/Point";

export class SEGrip extends XGrip {
  setPosition(points: Point[]): void {
    this.position = {
      x: points[2].x - this.halfSide,
      y: points[2].y - this.halfSide
    }
  }

  protected onStart(): void {

  }

  protected onMove(client: Point): void {
    let width = client.x - this._container.focused.lastRect.x;
    let height = client.y - this._container.focused.lastRect.y;

    this._lastResize = {
      x: this._container.focused.lastRect.x,
      y: this._container.focused.lastRect.y,
      width: width,
      height: height
    };
    this._container.focused.setSize(this._lastResize);
  }

  protected onEnd(): void {
  }
}
