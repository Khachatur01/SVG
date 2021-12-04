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
      new Grip(x + width / 2, y, 10, 10),

      new Grip(x + width, y, 10, 10),
      new Grip(x + width, y + height / 2, 10, 10),

      new Grip(x + width, y + height, 10, 10),
      new Grip(x + width / 2, y + height, 10, 10),

      new Grip(x, y + height, 10, 10),
      new Grip(x, y + height / 2, 10, 10)
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
    for(let i = 0; i < this.grips.length; i+=2) {
      this.grips[i].show();
    }
    for(let i = 1; i < this.grips.length; i+=2) {
      this.grips[i].hide();
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
    let rect: Rect = this._boundingRect;
    if(!rect || !this.grips) return;

    if(rect.width < 0)
      rect.width = -rect.width;
    if(rect.height < 0)
      rect.height = -rect.height;


    this.grips[0].position = {
      x: rect.x - 10,
      y: rect.y - 10
    }
    this.grips[1].position = {
      x: rect.x + rect.width / 2 - 5,
      y: rect.y - 10
    }

    this.grips[2].position = {
      x: rect.width + rect.x,
      y: rect.y - 10
    }
    this.grips[3].position = {
      x: rect.width + rect.x,
      y: rect.y + rect.height / 2 - 5
    }

    this.grips[4].position = {
      x: rect.width + rect.x,
      y: rect.height + rect.y
    }
    this.grips[5].position = {
      x: rect.x + size.width / 2 - 5,
      y: rect.height + rect.y
    }

    this.grips[6].position = {
      x: rect.x - 10,
      y: rect.height + rect.y
    }
    this.grips[7].position = {
      x: rect.x - 10,
      y: rect.height / 2 + rect.y - 5
    }
  }

  get boundingRect(): Rect {
    return this._boundingRect;
  }

  set boundingRect(value: Rect) {
    this._boundingRect = value;
  }
}
