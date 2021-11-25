import {ParserError} from "@angular/compiler";
import {XBoundingBox} from "../service/edit/bound/XBoundingBox";
import {XGroup} from "../service/edit/group/XGroup";
import {XDraggable} from "../service/drag/XDraggable";
import {Point} from "../model/Point";
import {Transform} from "../model/Transform";

export abstract class XElement implements XDraggable {
  private transform: Transform = new Transform();
  protected style: any = {
    fill: "none",
    stroke: "black",
    highlight: "red",
    strokeWidth: 2
  }

  protected xBoundingBox: XBoundingBox = new XBoundingBox(); // grip - resizer
  protected svgElement: SVGElement = document.createElementNS(XElement.svgURI, "rect"); // default element
  protected svgGroup: SVGGElement = document.createElementNS(XElement.svgURI, "g");

  public static readonly svgURI: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

  get group(): XGroup {
    let xGroup: XGroup = new XGroup();
    xGroup.SVG = this.svgGroup;
    return xGroup;
  }

  get SVG(): SVGElement {
    return this.svgElement;
  }
  get boundingBox(): XBoundingBox {
    return this.xBoundingBox;
  }

  getAttr(attribute: string): string {
    let value = this.SVG.getAttribute(attribute)
    if(!value)
      throw ParserError;
    return value;
  }
  setAttr(attributes: object): void {
    for(const [key, value] of Object.entries(attributes))
      if(key && value)
        this.SVG.setAttribute(key, value as string);
  }
  setDefaultStyle(): void {
    this.setAttr({
      fill: this.style.fill,
      stroke: this.style.stroke,
      "stroke-width": this.style.strokeWidth
    });
  }

  remove() {
    let group = this.SVG.parentElement;
    group?.parentElement?.removeChild(group);
  }

  focusStyle() {
    if(!this.xBoundingBox) throw DOMException;
    this.xBoundingBox.SVG.style.display = "block";
  }
  blurStyle() {
    if(!this.xBoundingBox) throw DOMException;
    this.xBoundingBox.SVG.style.display = "none";
  }

  setOverEvent() {
    this.SVG.addEventListener("mouseover", () => {
      this.highlight();
    })
    this.SVG.addEventListener("mouseleave", () => {
      this.lowlight();
    })
  }

  highlight(): void {
    this.setAttr({
      stroke: this.style.highlight
    });
  }
  lowlight(): void {
    this.setAttr({
      stroke: this.style.stroke
    });
  }

  get position(): Point {
    return {
      x: this.transform.translateX,
      y: this.transform.translateY
    };
  }
  set position(position: Point) {
    this.transform.translateX = position.x;
    this.transform.translateY = position.y;
    this.group.SVG.style.transform = this.transform.toString();
  }
}

