import {XGrip} from "../XGrip";
import {Point} from "../../../../../../model/Point";
import {XSVG} from "../../../../../../XSVG";
import {Rect} from "../../../../../../model/Rect";

export class NWGrip extends XGrip {
  constructor(container: XSVG) {
    super(container, "nwse-resize");
  }

  setPosition(points: Point[]) {
    this.position = {
      x: points[0].x - this.side,
      y: points[0].y - this.side
    }
  }
  protected onStart(): void {
  }

  protected onMove(containerRect: Rect, event: MouseEvent): void {
    let elementRect = this.container.focused.lastRect;
    let width = (event.clientX - containerRect.x) - (elementRect.x + elementRect.width);
    let height = (event.clientY - containerRect.y) - (elementRect.y + elementRect.height);

    this.container.focused.setSize({
      x: elementRect.x + elementRect.width,
      y: elementRect.y + elementRect.height,
      width: width,
      height: height
    });
  }

  protected onEnd(): void {
  }
}
