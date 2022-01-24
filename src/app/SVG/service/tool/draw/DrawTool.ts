import {Drawable} from "./Drawable";
import {SVG} from "../../../SVG";
import {Tool} from "../Tool";

export class DrawTool extends Tool {
  private _lastDrawTool: Drawable | null = null;
  private _drawTool: Drawable | null = null;
  private _isOn: boolean = false;
  private _isDrawing: boolean = false;

  constructor(container: SVG) {
    super(container);
  }

  set tool(drawTool: Drawable) {
    this._drawTool?.stop();
    this._drawTool = drawTool;
    this._lastDrawTool = drawTool;
  }

  _on() {
    this._isOn = true;
    this._drawTool?.start(this.container);
    this.container.HTML.style.cursor = "crosshair";
    this.container.blur();
  }

  off() {
    this._isOn = false;
    this._drawTool?.stop();
    this.container.HTML.style.cursor = "default";
  }

  isOn(): boolean {
    return this._isOn;
  }

  drawing() {
    this._isDrawing = true;
  }

  drawingEnd() {
    this._isDrawing = false;
  }
}
