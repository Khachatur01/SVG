import {Tool} from "../Tool";
import {SVG} from "../../../SVG";
import {Callback} from "../../../dataSource/Callback";

export class PointerTool extends Tool {
  private _isOn: boolean = false;
  private _cursor: string = "../assets/img/pointer.svg";

  constructor(container: SVG) {
    super(container);
  }

  get cursor(): string {
    return "url(" + this._cursor + "), auto";
  }

  set cursor(URI: string) {
    this._cursor = URI;
  }

  protected _on(): void {
    this._isOn = true;
    this.container.HTML.style.cursor = this.cursor;
    this.container.blur();

    this.container.call(Callback.POINTER_TOOl_ON);
  }

  off(): void {
    this._isOn = false;
    this.container.call(Callback.POINTER_TOOl_OFF);
  }

  isOn(): boolean {
    return this._isOn;
  }
}
