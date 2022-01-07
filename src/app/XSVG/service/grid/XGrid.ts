import {XSVG} from "../../XSVG";
import {XElement} from "../../element/XElement";
import {Point} from "../../model/Point";

export class XGrid {
  private readonly container: XSVG;
  private readonly _group: SVGGElement;
  private squareSide: number = 40;
  private _isGrid: boolean = false;
  private _isSnap: boolean = false;

  constructor(container: XSVG) {
    this.container = container;
    this._group = document.createElementNS(XElement.svgURI, "g");
    this._group.id = "grid";
  }
  get group(): SVGGElement {
    return this._group;
  }

  isSnap(): boolean {
    return this._isSnap;
  }
  snapOn() {
    if(this._isGrid)
      this._isSnap = true;
  }
  snapOff() {
    this._isSnap = false;
  }

  isGrid(): boolean {
    return this._isGrid;
  }

  gridOn(side: number) {
    this._group.innerHTML = "";
    this.squareSide = side;
    this._isGrid = true;
    let width: number = this.container.HTML.clientWidth;
    let height: number = this.container.HTML.clientHeight;

    let grid = document.createElementNS(XElement.svgURI, "path");
    grid.style.strokeWidth = "1";
    grid.style.stroke = "#555555";

    let pathString = "";

    for(let i = side; i < width; i += side) {
      pathString += "M " + i + " 0 ";
      pathString += "L " + i + " " + height + " ";
    }
    for(let i = side; i < height; i += side) {
      pathString += "M " + "0 " + i + " ";
      pathString += "L " + width + " " + i + " ";
    }

    grid.setAttribute("d", pathString);
    this._group.appendChild(grid);
  }
  gridOff() {
    this._group.innerHTML = "";
    this._isGrid = false;
    this._isSnap = false;
  }

  getSnapPoint(point: Point) {
    if(!this._isSnap)
      return point;

    let x = Math.round(point.x / this.squareSide) * this.squareSide;
    let y = Math.round(point.y / this.squareSide) * this.squareSide;
    return {x: x, y: y};
  }
}
