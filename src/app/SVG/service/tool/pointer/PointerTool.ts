import {Tool} from "../Tool";
import {SVG} from "../../../SVG";
import {Callback} from "../../../dataSource/Callback";

export class PointerTool extends Tool {
  private _cursor: string = "../assets/img/pointer.svg";

  public constructor(container: SVG) {
    super(container);
  }

  public get cursor(): string {
    return "url(" + this._cursor + "), auto";
  }
  public set cursor(URI: string) {
    this._cursor = URI;
  }

  protected _on(): void {
    this._isOn = true;
    this._container.HTML.style.cursor = this.cursor;
    this._container.blur();

    this._container.call(Callback.POINTER_TOOl_ON);
  }

  public off(): void {
    this._isOn = false;
    this._container.call(Callback.POINTER_TOOl_OFF);
  }
}
