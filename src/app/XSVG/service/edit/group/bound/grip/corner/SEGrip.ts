import {XGrip} from "../XGrip";
import {Point} from "../../../../../../model/Point";
import {XSVG} from "../../../../../../XSVG";
import {Rect} from "../../../../../../model/Rect";

export class SEGrip extends XGrip {
  constructor(container: XSVG) {
    super(container, "nwse-resize");
  }

  setPosition(points: Point[]): void {
    this.position = {
      x: points[2].x,
      y: points[2].y
    }
  }

  protected onStart(): void {

  }

  protected onMove(containerRect: Rect, event: MouseEvent): void {
    let width = event.clientX - containerRect.x - this.container.focused.lastRect.x;
    let height = event.clientY - containerRect.y - this.container.focused.lastRect.y;

    this.container.focused.setSize({
      x: this.container.focused.lastRect.x,
      y: this.container.focused.lastRect.y,
      width: width,
      height: height
    });
  }

  protected onEnd(): void {
  }
}