import {XRectangle} from "../../../../element/shape/XRectangle";
import {Size} from "../../../../model/Size";
import {Rect} from "../../../../model/Rect";

export class Grip extends XRectangle {
  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y, width, height);
    this.setAttr({
      fill: "white",
      "stroke-width": 1,
    });

    this.svgElement.style.display = "none";
    // this.removeOverEvent();
  }
  show() {
    this.svgElement.style.display = "block";
  }
  hide() {
    this.svgElement.style.display = "none";
  }
}

export class XBoundingBox extends XRectangle {
  public grips: Grip[] = [];

  private _boundingRect: Rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y, width, height);

    this.setAttr({
      fill: "none",
      stroke: "#002fff",
      "stroke-width": 1,
      "stroke-dasharray": "3 3"
    });

    this.svgElement.style.display = "none";
    this.removeOverEvent();

    this.grips.push(
      new Grip(x, y, 10, 10),
      new Grip(x + width, y, 10, 10),
      new Grip(x + width, y + height, 10, 10),
      new Grip(x, y + height, 10, 10)
    );
  }

  singleFocus() {
    this.svgElement.style.display = "block";
    for(let grip of this.grips) {
      grip.show();
    }
  }
  multipleFocus() {
    this.svgElement.style.display = "block";
    for(let grip of this.grips) {
      grip.show();
    }
  }
  blur() {
    this.svgElement.style.display = "none";
    for(let grip of this.grips) {
      grip.hide();
    }
  }

  override set size(size: Size) {
    super.size = size;
    let position = this._boundingRect;
    if(this.grips) {
      this.grips[0].position = {
        x: position.x - 10,
        y: position.y - 10
      }

      this.grips[1].position = {
        x: size.width + position.x,
        y: position.y - 10
      }

      this.grips[2].position = {
        x: position.x - 10,
        y: size.height + position.y
      }

      this.grips[3].position = {
        x: size.width + position.x,
        y: size.height + position.y
      }
    }
  }

  get boundingRect(): Rect {
    return this._boundingRect;
  }

  set boundingRect(value: Rect) {
    this._boundingRect = value;
  }
}
