import {XDrawable} from "./XDrawable";
import {XSVG} from "../../XSVG";

export class XDrawTool {
  private lastDrawTool: XDrawable | null = null;
  private drawTool: XDrawable | null = null;
  private _isOn: boolean = false;
  private _isDrawing: boolean = false;
  private readonly container: XSVG;

  constructor(container: XSVG) {
    this.container = container;
  }

  draw(drawTool: XDrawable) {
    this.drawTool?.stop();
    this.drawTool = drawTool;
    this.lastDrawTool = drawTool;

    this._isOn = true;
    this.drawTool?.start(this.container);
  }

  resume() {
    this._isOn = true;
    this.drawTool = this.lastDrawTool;
    this.drawTool?.start(this.container);
  }
  pause() {
    this.lastDrawTool = this.drawTool;
    this.stop();
  }
  stop() {
    this._isOn = false;
    this.drawTool?.stop();
    this.drawTool = null;
  }

  isOn(): boolean {
    return this._isOn;
  }

  set perfect(mode: boolean) {
    if(this.drawTool)
      this.drawTool.perfect = mode;
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
