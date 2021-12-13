import {DrawRectangle} from "../service/tool/draw/figure/shape/DrawRectangle";
import {DrawLine} from "../service/tool/draw/figure/line/DrawLine";
import {DrawPolyline} from "../service/tool/draw/figure/line/DrawPolyline";
import {DrawEllipse} from "../service/tool/draw/figure/shape/DrawEllipse";
import {DrawPolygon} from "../service/tool/draw/figure/shape/DrawPolygon";
import {DrawFree} from "../service/tool/draw/mode/DrawFree";

export class Tool {
  public static readonly free: DrawFree = new DrawFree();
  public static readonly line: DrawLine = new DrawLine();
  public static readonly polyline: DrawPolyline = new DrawPolyline();
  public static readonly ellipse: DrawEllipse = new DrawEllipse();
  public static readonly polygon: DrawPolygon = new DrawPolygon();
  public static readonly rectangle: DrawRectangle = new DrawRectangle();
}
