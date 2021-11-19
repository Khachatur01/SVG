import {ElementSVG} from "../ElementSVG";

export class GroupSVG {
  private svgElement: SVGGElement;

  constructor() {
    this.svgElement = document.createElementNS(ElementSVG.svgURI, "g");
  }

  get SVG(): SVGGElement {
    return this.svgElement as SVGGElement;
  }
  set SVG(svgGElement: SVGGElement) {
    this.svgElement = svgGElement
  }

  appendChild(svgElement: ElementSVG): void {
    this.svgElement.appendChild(svgElement.SVG);
  }

  removeChild(svgElement: ElementSVG): void {
    this.svgElement.removeChild(svgElement.SVG);
  }

}
