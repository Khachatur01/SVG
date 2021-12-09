import {XTool} from "../XTool";
import {XSVG} from "../../../XSVG";
import {XRectangle} from "../../../element/shape/XRectangle";
import {Point} from "../../../model/Point";

export class XSelectTool extends XTool {
  private readonly boundingBox: XRectangle;
  private position: Point = {x: 0, y: 0};

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

    this.boundingBox.setSize({
      x: this.position.x,
      y: this.position.y,
      width: width,
      height: height
    });
  }
  private onEnd(): void {
    this.container.HTML.removeChild(this.boundingBox.SVG);
    let boxSize = this.boundingBox.size;
    let boxPoints: any = {
      topLeft: this.boundingBox.position,
      bottomRight: {
        x: this.position.x + boxSize.width,
        y: this.position.y + boxSize.height
      }
    };

    this.container.multiSelect();
    for(let element of this.container.elements) {
      let elementPos = element.position;
      let elementSize = element.size;
      let elementPoints: any = {
        topLeft: elementPos,
        bottomRight: {
          x: elementPos.x + elementSize.width,
          y: elementPos.y + elementSize.height
        }
      }

      if( /* full match */
        elementPoints.topLeft.x >= boxPoints.topLeft.x && elementPoints.bottomRight.x <= boxPoints.bottomRight.x &&
        elementPoints.topLeft.y >= boxPoints.topLeft.y && elementPoints.bottomRight.y <= boxPoints.bottomRight.y
      ) {
        this.container.focus(element);
      }
    }
    this.container.singleSelect();
  }

  _on(): void {
    this.container.HTML.addEventListener("mousedown", this.start);
    document.addEventListener("mouseup", this.end);
  }

  off(): void {
    this.container.HTML.removeEventListener("mousedown", this.start);
    document.removeEventListener("mouseup", this.end);
  }

  isOn(): boolean {
    return false;
  }

}
