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
import {DrawGraphic} from "../service/tool/draw/element/foreign/DrawGraphic";
import {DrawVideo} from "../service/tool/draw/element/foreign/DrawVideo";
import {DrawImage} from "../service/tool/draw/element/foreign/DrawImage";
import {DrawAsset} from "../service/tool/draw/element/foreign/DrawAsset";

export class DrawTools {
  private readonly container: SVG;
  private readonly _free: DrawFree;
  private readonly _line: DrawLine;
  private readonly _polyline: DrawPolyline;
  private readonly _ellipse: DrawEllipse;
  private readonly _polygon: DrawPolygon;
  private readonly _rectangle: DrawRectangle;
  private readonly _isoscelesTriangle: DrawIsoscelesTriangle;
  private readonly _rightTriangle: DrawRightTriangle;
  private readonly _textBox: DrawTextBox;
  private readonly _video: DrawVideo;
  private readonly _image: DrawImage;
  private readonly _asset: DrawAsset;
  private readonly _graphic: DrawGraphic;

  public constructor(container: SVG) {
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
    this._video = new DrawVideo(container);
    this._image = new DrawImage(container);
    this._asset = new DrawAsset(container);
    this._graphic = new DrawGraphic(container);
  }

  public get free(): DrawFree {
    return this._free;
  }
  public get line(): DrawLine {
    return this._line;
  }
  public get polyline(): DrawPolyline {
    return this._polyline;
  }
  public get ellipse(): DrawEllipse {
    return this._ellipse;
  }
  public get polygon(): DrawPolygon {
    return this._polygon;
  }
  public get rectangle(): DrawRectangle {
    return this._rectangle;
  }
  public get isoscelesTriangle(): DrawIsoscelesTriangle {
    return this._isoscelesTriangle;
  }
  public get rightTriangle(): DrawRightTriangle {
    return this._rightTriangle;
  }
  public get textBox(): DrawTextBox {
    return this._textBox;
  }
  public get video(): DrawVideo {
    return this._video;
  }
  public get image(): DrawImage {
    return this._image;
  }
  public get asset(): DrawAsset {
    return this._asset;
  }
  public get graphic(): DrawGraphic {
    return this._graphic;
  }
}
