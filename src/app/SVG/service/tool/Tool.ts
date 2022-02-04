import {SVG} from "../../SVG";

export abstract class Tool {
  protected readonly _container: SVG;
  protected _isOn: boolean = false;

  protected constructor(container: SVG) {
    this._container = container;
  }

  public get container() {
    return this._container;
  }

  protected abstract _on(): void;
  public on(): void {
    this._container.activeTool.off();
    this._container.activeTool = this;
    this._on();
  }

  abstract off(): void;

  public isOn(): boolean {
    return this._isOn;
  }
}
