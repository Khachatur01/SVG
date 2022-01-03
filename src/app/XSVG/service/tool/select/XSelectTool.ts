import {XTool} from "../XTool";
import {XSVG} from "../../../XSVG";
import {XRectangle} from "../../../element/shape/XRectangle";
import {Point} from "../../../model/Point";

export class XSelectTool extends XTool {
  private readonly boundingBox: XRectangle;
  private position: Point = {x: 0, y: 0};
  private _isOn: boolean = false;

  private start = this.onStart.bind(this);
  private select = this.onSelect.bind(this);
  private end = this.onEnd.bind(this);

  constructor(container: XSVG) {
    super(container);
    this.boundingBox = new XRectangle();
    this.boundingBox.setStyle({
      fill: "none",
      stroke: "#1545ff",
      "stroke-width": "1",
      "stroke-dasharray": "5 5"
    });
    this.boundingBox.removeOverEvent();
  }

  private onStart(event: MouseEvent): void {
    let containerRect = this.container.HTML.getBoundingClientRect();
    this.position.x = event.clientX - containerRect.left; //x position within the element.
    this.position.y = event.clientY - containerRect.top;  //y position within the element.
    this.boundingBox.setSize({
      x: this.position.x,
      y: this.position.y,
      width: 0,
      height: 0
    });

    this.container.HTML.appendChild(this.boundingBox.SVG);
    this.container.HTML.addEventListener("mousemove", this.select);
  }
  private onSelect(event: MouseEvent): void {
    let containerRect = this.container.HTML.getBoundingClientRect();
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
    let containerRect = this.container.HTML.getBoundingClientRect();
    let width = event.clientX - containerRect.left - this.position.x;

    this.container.HTML.removeChild(this.boundingBox.SVG);
    let boxPos = this.boundingBox.position;
    let boxSize = this.boundingBox.size;
    let boxPoints: any = {
      topLeft: boxPos,
      bottomRight: {
        x: boxPos.x + boxSize.width,
        y: boxPos.y + boxSize.height
      }
    };

    this.container.multiSelect();

    elementsLoop:
    for(let element of this.container.elements) {
      let elementPoints = element.rotatedPoints;

      if(width > 0) {/* if select box drawn from right to left */

        for(let point of elementPoints)
          if(/* full match */
            point.x < boxPoints.topLeft.x || point.x > boxPoints.bottomRight.x ||
            point.y < boxPoints.topLeft.y || point.y > boxPoints.bottomRight.y
          )
            continue elementsLoop;

        this.container.focus(element);

      } else {/* if select box drawn from left to right */

        for(let point of elementPoints)
          if(/* one point match */
            point.x > boxPoints.topLeft.x && point.x < boxPoints.bottomRight.x &&
            point.y > boxPoints.topLeft.y && point.y < boxPoints.bottomRight.y
          ) {
            this.container.focus(element);
            break;
          }

      }
    }
    this.container.singleSelect();
    this.container.HTML.removeEventListener("mousemove", this.select);
  }

  _on(): void {
    this.container.HTML.addEventListener("mousedown", this.start);
    document.addEventListener("mouseup", this.end);
    this._isOn = true;
  }

  off(): void {
    this.container.HTML.removeEventListener("mousedown", this.start);
    document.removeEventListener("mouseup", this.end);
    this._isOn = false;
  }

  isOn(): boolean {
    return this._isOn;
  }

}
