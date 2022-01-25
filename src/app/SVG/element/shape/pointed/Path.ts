import {Element} from "../../Element";
import {PathObject} from "../../../model/path/PathObject";
import {Point} from "../../../model/Point";
import {Size} from "../../../model/Size";
import {SVG} from "../../../SVG";
import {PathCommand} from "../../../model/path/PathCommand";
import {Close} from "../../../model/path/close/Close";
import {Pointed} from "./Pointed";
import {Rect} from "../../../model/Rect";
import {LineTo} from "../../../model/path/line/LineTo";

export class Path extends Pointed {
  protected _size: Size = {width: 0, height: 0};
  protected _path: PathObject;
  protected _lastPath: PathObject;

  constructor(container: SVG, path: PathObject = new PathObject()) {
    super(container);
    this.svgElement = document.createElementNS(Element.svgURI, "path");
    this.svgElement.id = this.id;

    this._path = path;
    this._lastPath = path;
    this.setAttr({
      d: this._path.toString()
    })
    this.setOverEvent();
    try {
      this.style.setDefaultStyle();
    } catch (error: any) {
    }
  }

  get path(): PathObject {
    return this._path;
  }

  set path(path: PathObject) {
    this._path = path;
    this.setAttr({
      d: path.toString()
    })
  }

  get copy(): Path {
    let path: Path = new Path(this._container);
    path.path = this._path.copy;
    path.fixRect();

    path.refPoint = Object.assign({}, this.refPoint);
    path.rotate(this._angle);

    path.style.set = this.style;

    return path;
  }

  override fixRect() {
    super.fixRect();
    this.fixPath();
    this._lastPoints = this._lastPath.points;
  }

  fixPath() {
    this._lastPath = this._path.copy;
  }

  isComplete(): boolean {
    let size = this.size;
    return size.width != 0 && size.height != 0;
  }

  get commands(): PathCommand[] {
    return this._path.getAll();
  }

  override get points(): Point[] {
    return this._path.points;
  }

  override set points(points: Point[]) {
    let commands = this._path.getAll();
    for (let i = 0; i < commands.length; i++)
      commands[i].position = points[i];

    this.setAttr({
      d: this._path.toString()
    });
  }

  override get position(): Point {
    let commands = this._path.getAll();
    let leftTop: Point = Object.assign({}, commands[0].position);

    for (let i = 1; i < commands.length; i++) {
      if (commands[i] instanceof Close) continue;

      if (commands[i].position.x < leftTop.x)
        leftTop.x = commands[i].position.x;
      if (commands[i].position.y < leftTop.y)
        leftTop.y = commands[i].position.y;
    }
    return leftTop;
  }

  override set position(delta: Point) {
    let lastCommands = this._lastPath.getAll();
    let thisCommands = this._path.getAll();

    for (let i = 0; i < lastCommands.length; i++) {
      thisCommands[i].position = {
        x: lastCommands[i].position.x + delta.x,
        y: lastCommands[i].position.y + delta.y
      }
    }

    this._path.setAll(thisCommands);

    this.setAttr({
      d: this._path.toString()
    });
  }

  override get size(): Size {
    let commands = this._path.getAll();
    /* get copy, not reference */
    let min = Object.assign({}, commands[0].position);
    let max = Object.assign({}, commands[0].position);

    for (let i = 1; i < commands.length; i++) {
      if (commands[i] instanceof Close) continue;

      if (commands[i].position.x < min.x)
        min.x = commands[i].position.x
      if (commands[i].position.y < min.y)
        min.y = commands[i].position.y

      if (commands[i].position.x > max.x)
        max.x = commands[i].position.x
      if (commands[i].position.y > max.y)
        max.y = commands[i].position.y
    }

    this._size = {
      width: max.x - min.x,
      height: max.y - min.y
    };

    return this._size;
  }

  override setSize(rect: Rect) { //FIXME
    let dw = 1;
    let dh = 1;

    if (this._lastSize.width != 0)
      dw = rect.width / this._lastSize.width;
    if (this._lastSize.height != 0)
      dh = rect.height / this._lastSize.height;


    let commands = this.commands;
    for (let i = 0; i < commands.length; i++) {
      /* points may not be fixed, and this._lastPoints[i] may be undefined */
      if (!this._lastPoints[i])
        this._lastPoints[i] = {x: 0, y: 0};

      commands[i].position.x = rect.x + Math.abs(this._lastPoints[i].x - rect.x) * dw;
      commands[i].position.y = rect.y + Math.abs(this._lastPoints[i].y - rect.y) * dh;
    }

    this._path = new PathObject();
    this._path.setAll(commands);

    this.setAttr({
      d: this._path.toString()
    });
  }

  add(path: Path) {
    path.commands.forEach((command: PathCommand) => {
      this._path.add(command);
    });

    this.setAttr({
      d: this._path.toString()
    });
  }

  addCommand(command: PathCommand) {
    this._path.add(command);

    this.setAttr({
      d: this._path.toString()
    });
  }

  override toPath(): Path {
    return this;
  }


  getPoint(index: number): Point {
    return this._path.get(index).position;
  }

  pushPoint(point: Point): void {
    this._path.add(new LineTo(point));

    this.setAttr({
      d: this._path.toString()
    });
  }

  removePoint(index: number): void {
    this._path.remove(index);

    this.setAttr({
      d: this._path.toString()
    });
  }

  replacePoint(index: number, point: Point): void {
    this._path.replace(index, point);

    this.setAttr({
      d: this._path.toString()
    });
  }
}
