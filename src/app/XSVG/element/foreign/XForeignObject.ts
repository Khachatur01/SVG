import {XElement} from "../XElement";
import {XSVG} from "../../XSVG";
import {Point} from "../../model/Point";
import {Size} from "../../model/Size";
import {Rect} from "../../model/Rect";
import {XPath} from "../path/XPath";
import {Callback} from "../../model/Callback";

export class XForeignObject extends XElement {
  protected content: HTMLElement | null = null;

  constructor(container: XSVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container);
    this.svgElement = document.createElementNS(XElement.svgURI, "foreignObject");

    this.position = {x: x, y: y};

    this.setSize({
      x: x, y: y,
      width: width, height: height
    });
    this.setOverEvent();

    this.setAttr({
      preserveAspectRatio: "none"
    });

    this.container.addCallBack(Callback.SELECT_TOOl, () => {
      if(this.content) {
        this.content.style.userSelect = "none";
        this.content.style.cursor = "move";
      }
    });

    this.container.addCallBack(Callback.EDIT_TOOl, () => {
      if(this.content) {
        this.content.style.userSelect = "unset";
        this.content.style.cursor = "text";
      }
    });
  }
  isComplete(): boolean {
    let size = this.size;
    return size.width > 0 && size.height > 0;
  }

  get points(): Point[] {
    let position: Point = this.position;
    let size: Size = this.size;

    return [
      position,
      {x: position.x, y: position.y + size.height},
      {x: position.x + size.width, y: position.y + size.height},
      {x: position.x + size.width, y: position.y},
    ];
  }

  get position(): Point {
    return {
      x: parseInt(this.getAttr("x")),
      y: parseInt(this.getAttr("y"))
    };
  }

  override set position(delta: Point) {
    this.setAttr({
      x: this._lastPosition.x + delta.x,
      y: this._lastPosition.y + delta.y
    });
  }

  override correct(refPoint: Point, lastRefPoint: Point) {
    let delta = this.getCorrectionDelta(refPoint, lastRefPoint);
    if(delta.x == 0 && delta.y == 0) return;
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
    if(rect.width < 0) {
      rect.width = -rect.width;
      rect.x -= rect.width;
    }
    if(rect.height < 0) {
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

  setContent(div: HTMLElement): void {
    this.content = div;
    div.style.userSelect = "none";
    this.svgElement.appendChild(div);

    this.content?.addEventListener("focus", () => {
      if(this.container.editTool.isOn()) {
        this.content?.focus();
      } else {
        this.content?.blur();
      }
    });
  }

  toPath(): XPath {
    return new XPath(this.container);
  }

}
