import {Tool} from "../Tool";
import {SVG} from "../../../SVG";
import {RectangleView} from "../../../element/shape/pointed/polygon/rectangle/RectangleView";
import {Point} from "../../../model/Point";
import {DragTool} from "../drag/DragTool";
import {Callback} from "../../../dataSource/Callback";

export class SelectTool extends Tool {
  private readonly boundingBox: RectangleView;
  private position: Point = {x: 0, y: 0};
  private start = this.onStart.bind(this);
  private select = this.onSelect.bind(this);
  private end = this.onEnd.bind(this);

  public readonly dragTool: DragTool;

  public constructor(container: SVG) {
    super(container);
    this.boundingBox = new RectangleView(container);
    this.dragTool = new DragTool(container);

    this.boundingBox.style.fillColor = "none";
    this.boundingBox.style.strokeColor = "#1545ff";
    this.boundingBox.style.strokeWidth = "1";
    this.boundingBox.style.strokeDashArray = "5 5";

    this.boundingBox.removeOverEvent();
  }

  private onStart(event: MouseEvent): void {
    if (event.target != this._container.HTML) return;

    let containerRect = this._container.HTML.getBoundingClientRect();
    this.position.x = event.clientX - containerRect.left; // x position within the element.
    this.position.y = event.clientY - containerRect.top;  // y position within the element.
    this.boundingBox.setSize({
      x: this.position.x,
      y: this.position.y,
      width: 1,
      height: 1
    });

    this._container.HTML.appendChild(this.boundingBox.SVG);
    this._container.HTML.addEventListener("mousemove", this.select);
    document.addEventListener("mouseup", this.end);
  }
  private onSelect(event: MouseEvent): void {
    let containerRect = this._container.HTML.getBoundingClientRect();
    let width = event.clientX - containerRect.left - this.position.x;
    let height = event.clientY - containerRect.top - this.position.y;

    this.boundingBox.drawSize({
      x: this.position.x,
      y: this.position.y,
      width: width,
      height: height
    });
  }
  private onEnd(event: MouseEvent): void {
    let containerRect = this._container.HTML.getBoundingClientRect();
    let width = event.clientX - containerRect.left - this.position.x;

    this._container.HTML.removeChild(this.boundingBox.SVG);
    let boxPos = this.boundingBox.position;
    let boxSize = this.boundingBox.size;
    let boxPoints: any = {
      topLeft: boxPos,
      bottomRight: {
        x: boxPos.x + boxSize.width,
        y: boxPos.y + boxSize.height
      }
    };

    this._container.multiSelect();

    elementsLoop:
      for (let element of this._container.elements) {
        let elementPoints = element.rotatedPoints;

        if (width > 0) {/* if select box drawn from right to left */
          for (let point of elementPoints)
            if (/* full match */
              point.x < boxPoints.topLeft.x || point.x > boxPoints.bottomRight.x ||
              point.y < boxPoints.topLeft.y || point.y > boxPoints.bottomRight.y
            )
              continue elementsLoop;

          this._container.focus(element);
        } else {/* if select box drawn from left to right */
          for (let point of elementPoints)
            if (/* one point match */
              point.x > boxPoints.topLeft.x && point.x < boxPoints.bottomRight.x &&
              point.y > boxPoints.topLeft.y && point.y < boxPoints.bottomRight.y
            ) {
              this._container.focus(element);
              break;
            }
        }
      }
    this._container.singleSelect();
    this._container.HTML.removeEventListener("mousemove", this.select);
    document.removeEventListener("mouseup", this.end);
  }

  protected _on(): void {
    this._container.HTML.addEventListener("mousedown", this.start);
    this._isOn = true;
    this.dragTool.on();
    this._container.HTML.style.cursor = "default";

    this._container.call(Callback.SELECT_TOOl_ON);
  }
  public off(): void {
    this._container.HTML.removeEventListener("mousedown", this.start);
    this._isOn = false;
    this.dragTool.off();

    this._container.call(Callback.SELECT_TOOl_OFF);
  }
}
