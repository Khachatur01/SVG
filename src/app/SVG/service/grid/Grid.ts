import {SVG} from "../../SVG";
import {ElementView} from "../../element/ElementView";
import {Point} from "../../model/Point";
import {Path} from "../../model/path/Path";
import {MoveTo} from "../../model/path/point/MoveTo";
import {LineTo} from "../../model/path/line/LineTo";
import {Callback} from "../../dataSource/Callback";

export class Grid {
  private readonly container: SVG;
  private readonly _group: SVGGElement;
  private squareSide: number = 20; /* default */
  private strokeWidth: number = 1; /* default */
  private strokeColor: string = "#ddd"; /* default */
  private _isGrid: boolean = false;
  private _isSnap: boolean = false;

  constructor(container: SVG) {
    this.container = container;
    this._group = document.createElementNS(ElementView.svgURI, "g");
    this._group.id = "grid";
  }

  get group(): SVGGElement {
    return this._group;
  }

  isSnap(): boolean {
    return this._isSnap;
  }

  snapOn() {
    if (this._isGrid) {
      this._isSnap = true;
      this.container.call(Callback.SNAP_ON);
    }
  }

  snapOff() {
    this._isSnap = false;
    this.container.call(Callback.SNAP_OFF);
  }

  isGrid(): boolean {
    return this._isGrid;
  }

  gridOn() {
    this._group.innerHTML = "";
    this.squareSide = Math.floor(this.squareSide);
    this._isGrid = true;
    let width: number = this.container.HTML.clientWidth;
    let height: number = this.container.HTML.clientHeight;

    let grid = document.createElementNS(ElementView.svgURI, "path");
    grid.style.shapeRendering = "optimizeSpeed";
    grid.style.strokeWidth = this.strokeWidth + "";
    grid.style.stroke = this.strokeColor;

    let path = new Path();

    for (let i = this.squareSide; i < width; i += this.squareSide) {
      path.add(new MoveTo({x: i, y: 0}));
      path.add(new LineTo({x: i, y: height}));
    }
    for (let i = this.squareSide; i < height; i += this.squareSide) {
      path.add(new MoveTo({x: 0, y: i}));
      path.add(new LineTo({x: width, y: i}));
    }

    grid.setAttribute("d", path.toString());
    this._group.appendChild(grid);

    this.container.call(Callback.GRID_ON);
  }

  gridOff() {
    this._group.innerHTML = "";
    this._isGrid = false;
    this._isSnap = false;
    this.container.call(Callback.GRID_OFF);
    this.container.call(Callback.SNAP_OFF);
  }

  getSnapPoint(point: Point) {
    if (!this._isSnap)
      return point;

    let x = Math.round(point.x / this.squareSide) * this.squareSide;
    let y = Math.round(point.y / this.squareSide) * this.squareSide;
    return {x: x, y: y};
  }

  set snapSide(squareSide: number) {
    this.squareSide = squareSide;
    if (this._isGrid) {
      this.gridOff();
      this.gridOn();
    }
    this.container.call(Callback.SNAP_SIDE_CHANGE,
      {snapSide: squareSide}
    );
  }

  get snapSide(): number {
    return this.squareSide;
  }
}
