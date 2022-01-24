import {Tool} from "../Tool";
import {SVG} from "../../../SVG";
import {Callback} from "../../../dataSource/Callback";
import {Path} from "../../../element/shape/pointed/Path";
import {PathObject} from "../../../model/path/PathObject";
import {MoveTo} from "../../../model/path/point/MoveTo";
import {LineTo} from "../../../model/path/line/LineTo";
import {Element} from "../../../element/Element";

export class HighlightTool extends Tool {
  private _timeout: number = 3000;
  private _color: string = "#7efca0AA";
  private _width: string = "20";
  private _isOn: boolean = false;
  private path: Path | null = null;
  private readonly group: SVGGElement;

  private start = this.onStart.bind(this);
  private highlight = this.onHighlight.bind(this);
  private end = this.onEnd.bind(this);

  constructor(container: SVG) {
    super(container);
    this.group = document.createElementNS(Element.svgURI, "g");
    this.group.id = "highlight";
  }

  set timeout(milliseconds: number) {
    this._timeout = milliseconds;
  }

  set color(color: string) {
    this._color = color;
  }

  set width(width: number) {
    this._width = width + "";
  }

  get SVG(): SVGGElement {
    return this.group;
  }

  private onStart(event: MouseEvent): void {
    let containerRect = this.container.HTML.getBoundingClientRect();

    let start = new PathObject();
    start.add(
      new MoveTo({
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top
      })
    );

    this.path = new Path(this.container, start);
    this.path.removeOverEvent();
    this.path.style.strokeWidth = this._width;
    this.path.style.strokeColor = this._color;
    this.path.style.fillColor = "none";

    this.group.appendChild(this.path.SVG);
    this.container.HTML.addEventListener("mousemove", this.highlight);
    document.addEventListener("mouseup", this.end);
  }

  private onHighlight(event: MouseEvent): void {
    let containerRect = this.container.HTML.getBoundingClientRect();

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
    this.container.HTML.removeEventListener("mousemove", this.highlight);
    document.removeEventListener("mouseup", this.end);
  }

  protected _on(): void {
    this.container.HTML.addEventListener("mousedown", this.start);
    this._isOn = true;
    this.container.HTML.style.cursor = "crosshair";
    this.container.blur();
    this.container.call(Callback.HIGHLIGHT_TOOl_ON);
  }

  off(): void {
    this.container.HTML.removeEventListener("mousedown", this.start);
    this._isOn = false;

    this.container.call(Callback.HIGHLIGHT_TOOl_OFF);
  }

  isOn(): boolean {
    return this._isOn;
  }
}
