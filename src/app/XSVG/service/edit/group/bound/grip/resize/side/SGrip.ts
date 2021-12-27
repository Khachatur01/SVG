import {Point} from "../../../../../../../model/Point";
import {XGrip} from "../XGrip";
import {XSVG} from "../../../../../../../XSVG";
import {Rect} from "../../../../../../../model/Rect";

export class SGrip extends XGrip {
  constructor(container: XSVG) {
    super(container, "ns-resize");
  }

  setPosition(points: Point[]): void {
    let x = (points[3].x + points[2].x) / 2;
    let y = (points[3].y + points[2].y) / 2;
    this.position = {
      x: x - this.halfSide,
      y: y - this.halfSide
    }
  }

  protected onEnd(): void {
  }

  protected onMove(containerRect: Rect, event: MouseEvent): void {
    let elementRect = this.container.focused.lastRect;
    let height = event.clientY - containerRect.y - (elementRect.y);

    this._lastResize = {
      x: elementRect.x,
      y: elementRect.y,
      width: elementRect.width,
      height: height
    };
    this.container.focused.setSize(this._lastResize);
  }

  protected onStart(): void {
  }
}
