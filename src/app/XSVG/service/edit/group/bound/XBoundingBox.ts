import {XRectangle} from "../../../../element/shape/XRectangle";
import {Rect} from "../../../../model/Rect";
import {Grip} from "./grip/Grip";
import {NWGrip} from "./grip/NWGrip";
import {NGrip} from "./grip/NGrip";
import {NEGrip} from "./grip/NEGrip";
import {EGrip} from "./grip/EGrip";
import {SEGrip} from "./grip/SEGrip";
import {SGrip} from "./grip/SGrip";
import {SWGrip} from "./grip/SWGrip";
import {WGrip} from "./grip/WGrip";
import {Point} from "../../../../model/Point";

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
      new NWGrip(),
      new  NGrip(),

      new NEGrip(),
      new  EGrip(),

      new SEGrip(),
      new  SGrip(),

      new SWGrip(),
      new  WGrip()
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
    /* more effective than with one for loop */
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

  get boundingRect(): Rect {
    return this._boundingRect;
  }

  set boundingRect(value: Rect) {
    this._boundingRect = value;
  }

  gripsPosition() {
    let points: Point[] = this.points;

    if(!points || !this.grips) return;
    for(let grip of this.grips)
      grip.setPosition(points);
  }
}
