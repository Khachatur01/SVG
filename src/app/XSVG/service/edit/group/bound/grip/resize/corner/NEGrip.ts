import {XGrip} from "../XGrip";
import {Point} from "../../../../../../../model/Point";
import {XSVG} from "../../../../../../../XSVG";
import {Rect} from "../../../../../../../model/Rect";
import {Matrix} from "../../../../../../math/Matrix";

export class NEGrip extends XGrip {
  constructor(container: XSVG) {
    super(container, "nesw-resize");
  }

  setPosition(points: Point[]): void {
    this.position = {
      x: points[1].x,
      y: points[1].y - this.side
    }
  }

  protected onStart(): void {
  }

  protected onMove(containerRect: Rect, event: MouseEvent): void {
    let elementRect = this.container.focused.lastRect;

    console.log(-(360 + this.container.focused.angle))
    let rotated = Matrix.rotate([
        {x: event.clientX, y: event.clientY}
      ],
      this.container.focused.refPoint,
      -(360 + this.container.focused.angle)
    );
    let clientX = rotated[0].x;
    let clientY = rotated[0].y;

    console.log(event.x, event.y, clientX, clientY)

    let width = (clientX - containerRect.x) - (elementRect.x);
    let height = clientY - containerRect.y - (elementRect.y + elementRect.height);

    this.container.focused.setSize({
      x: elementRect.x,
      y: elementRect.y + elementRect.height,
      width: width,
      height: height
    });
  }

  protected onEnd(): void {
  }
}
