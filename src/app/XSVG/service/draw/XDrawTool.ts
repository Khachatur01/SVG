import {XDrawable} from "./XDrawable";
import {XSVG} from "../../XSVG";

export class XDrawTool {
  private lastDrawTool: XDrawable | null = null;
  private drawTool: XDrawable | null = null;
  private isDraw: boolean = false;
  private readonly container: XSVG;

  constructor(container: XSVG) {
    this.container = container;
  }

  draw(drawTool: XDrawable) {
    this.drawTool?.stop();
    this.drawTool = drawTool;
    this.lastDrawTool = drawTool;

    this.isDraw = true;
    this.drawTool?.start(this.container);
  }

  resume() {
    this.isDraw = true;
    this.drawTool = this.lastDrawTool;
    this.drawTool?.start(this.container);
  }
  pause() {
    this.lastDrawTool = this.drawTool;
    this.stop();
  }
  stop() {
    this.isDraw = false;
    this.drawTool?.stop();
    this.drawTool = null;
  }

  isOn(): boolean {
    return this.isDraw;
  }

  set perfect(mode: boolean) {
    if(this.drawTool)
      this.drawTool.perfect = mode;
  }
}
