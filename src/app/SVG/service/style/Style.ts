import {Callback} from "../../dataSource/Callback";

export class Style {
  protected _styleCallBacks: Map<Callback, Function[]> = new Map<Callback, Function[]>();
  protected style: Map<string, string> = new Map<string, string>();

  get strokeWidth(): string {
    let width = this.style.get("stroke-width");
    if (!width)
      width = "5";
    return width;
  }

  set strokeWidth(width: string) {
    this.style.set("stroke-width", width);
  }

  get strokeColor(): string {
    let color = this.style.get("stroke");
    if (!color)
      color = "#000";

    return color;
  }

  set strokeColor(color: string) {
    this.style.set("stroke", color);
  }

  get strokeDashArray(): string {
    let array = this.style.get("stroke-dasharray");
    if (!array)
      array = "";

    return array;
  }

  set strokeDashArray(array: string) {
    this.style.set("stroke-dasharray", array);
  }

  get fillColor(): string {
    let color = this.style.get("fill");
    if (!color)
      color = "none";

    return color;
  }

  set fillColor(color: string) {
    this.style.set("fill", color);
  }

  get fontSize(): string {
    let fontSize = this.style.get("font-size");
    if (!fontSize)
      fontSize = "16";

    return fontSize;
  }

  set fontSize(size: string) {
    this.style.set("font-size", size);
  }

  get fontColor(): string {
    let color = this.style.get("color");
    if (!color)
      color = "#000";

    return color;
  }

  set fontColor(color: string) {
    this.style.set("color", color);
  }

  get backgroundColor(): string {
    let color = this.style.get("background-color");
    if (!color)
      color = "transparent";

    return color;
  }

  set backgroundColor(color: string) {
    this.style.set("background-color", color);
  }

  set set(style: Style) {
    this.strokeWidth = style.strokeWidth;
    this.strokeColor = style.strokeColor;
    this.fillColor = style.fillColor;
    this.fontSize = style.fontSize;
    this.fontColor = style.fontColor;
    this.backgroundColor = style.backgroundColor;
  }

  call(name: Callback, parameters: any = {}): void {
    let callback = this._styleCallBacks.get(name);
    if (callback)
      callback.forEach((func: Function) => {
        func(parameters);
      });
  }

  addCallBack(name: Callback, callback: Function) {
    let functions = this._styleCallBacks.get(name);
    if (!functions) {
      this._styleCallBacks.set(name, []);
    }
    this._styleCallBacks.get(name)?.push(callback)
  }

  removeCallBack(name: Callback, callback: Function) {
    let functions = this._styleCallBacks.get(name);
    if (functions)
      functions.splice(functions.indexOf(callback), 1);
  }
}
