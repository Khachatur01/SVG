import {XElement} from "../../../element/XElement";

export class XGroup {
  private svgElement: SVGGElement;

  constructor() {
    this.svgElement = document.createElementNS(XElement.svgURI, "g");
  }

  get SVG(): SVGGElement {
    return this.svgElement;
  }
  set SVG(svgGElement: SVGGElement) {
    this.svgElement = svgGElement
  }

  appendChild(svgElement: SVGElement): void {
    this.svgElement.appendChild(svgElement);
  }

  removeChild(svgElement: SVGElement): void {
    this.svgElement.removeChild(svgElement);
  }
}
