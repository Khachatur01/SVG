import {SVG} from "../../SVG";

export abstract class Tool {
  protected readonly container: SVG;

  protected constructor(container: SVG) {
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
