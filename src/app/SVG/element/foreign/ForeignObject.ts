import {Element} from "../Element";
import {SVG} from "../../SVG";
import {Point} from "../../model/Point";
import {Size} from "../../model/Size";
import {Rect} from "../../model/Rect";
import {Path} from "../shape/pointed/Path";
import {Callback} from "../../dataSource/Callback";
import {Foreign} from "../type/Foreign";

export class ForeignObject extends Foreign {
  protected _content: HTMLElement | null = null;
  public readonly outline: string = "thin solid #999";

  constructor(container: SVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container);
    this.svgElement = document.createElementNS(Element.svgURI, "foreignObject");
    this.svgElement.style.outline = "none";
    this.svgElement.id = this.id;

    this.position = {x: x, y: y};

    this.setSize({
      x: x, y: y,
      width: width, height: height
    });
    this.setOverEvent();

    this.setAttr({
      preserveAspectRatio: "none"
    });

    this._container.addCallBack(Callback.EDIT_TOOl_OFF, () => {
      if (this._content) {
        this._content.style.userSelect = "none";
      }
    });

    this._container.addCallBack(Callback.EDIT_TOOl_ON, () => {
      if (this._content) {
        this._content.style.userSelect = "unset";
      }
    });
  }

  override get HTML(): SVGElement | HTMLElement {
    if (this._content)
      return this._content;

    return this.svgElement
  }

  get copy(): ForeignObject {
    let position = this.position;
    let size = this.size;

    let foreignObject: ForeignObject = new ForeignObject(this._container);
    if (this._content)
      foreignObject.setContent(this._content.cloneNode(true) as HTMLElement);

    foreignObject.position = position;
    foreignObject.setSize({
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height
    });
    foreignObject.fixRect();

    foreignObject.refPoint = Object.assign({}, this.refPoint);
    foreignObject.rotate(this._angle);

    foreignObject.style.set = this.style;

    return foreignObject;
  }

  isComplete(): boolean {
    let size = this.size;
    return size.width > 0 && size.height > 0;
  }

  get position(): Point {
    return {
      x: parseInt(this.getAttr("x")),
      y: parseInt(this.getAttr("y"))
    };
  }

  set position(delta: Point) {
    this.setAttr({
      x: this._lastPosition.x + delta.x,
      y: this._lastPosition.y + delta.y
    });
  }

  override correct(refPoint: Point, lastRefPoint: Point) {
    let delta = this.getCorrectionDelta(refPoint, lastRefPoint);
    if (delta.x == 0 && delta.y == 0) return;
    let position = this.position;

    this.setAttr({
      x: position.x + delta.x,
      y: position.y + delta.y
    });
  }

  get size(): Size {
    return {
      width: parseInt(this.getAttr("width")),
      height: parseInt(this.getAttr("height"))
    };
  }

  setSize(rect: Rect): void {
    if (rect.width < 0) {
      rect.width = -rect.width;
      rect.x -= rect.width;
    }
    if (rect.height < 0) {
      rect.height = -rect.height;
      rect.y -= rect.height;
    }

    this.setAttr({
      x: rect.x + "",
      y: rect.y + "",
      width: rect.width + "",
      height: rect.height + ""
    });
  }

  get content(): HTMLElement | null {
    return this._content;
  }

  setContent(div: HTMLElement, setListeners: boolean = true): void {
    this._content = div;
    div.style.userSelect = "none";
    div.contentEditable = "true";
    this.svgElement.appendChild(div);

    if (setListeners) {
      div.addEventListener("focus", () => {
        if (this._container.editTool.isOn()) {
          div.focus();
          this.svgElement.style.outline = this.outline;
        } else {
          div.blur();
        }
      });
      div.addEventListener("blur", () => {
        this.svgElement.style.outline = "unset";
      });
    }
  }

  get boundingRect(): Rect {
    let points = this.points;
    return this.calculateBoundingBox(points);
  }

  get rotatedBoundingRect(): Rect {
    let points = this.rotatedPoints;
    return this.calculateBoundingBox(points);
  }

  toPath(): Path {
    return new Path(this._container);
  }
}
