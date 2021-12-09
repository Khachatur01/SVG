import {XDrawable} from "./XDrawable";
import {XSVG} from "../../../XSVG";
import {XTool} from "../XTool";

export class XDrawTool extends XTool {
  private _lastDrawTool: XDrawable | null = null;
  private _drawTool: XDrawable | null = null;
  private _isOn: boolean = false;
  private _isDrawing: boolean = false;

  constructor(container: XSVG) {
    super(container);
  }

  set tool(drawTool: XDrawable) {
    this._drawTool?.stop();
    this._drawTool = drawTool;
    this._lastDrawTool = drawTool;
  }

  _on() {
    this._isOn = true;
    this._drawTool?.start(this.container);
  }
  off() {
    this._isOn = false;
    this._drawTool?.stop();
  }

  isOn(): boolean {
    return this._isOn;
  }

  set perfect(mode: boolean) {
    if(this._drawTool)
      this._drawTool.perfect = mode;
  }

  isDrawing(): boolean {
    return this._isDrawing;
  }

  drawing() {
    this._isDrawing = true;
  }
  drawingEnd() {
    this._isDrawing = false;
  }
}
