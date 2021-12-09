import {XSVG} from "../../XSVG";

export abstract class XTool {
  protected readonly container: XSVG;
  protected constructor(container: XSVG) {
    this.container = container;
  }

  on(): void {
    this.container.activeTool.off();
    this.container.activeTool = this;
    this._on();
  }
  protected abstract _on(): void;
  abstract off(): void;
  abstract isOn(): boolean;
}