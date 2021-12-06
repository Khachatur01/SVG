import {XRectangle} from "../../../../element/shape/XRectangle";
import {Rect} from "../../../../model/Rect";
import {XGrip} from "./grip/XGrip";
import {NWGrip} from "./grip/corner/NWGrip";
import {NGrip} from "./grip/side/NGrip";
import {NEGrip} from "./grip/corner/NEGrip";
import {EGrip} from "./grip/side/EGrip";
import {SEGrip} from "./grip/corner/SEGrip";
import {SGrip} from "./grip/side/SGrip";
import {SWGrip} from "./grip/corner/SWGrip";
import {WGrip} from "./grip/side/WGrip";
import {Point} from "../../../../model/Point";
import {XSVG} from "../../../../XSVG";

export class XBoundingBox extends XRectangle {
  private container: XSVG;
  private _grips: XGrip[] = [];
  private _boundingRect: Rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  constructor(container: XSVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y, width, height);
    this.setAttr({
      fill: "none",
      stroke: "#002fff",
      "stroke-width": 1,
      "stroke-dasharray": "3 3"
    });

    this.svgElement.style.display = "none";
    this.removeOverEvent();

    this.container = container;

    this._grips.push(
      new NWGrip(container),
      new  NGrip(container),

      new NEGrip(container),
      new  EGrip(container),

      new SEGrip(container),
      new  SGrip(container),

      new SWGrip(container),
      new  WGrip(container)
    );
  }


  get grips(): XGrip[] {
    return this._grips;
  }

  singleFocus() {
    this.svgElement.style.display = "block";
    for(let grip of this._grips) {
      grip.show();
    }
  }
  multipleFocus() {
    this.svgElement.style.display = "block";
    /* more effective than with one for loop and condition */
    for(let i = 0; i < this._grips.length; i+=2) {
      this._grips[i].show();
    }
    for(let i = 1; i < this._grips.length; i+=2) {
      this._grips[i].hide();
    }
  }
  blur() {
    this.svgElement.style.display = "none";
    for(let grip of this._grips) {
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
    let rect = this._boundingRect;

    rect.width = Math.abs(rect.width);
    rect.height = Math.abs(rect.height);

    points[0].x = rect.x;
    points[0].y = rect.y;

    points[1].x = rect.x + rect.width;
    points[1].y = rect.y;

    points[2].x = rect.x + rect.width;
    points[2].y = rect.y + rect.height;

    points[3].x = rect.x;
    points[3].y = rect.y + rect.height;

    if(!points || !this._grips) return;
    for(let grip of this._grips)
      grip.setPosition(points);
  }
}
