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
    let width = client.x - this.container.focused.lastRect.x;
    let height = client.y - this.container.focused.lastRect.y;

    this._lastResize = {
      x: this.container.focused.lastRect.x,
      y: this.container.focused.lastRect.y,
      width: width,
      height: height
    };
    this.container.focused.setSize(this._lastResize);
  }

  protected onEnd(): void {
  }
}
