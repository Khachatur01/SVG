import {Foreign} from "../../type/Foreign";
import {Rect} from "../../../model/Rect";
import {Point} from "../../../model/Point";
import {Size} from "../../../model/Size";
import {Path} from "../../shape/pointed/Path";
import {SVG} from "../../../SVG";
import {Element} from "../../Element";
import {PathObject} from "../../../model/path/PathObject";
import {MoveTo} from "../../../model/path/point/MoveTo";
import {LineTo} from "../../../model/path/line/LineTo";
import {MoveDrawable} from "../../../service/tool/draw/type/MoveDrawable";
import {Matrix} from "../../../service/math/Matrix";

export class Graphic extends Foreign implements MoveDrawable {
  public readonly outline: string = "thin solid #999";

  private _center: Point = {x: 0, y: 0};
  private _size: Size = {width: 0, height: 0};
  private _unit: number = 20;
  private _showSteps: boolean = true;
  private readonly _f: Function;
  private autoCreate: boolean = true;

  constructor(container: SVG, f: Function, center: Point = {x: 0, y: 0}, size: Size = {width: 1, height: 1}) {
    super(container);

    this.svgElement = document.createElementNS(Element.svgURI, "svg");
    this.svgElement.style.outline = this.outline;
    this._f = f;

    this.autoCreate = false;
    center = {
      x: center.x - size.width / 2,
      y: center.y - size.height / 2
    }
    this.position = center;
    this.setSize({
      x: center.x,
      y: center.y,
      width: size.width,
      height: size.height
    });
    this.autoCreate = true;
    this.recreateGraphic();
  }

  showSteps() {
    this._showSteps = true;
    this.recreateGraphic();
  }
  hideSteps() {
    this._showSteps = false;
    this.recreateGraphic();
  }

  private makeGraphic(): Path {
    let graphic = new Path(this._container);
    graphic.style.strokeWidth = "1";
    let graphicPathObject = new PathObject();

    let maxX = (this._size.width / 2) / this._unit;
    let x = -maxX;

    let step = 0.1;

    for(; x < maxX; x += step) {
      let visibleX = (this._size.width / 2) + x * this._unit;
      let visibleY = (this._size.height / 2) - (this._f(x) * this._unit);

      graphicPathObject.add(new LineTo({
        x: visibleX,
        y: visibleY
      }));
    }

    try {
      let firstPoint = graphicPathObject.get(0).position;
      graphicPathObject.replaceCommand(0, new MoveTo(firstPoint));
    } catch (e) {

    }
    graphic.path = graphicPathObject;
    return graphic;
  }
  private recreateGraphic() {
    this.svgElement.innerHTML = "";
    let localCenter = {
      x: this._size.width / 2,
      y: this._size.height / 2
    }

    let xAxis = new Path(this._container);
    xAxis.style.strokeWidth = "1";
    xAxis.style.strokeColor = "red";
    let xAxisPathObject = new PathObject();
    xAxisPathObject.add(new MoveTo({x: 0, y: localCenter.y}));
    xAxisPathObject.add(new LineTo({x: this._size.width, y: localCenter.y}));

    let yAxis = new Path(this._container);
    yAxis.style.strokeWidth = "1";
    yAxis.style.strokeColor = "blue";
    let yAxisPathObject = new PathObject();
    yAxisPathObject.add(new MoveTo({x: localCenter.x, y: 0}));
    yAxisPathObject.add(new LineTo({x: localCenter.x, y: this._size.height}));

    if(this._showSteps) {
      for (let i = localCenter.x - this._unit; i >= 0; i -= this._unit) {
        xAxisPathObject.add(new MoveTo({
          x: i,
          y: localCenter.y - this._unit / 2
        }));
        xAxisPathObject.add(new LineTo({
          x: i,
          y: localCenter.y + this._unit / 2
        }));
      }
      for (let i = localCenter.x + this._unit; i <= this._size.width; i += this._unit) {
        xAxisPathObject.add(new MoveTo({
          x: i,
          y: localCenter.y - this._unit / 2
        }));
        xAxisPathObject.add(new LineTo({
          x: i,
          y: localCenter.y + this._unit / 2
        }));
      }


      for (let i = localCenter.y - this._unit; i >= 0; i -= this._unit) {
        yAxisPathObject.add(new MoveTo({
          x: localCenter.x - this._unit / 2,
          y: i
        }));
        yAxisPathObject.add(new LineTo({
          x: localCenter.x + this._unit / 2,
          y: i
        }));
      }
      for (let i = localCenter.y + this._unit; i <= this._size.height; i += this._unit) {
        yAxisPathObject.add(new MoveTo({
          x: localCenter.x - this._unit / 2,
          y: i
        }));
        yAxisPathObject.add(new LineTo({
          x: localCenter.x + this._unit / 2,
          y: i
        }));
      }
    }

    xAxis.path = xAxisPathObject;
    yAxis.path = yAxisPathObject;

    this.svgElement.appendChild(xAxis.SVG);
    this.svgElement.appendChild(yAxis.SVG);
    this.svgElement.appendChild(this.makeGraphic().SVG);
  }

  get copy(): Graphic {
    return new Graphic(this._container, this._f);
  }

  get position(): Point {
    return {
      x: this._center.x - this._size.width / 2,
      y: this._center.y - this._size.height / 2
    };
  }
  set position(delta: Point) {
    this._center.x += delta.x;
    this._center.y += delta.y;

    let position = this.position;
    this.setAttr({
      x: position.x,
      y: position.y
    });

    if(this.autoCreate)
      this.recreateGraphic();
  }
  override get center(): Point {
    return this._center;
  }

  get size(): Size {
    return this._size;
  }
  drawSize(rect: Rect) {
    this.setSize(rect);
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

    this._size.width = rect.width;
    this._size.height = rect.height;
    this._center.x = rect.x + rect.width / 2;
    this._center.y = rect.y + rect.height / 2;

    this.setAttr({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    });

    if(this.autoCreate)
      this.recreateGraphic();
  }

  override correct(refPoint: Point, lastRefPoint: Point) {
    let delta = this.getCorrectionDelta(refPoint, lastRefPoint);
    if (delta.x == 0 && delta.y == 0) return;
    this.position = delta;
  }

  get boundingRect(): Rect {
    let position = this.position;
    return {x: position.x, y: position.y, width: this._size.width, height: this._size.height};
  }
  get rotatedBoundingRect(): Rect {
    let boundingRect = this.boundingRect;
    let left = boundingRect.x;
    let top = boundingRect.y;
    let right = boundingRect.x + boundingRect.width;
    let bottom = boundingRect.y + boundingRect.height;

    let rotatedPoints = Matrix.rotate(
      [
        {x: left, y: top},
        {x: right, y: top},
        {x: right, y: bottom},
        {x: left, y: bottom},
      ],
      this._refPoint,
      -this._angle
    );

    let minX = rotatedPoints[0].x;
    let minY = rotatedPoints[0].y;
    let maxX = rotatedPoints[0].x;
    let maxY = rotatedPoints[0].y;
    for(let i = 1; i < rotatedPoints.length; i++) {
      if(rotatedPoints[i].x < minX)
        minX = rotatedPoints[i].x;
      if(rotatedPoints[i].y < minY)
        minY = rotatedPoints[i].y;

      if(rotatedPoints[i].x > maxX)
        maxX = rotatedPoints[i].x;
      if(rotatedPoints[i].y > maxY)
        maxY = rotatedPoints[i].y;
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  toPath(): Path {
    return new Path(this._container);
  }

  isComplete(): boolean {
    return this._size.width >= 50 && this._size.height >= 30;
  }
}
