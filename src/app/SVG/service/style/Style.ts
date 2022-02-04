import {Callback} from "../../dataSource/Callback";

export class Style {
  protected _styleCallBacks: Map<Callback, Function[]> = new Map<Callback, Function[]>();
  protected style: Map<string, string> = new Map<string, string>();

  public get strokeWidth(): string {
    let width = this.style.get("stroke-width");
    if (!width)
      width = "5";
    return width;
  }
  public set strokeWidth(width: string) {
    this.style.set("stroke-width", width);
  }

  public get strokeColor(): string {
    let color = this.style.get("stroke");
    if (!color)
      color = "#000";

    return color;
  }
  public set strokeColor(color: string) {
    this.style.set("stroke", color);
  }

  public get strokeDashArray(): string {
    let array = this.style.get("stroke-dasharray");
    if (!array)
      array = "";

    return array;
  }
  public set strokeDashArray(array: string) {
    this.style.set("stroke-dasharray", array);
  }

  public get fillColor(): string {
    let color = this.style.get("fill");
    if(!color)
      color = "#FFFFFF00";

    return color;
  }
  public set fillColor(color: string) {
    this.style.set("fill", color);
  }

  public get fontSize(): string {
    let fontSize = this.style.get("font-size");
    if (!fontSize)
      fontSize = "16";

    return fontSize;
  }
  public set fontSize(size: string) {
    this.style.set("font-size", size);
  }

  public get fontColor(): string {
    let color = this.style.get("color");
    if (!color)
      color = "#000";

    return color;
  }
  public set fontColor(color: string) {
    this.style.set("color", color);
  }

  public get backgroundColor(): string {
    let color = this.style.get("background-color");
    if (!color)
      color = "transparent";

    return color;
  }
  public set backgroundColor(color: string) {
    this.style.set("background-color", color);
  }

  public set set(style: Style) {
    this.strokeWidth = style.strokeWidth;
    this.strokeColor = style.strokeColor;
    this.fillColor = style.fillColor;
    this.fontSize = style.fontSize;
    this.fontColor = style.fontColor;
    this.backgroundColor = style.backgroundColor;
  }

  public call(name: Callback, parameters: any = {}): void {
    let callback = this._styleCallBacks.get(name);
    if (callback)
      callback.forEach((func: Function) => {
        func(parameters);
      });
  }
  public addCallBack(name: Callback, callback: Function) {
    let functions = this._styleCallBacks.get(name);
    if (!functions) {
      this._styleCallBacks.set(name, []);
    }
    this._styleCallBacks.get(name)?.push(callback)
  }
  public removeCallBack(name: Callback, callback: Function) {
    let functions = this._styleCallBacks.get(name);
    if (functions)
      functions.splice(functions.indexOf(callback), 1);
  }
}
