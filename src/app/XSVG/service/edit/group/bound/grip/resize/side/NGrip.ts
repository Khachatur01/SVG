import {XGrip} from "../XGrip";
import {Point} from "../../../../../../../model/Point";
import {XSVG} from "../../../../../../../XSVG";
import {Rect} from "../../../../../../../model/Rect";

export class NGrip extends XGrip {
  constructor(container: XSVG) {
    super(container, "ns-resize");
  }

  setPosition(points: Point[]): void {
    let x = (points[1].x + points[0].x) / 2;
    let y = (points[1].y + points[0].y) / 2;
    this.position = {
      x: x - this.side + this.side / 2,
      y: y - this.side
    }
  }

  protected onEnd(): void {
  }

  protected onMove(containerRect: Rect, event: MouseEvent): void {
    let elementRect = this.container.focused.lastRect;
    let height = event.clientY - containerRect.y - (elementRect.y + elementRect.height);

    this.container.focused.setSize({
      x: elementRect.x,
      y: elementRect.y + elementRect.height,
      width: elementRect.width,
      height: height
    });
  }

  protected onStart(): void {
  }
}
