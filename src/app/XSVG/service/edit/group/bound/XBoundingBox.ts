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
import {XElement} from "../../../../element/XElement";
import {XBox} from "../../../../element/shape/XBox";

export class XBoundingBox extends XBox {
  private container: XSVG;
  private _grips: XGrip[] = [];
  private xRefPoint: XRefPoint;
  private xRotatePoint: XRotatePoint;
  private readonly _boundingBoxGroup: SVGGElement;
  private readonly _refPointGroup: SVGGElement;
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
      "stroke-dasharray": "2 2"
    });

    this.svgElement.style.display = "none";
    this.removeOverEvent();

    this.container = container;

    this.xRefPoint = new XRefPoint(container);
    this.xRotatePoint = new XRotatePoint(container);
    this._grips.push(
      new NWGrip(container),
      new NGrip(container),

      new NEGrip(container),
      new EGrip(container),

      new SEGrip(container),
      new SGrip(container),

      new SWGrip(container),
      new WGrip(container)
    );

    /* create svg group */
    this._boundingBoxGroup = document.createElementNS(XElement.svgURI, "g");
    this._boundingBoxGroup.id = "bounding-box";
    this._boundingBoxGroup.appendChild(this.svgElement);
    this._boundingBoxGroup.appendChild(this.xRotatePoint.SVG);
    for(let grip of this._grips) {
      this._boundingBoxGroup.appendChild(grip.SVG);
    }

    this._refPointGroup = document.createElementNS(XElement.svgURI, "g");
    this._refPointGroup.id = "reference-point";
    this._refPointGroup.appendChild(this.xRefPoint.SVG);
  }

  get group(): SVGGElement {
    return this._boundingBoxGroup;
  }

  get refPointGroup(): SVGGElement {
    return this._refPointGroup;
  }

  fixRefPoint() {
    this.xRefPoint.fixPosition();
  }

  set lastRefPoint(refPoint: Point) {
    this.xRefPoint.lastRefPoint = refPoint;
  }
  get lastRefPoint(): Point {
    return {
      x: this.xRefPoint.lastRefPoint.x,
      y: this.xRefPoint.lastRefPoint.y
    };
  }

  singleFocus() {
    this.svgElement.style.display = "block";
    for (let grip of this._grips) {
      grip.show();
    }
    this.xRefPoint.show();
    this.xRotatePoint.show();
  }

  multipleFocus() {
    this.svgElement.style.display = "block";
    /* more effective than with one loop and condition */
    for (let i = 0; i < this._grips.length; i += 2) {
      this._grips[i].show();
    }
    for (let i = 1; i < this._grips.length; i += 2) {
      this._grips[i].hide();
    }
    this.xRefPoint.show();
    this.xRotatePoint.show();
  }

  blur() {
    this.svgElement.style.display = "none";
    for (let grip of this._grips)
      grip.hide();

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

    if(!points || !this._grips) return
    for(let grip of this._grips)
      grip.setPosition(points);

    this.xRotatePoint.position = {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2,
    }
  }

  override get refPoint(): Point {
    return this._refPoint;
  }

  override set refPoint(refPoint: Point) {
    this._boundingBoxGroup.style.transformOrigin = refPoint.x + "px " + refPoint.y + "px";
    this._refPoint = refPoint;
  }

  set refPointView(refPoint: Point) {
    this.xRefPoint.position = refPoint;
    this._refPointGroup.style.transformOrigin = refPoint.x + "px " + refPoint.y + "px";
  }

  override rotate(angle: number): void {
    this._boundingBoxGroup.style.transform = "rotate(" + angle + "deg)";
    this._refPointGroup.style.transform = "rotate(" + angle + "deg)";

    this._angle = angle;
  }
}
