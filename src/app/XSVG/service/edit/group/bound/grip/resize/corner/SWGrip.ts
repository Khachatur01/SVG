import {XGrip} from "../XGrip";
import {Point} from "../../../../../../../model/Point";
import {XSVG} from "../../../../../../../XSVG";
import {Rect} from "../../../../../../../model/Rect";

export class SWGrip extends XGrip {
  constructor(container: XSVG) {
    super(container, "nesw-resize");
  }

  setPosition(points: Point[]): void {
    this.position = {
      x: points[3].x - this.halfSide,
      y: points[3].y - this.halfSide
    }
  }

  protected onEnd(): void {
  }

  protected onMove(containerRect: Rect, event: MouseEvent): void {
    let elementRect = this.container.focused.lastRect;
    let width = (event.clientX - containerRect.x) - (elementRect.x + elementRect.width);
    let height = event.clientY - containerRect.y - (elementRect.y);

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
