import {XGrip} from "../XGrip";
import {Point} from "../../../../../../model/Point";
import {XSVG} from "../../../../../../XSVG";
import {Rect} from "../../../../../../model/Rect";

export class EGrip extends XGrip {
  constructor(container: XSVG) {
    super(container, "ew-resize");
  }

  setPosition(points: Point[]): void {
    let x = Math.abs(points[2].x + points[1].x) / 2;
    let y = Math.abs(points[2].y + points[1].y) / 2;
    this.position = {
      x: x,
      y: y - this.side / 2
    }
  }

  protected onEnd(): void {
  }

  protected onMove(containerRect: Rect, event: MouseEvent): void {
    let elementRect = this.container.focused.lastRect;

    this.container.focused.setSize({
      x: elementRect.x,
      y: elementRect.y,
      width: (event.clientX - containerRect.x) - (elementRect.x),
      height: elementRect.height
    });
  }

  protected onStart(): void {
  }
}
