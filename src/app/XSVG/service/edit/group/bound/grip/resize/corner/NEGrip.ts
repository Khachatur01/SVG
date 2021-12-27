import {XGrip} from "../XGrip";
import {Point} from "../../../../../../../model/Point";
import {XSVG} from "../../../../../../../XSVG";
import {Rect} from "../../../../../../../model/Rect";

export class NEGrip extends XGrip {
  constructor(container: XSVG) {
    super(container, "nesw-resize");
  }

  setPosition(points: Point[]): void {
    this.position = {
      x: points[1].x - this.halfSide,
      y: points[1].y - this.halfSide
    }
  }

  protected onStart(): void {
  }

  protected onMove(containerRect: Rect, event: MouseEvent): void {
    let elementRect = this.container.focused.lastRect;

    let width = (event.clientX - containerRect.x) - (elementRect.x);
    let height = event.clientY - containerRect.y - (elementRect.y + elementRect.height);

    this._lastResize = {
      x: elementRect.x,
      y: elementRect.y + elementRect.height,
      width: width,
      height: height
    };
    this.container.focused.setSize(this._lastResize);
  }

  protected onEnd(): void {
  }
}
