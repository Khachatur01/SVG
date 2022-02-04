import {Tool} from "../Tool";
import {SVG} from "../../../SVG";
import {Callback} from "../../../dataSource/Callback";
import {PathView} from "../../../element/shape/pointed/PathView";
import {Path} from "../../../model/path/Path";
import {MoveTo} from "../../../model/path/point/MoveTo";
import {LineTo} from "../../../model/path/line/LineTo";
import {ElementView} from "../../../element/ElementView";

export class HighlightTool extends Tool {
  private _timeout: number = 3000;
  private _color: string = "#7efca0AA";
  private _width: string = "20";
  private path: PathView | null = null;
  private readonly group: SVGGElement;

  private start = this.onStart.bind(this);
  private highlight = this.onHighlight.bind(this);
  private end = this.onEnd.bind(this);

  public constructor(container: SVG) {
    super(container);
    this.group = document.createElementNS(ElementView.svgURI, "g");
    this.group.id = "highlight";
  }

  public set timeout(milliseconds: number) {
    this._timeout = milliseconds;
  }

  public set color(color: string) {
    this._color = color;
  }

  public set width(width: number) {
    this._width = width + "";
  }

  public get SVG(): SVGGElement {
    return this.group;
  }

  private onStart(event: MouseEvent): void {
    let containerRect = this._container.HTML.getBoundingClientRect();

    let start = new Path();
    start.add(
      new MoveTo({
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top
      })
    );

    this.path = new PathView(this._container, start);
    this.path.removeOverEvent();
    this.path.style.strokeWidth = this._width;
    this.path.style.strokeColor = this._color;
    this.path.style.fillColor = "none";

    this.group.appendChild(this.path.SVG);
    this._container.HTML.addEventListener("mousemove", this.highlight);
    document.addEventListener("mouseup", this.end);
  }

  private onHighlight(event: MouseEvent): void {
    let containerRect = this._container.HTML.getBoundingClientRect();

    this.path?.addCommand(
      new LineTo({
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top
      })
    );
  }

  private onEnd(): void {
    let path = this.path;
    setTimeout(() => {
      if (path) this.group.removeChild(path.SVG)
    }, this._timeout);
    this._container.HTML.removeEventListener("mousemove", this.highlight);
    document.removeEventListener("mouseup", this.end);
  }

  protected _on(): void {
    this._container.HTML.addEventListener("mousedown", this.start);
    this._isOn = true;
    this._container.HTML.style.cursor = "crosshair";
    this._container.blur();

    this._container.call(Callback.HIGHLIGHT_TOOl_ON);
  }

  public off(): void {
    this._container.HTML.removeEventListener("mousedown", this.start);
    this._isOn = false;

    this._container.call(Callback.HIGHLIGHT_TOOl_OFF);
  }
}
