import {DrawRectangle} from "../service/draw/tool/shape/DrawRectangle";
import {DrawLine} from "../service/draw/tool/line/DrawLine";
import {DrawPolyline} from "../service/draw/tool/line/DrawPolyline";
import {DrawEllipse} from "../service/draw/tool/shape/DrawEllipse";
import {DrawPolygon} from "../service/draw/tool/shape/DrawPolygon";
import {DrawFree} from "../service/draw/tool/free/DrawFree";

export class Tool {
  public static readonly free: DrawFree = new DrawFree();
  public static readonly line: DrawLine = new DrawLine();
  public static readonly polyline: DrawPolyline = new DrawPolyline();
  public static readonly ellipse: DrawEllipse = new DrawEllipse();
  public static readonly polygon: DrawPolygon = new DrawPolygon();
  public static readonly rectangle: DrawRectangle = new DrawRectangle();
}
