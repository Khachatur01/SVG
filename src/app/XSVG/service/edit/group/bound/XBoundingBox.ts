import {XRectangle} from "../../../../element/shape/XRectangle";
import {Rect} from "../../../../model/Rect";
import {XGrip} from "./grip/resize/XGrip";
import {NWGrip} from "./grip/resize/corner/NWGrip";
import {NGrip} from "./grip/resize/side/NGrip";
import {NEGrip} from "./grip/resize/corner/NEGrip";
import {EGrip} from "./grip/resize/side/EGrip";
import {SEGrip} from "./grip/resize/corner/SEGrip";
import {SGrip} from "./grip/resize/side/SGrip";
import {SWGrip} from "./grip/resize/corner/SWGrip";
import {WGrip} from "./grip/resize/side/WGrip";
import {Point} from "../../../../model/Point";
import {XSVG} from "../../../../XSVG";
import {XRefPoint} from "./grip/reference/XRefPoint";
import {XRotatePoint} from "./grip/rotate/XRotatePoint";

export class XBoundingBox extends XRectangle {
  private container: XSVG;
  private _grips: XGrip[] = [];
  private xRefPoint: XRefPoint;
  private xRotatePoint: XRotatePoint;
  private _lastRefPoint: Point = {x: 0, y: 0};
  private _boundingRect: Rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  constructor(container: XSVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y, width, height);
    this.setStyle({
      fill: "none",
      stroke: "#002fff",
      "stroke-width": 1,
      "stroke-dasharray": "3 3"
    });

    this.svgElement.style.display = "none";
    this.removeOverEvent();

    this.container = container;

    this.xRefPoint = new XRefPoint(container);
    this.xRotatePoint = new XRotatePoint(container);
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
  get refPointSVG(): SVGElement {
    return this.xRefPoint.SVG;
  }
  override get refPoint(): Point {
    return this.xRefPoint.position;
  }
  override set refPoint(point: Point) {
    this.xRefPoint.position = point;
  }

  fixRefPoint() {
    this._lastRefPoint = this.xRefPoint.position;
  }
  get lastRefPoint(): Point {
    return this._lastRefPoint;
  }

  get rotPointSVG(): SVGElement {
    return this.xRotatePoint.SVG;
  }

  singleFocus() {
    this.svgElement.style.display = "block";
    for(let grip of this._grips) {
      grip.show();
    }
    this.xRefPoint.show();
    this.xRotatePoint.show();
  }
  multipleFocus() {
    this.svgElement.style.display = "block";
    /* more effective than with one loop and condition */
    for(let i = 0; i < this._grips.length; i += 2) {
      this._grips[i].show();
    }
    for(let i = 1; i < this._grips.length; i += 2) {
      this._grips[i].hide();
    }
    this.xRefPoint.hide();
    this.xRotatePoint.hide();
  }
  blur() {
    this.svgElement.style.display = "none";
    for(let grip of this._grips) {
      grip.hide();
    }
    this.xRefPoint.hide();
    this.xRotatePoint.hide();
  }

  get boundingRect(): Rect {
    return this._boundingRect;
  }

  set boundingRect(value: Rect) {
    this._boundingRect = value;
  }

  positionGrips() {
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

    this.xRotatePoint.position = {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2 - 30,
    }
  }

  override rotate(refPoint: Point, angle: number) {
    super.rotate(refPoint, angle);
    this._grips.forEach((grip: XRectangle) => grip.rotate(refPoint, angle));
  }
}
