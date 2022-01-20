import {DrawRectangle} from "../service/tool/draw/element/figure/shape/DrawRectangle";
import {DrawLine} from "../service/tool/draw/element/figure/line/DrawLine";
import {DrawPolyline} from "../service/tool/draw/element/figure/line/DrawPolyline";
import {DrawEllipse} from "../service/tool/draw/element/figure/shape/DrawEllipse";
import {DrawPolygon} from "../service/tool/draw/element/figure/shape/DrawPolygon";
import {DrawFree} from "../service/tool/draw/mode/DrawFree";
import {SVG} from "../SVG";
import {DrawIsoscelesTriangle} from "../service/tool/draw/element/figure/shape/triangle/DrawIsoscelesTriangle";
import {DrawRightTriangle} from "../service/tool/draw/element/figure/shape/triangle/DrawRightTriangle";
import {DrawTextBox} from "../service/tool/draw/element/foreign/DrawTextBox";

export class DrawTools {
  private container: SVG;
  private readonly _free: DrawFree;
  private readonly _line: DrawLine;
  private readonly _polyline: DrawPolyline;
  private readonly _ellipse: DrawEllipse;
  private readonly _polygon: DrawPolygon;
  private readonly _rectangle: DrawRectangle;
  private readonly _isoscelesTriangle: DrawIsoscelesTriangle;
  private readonly _rightTriangle: DrawRightTriangle;
  private readonly _textBox: DrawTextBox;

  constructor(container: SVG) {
    this.container = container;

    this._free = new DrawFree(container);
    this._line = new DrawLine(container);
    this._polyline = new DrawPolyline(container);
    this._ellipse = new DrawEllipse(container);
    this._polygon = new DrawPolygon(container);
    this._rectangle = new DrawRectangle(container);
    this._isoscelesTriangle = new DrawIsoscelesTriangle(container);
    this._rightTriangle = new DrawRightTriangle(container);
    this._textBox = new DrawTextBox(container);
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

  get isoscelesTriangle(): DrawIsoscelesTriangle {
    return this._isoscelesTriangle;
  }

  get rightTriangle(): DrawRightTriangle {
    return this._rightTriangle;
  }

  get textBox(): DrawTextBox {
    return this._textBox;
  }
}
