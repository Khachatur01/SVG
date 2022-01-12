import {DrawRectangle} from "../service/tool/draw/figure/shape/DrawRectangle";
import {DrawLine} from "../service/tool/draw/figure/line/DrawLine";
import {DrawPolyline} from "../service/tool/draw/figure/line/DrawPolyline";
import {DrawEllipse} from "../service/tool/draw/figure/shape/DrawEllipse";
import {DrawPolygon} from "../service/tool/draw/figure/shape/DrawPolygon";
import {DrawFree} from "../service/tool/draw/mode/DrawFree";
import {XSVG} from "../XSVG";
import {DrawTriangle} from "../service/tool/draw/figure/shape/triangle/DrawTriangle";
import {DrawRightTriangle} from "../service/tool/draw/figure/shape/triangle/DrawRightTriangle";

export class Tool {
  private container: XSVG;
  private readonly _free: DrawFree;
  private readonly _line: DrawLine;
  private readonly _polyline: DrawPolyline;
  private readonly _ellipse: DrawEllipse;
  private readonly _polygon: DrawPolygon;
  private readonly _rectangle: DrawRectangle;
  private readonly _triangle: DrawTriangle;
  private readonly _rightTriangle: DrawRightTriangle;

  constructor(container: XSVG) {
    this.container = container;

    this._free = new DrawFree(container);
    this._line = new DrawLine(container);
    this._polyline = new DrawPolyline(container);
    this._ellipse = new DrawEllipse(container);
    this._polygon = new DrawPolygon(container);
    this._rectangle = new DrawRectangle(container);
    this._triangle = new DrawTriangle(container);
    this._rightTriangle = new DrawRightTriangle(container);
  }

  get free(): DrawFree {
    return this._free;
  }

  get line(): DrawLine {
    return this._line;
  }

  get polyline(): DrawPolyline {
    return this._polyline;
  }

  get ellipse(): DrawEllipse {
    return this._ellipse;
  }

  get polygon(): DrawPolygon {
    return this._polygon;
  }

  get rectangle(): DrawRectangle {
    return this._rectangle;
  }

  get triangle(): DrawTriangle {
    return this._triangle;
  }

  get rightTriangle(): DrawRightTriangle {
    return this._rightTriangle;
  }
}
