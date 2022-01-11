import {XElement} from "../XElement";
import {Path} from "../../model/path/Path";
import {Point} from "../../model/Point";
import {Size} from "../../model/Size";
import {XSVG} from "../../XSVG";
import {Command} from "../../model/path/Command";
import {Close} from "../../model/path/close/Close";
import {XPointed} from "../type/XPointed";
import {MoveTo} from "../../model/path/point/MoveTo";
import {Rect} from "../../model/Rect";

export class XPath extends XPointed {
  protected _size: Size = {width: 0, height: 0};
  protected path: Path;
  protected _lastPath: Path;
  constructor(container: XSVG, path: Path = new Path()) {
    super(container);
    this.svgElement = document.createElementNS(XElement.svgURI, "path");
    this.path = path;
    this._lastPath = path;
    this.setAttr({
      d: this.path.toString()
    })
    this.setOverEvent();
    // this.style.setDefaultStyle();
  }

  override fixRect() {
    super.fixRect();
    this.fixPath();
    this._lastPoints = this._lastPath.points;
  }
  fixPath() {
    this._lastPath = this.path.copy;
  }

  isComplete(): boolean {
    let size = this.size;
    return size.width != 0 && size.height != 0;
  }

  get commands(): Command[] {
    return this.path.getAll();
  }

  override get points(): Point[] {
    return this.path.points;
  }

  override get position(): Point {
    let commands = this.path.getAll();
    let leftTop: Point = Object.assign({}, commands[0].position);

    for(let i = 1; i < commands.length; i++) {
      if(commands[i] instanceof Close) continue;

      if(commands[i].position.x < leftTop.x)
        leftTop.x = commands[i].position.x;
      if(commands[i].position.y < leftTop.y)
        leftTop.y = commands[i].position.y;
    }
    return leftTop;
  }
  override set position(delta: Point) {
    let lastCommands = this._lastPath.getAll();
    let thisCommands = this.path.getAll();

    for(let i = 0; i < lastCommands.length; i++) {
      thisCommands[i].position = {
        x: lastCommands[i].position.x + delta.x,
        y: lastCommands[i].position.y + delta.y
      }
    }

    this.path.setAll(thisCommands);

    this.setAttr({
      d: this.path.toString()
    });
  }

  override get size(): Size {
    let commands = this.path.getAll();
    /* get copy, not reference */
    let min = Object.assign({}, commands[0].position);
    let max = Object.assign({}, commands[0].position);

    for(let i = 1; i < commands.length; i++) {
      if(commands[i] instanceof Close) continue;

      if(commands[i].position.x < min.x)
        min.x = commands[i].position.x
      if(commands[i].position.y < min.y)
        min.y = commands[i].position.y

      if(commands[i].position.x > max.x)
        max.x = commands[i].position.x
      if(commands[i].position.y > max.y)
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

    if(this._lastSize.width != 0)
      dw = rect.width / this._lastSize.width;
    if(this._lastSize.height != 0)
      dh = rect.height / this._lastSize.height;


    let commands = this.commands;
    for(let i = 0; i < commands.length; i++) {
      /* points may not be fixed, and this._lastPoints[i] may be undefined */
      if(!this._lastPoints[i])
        this._lastPoints[i] = {x: 0, y: 0};

      commands[i].position.x = rect.x + Math.abs(this._lastPoints[i].x - rect.x) * dw;
      commands[i].position.y = rect.y + Math.abs(this._lastPoints[i].y - rect.y) * dh;
    }

    this.path = new Path();
    this.path.setAll(commands);

    this.setAttr({
      d: this.path.toString()
    });
  }

  add(path: XPath) {
    path.commands.forEach((command: Command) => {
      this.path.add(command);
    });

    this.setAttr({
      d: this.path.toString()
    });
  }
  addCommand(command: Command) {
    this.path.add(command);

    this.setAttr({
      d: this.path.toString()
    });
  }
  override toPath(): XPath {
    return this;
  }


  getPoint(index: number): Point {
    return this.path.get(index).position;
  }

  pushPoint(point: Point): void {
    this.path.add(new MoveTo(point));

    this.setAttr({
      d: this.path.toString()
    });
  }

  removePoint(index: number): void {
    this.path.remove(index);

    this.setAttr({
      d: this.path.toString()
    });
  }

  replacePoint(index: number, point: Point): void {
    this.path.replace(index, point);

    this.setAttr({
      d: this.path.toString()
    });
  }
}
