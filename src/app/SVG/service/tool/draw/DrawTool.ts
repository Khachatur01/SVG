import {Drawable} from "./Drawable";
import {SVG} from "../../../SVG";
import {Tool} from "../Tool";

export class DrawTool extends Tool {
  private _lastDrawTool: Drawable | null = null;
  private _drawTool: Drawable | null = null;
  private _isDrawing: boolean = false;

  public constructor(container: SVG) {
    super(container);
  }

  public set tool(drawTool: Drawable) {
    this._drawTool?.stop();
    this._drawTool = drawTool;
    this._lastDrawTool = drawTool;
  }

  protected _on() {
    this._isOn = true;
    this._drawTool?.start(this._container);
    this._container.HTML.style.cursor = "crosshair";
    this._container.blur();
  }

  public off() {
    this._isOn = false;
    this._drawTool?.stop();
    this._container.HTML.style.cursor = "default";
  }

  public drawing() {
    this._isDrawing = true;
  }

  public drawingEnd() {
    this._isDrawing = false;
  }
}
