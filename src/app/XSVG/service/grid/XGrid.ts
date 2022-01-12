import {XSVG} from "../../XSVG";
import {XElement} from "../../element/XElement";
import {Point} from "../../model/Point";
import {Path} from "../../model/path/Path";
import {MoveTo} from "../../model/path/point/MoveTo";
import {LineTo} from "../../model/path/line/LineTo";

export class XGrid {
  private readonly container: XSVG;
  private readonly _group: SVGGElement;
  private squareSide: number = 20; /* default */
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

  gridOn(side: number, stokeWidth: number, strokeColor: string) {
    this._group.innerHTML = "";
    this.squareSide = Math.floor(side);
    this._isGrid = true;
    let width: number = this.container.HTML.clientWidth;
    let height: number = this.container.HTML.clientHeight;

    let grid = document.createElementNS(XElement.svgURI, "path");
    grid.style.strokeWidth = stokeWidth + "";
    grid.style.stroke = strokeColor;

    let path = new Path();

    for(let i = this.squareSide; i < width; i += this.squareSide) {
      path.add(new MoveTo({x: i + 0.5, y: 0}));
      path.add(new LineTo({x: i + 0.5, y: height}));
    }
    for(let i = this.squareSide; i < height; i += this.squareSide) {
      path.add(new MoveTo({x: 0, y: i + 0.5}));
      path.add(new LineTo({x: width, y: i + 0.5}));
    }

    grid.setAttribute("d", path.toString());
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
