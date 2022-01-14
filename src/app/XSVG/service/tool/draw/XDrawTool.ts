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

  set perfect(mode: boolean) {
    if(this._drawTool)
      this._drawTool.perfect = mode;
  }

  drawing() {
    this._isDrawing = true;
  }
  drawingEnd() {
    this._isDrawing = false;
  }
}
