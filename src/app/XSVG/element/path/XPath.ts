import {XElement} from "../XElement";
import {Path} from "../../model/path/Path";
import {Point} from "../../model/Point";
import {Size} from "../../model/Size";

export abstract class XPath extends XElement {
  protected _size: Size = {width: 0, height: 0};
  protected path: Path;
  protected _lastPath: Path;
  protected constructor(path: Path = new Path()) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "path");
    this.path = path;
    this._lastPath = path;
    this.setAttr({
      d: this.path.toString()
    })
    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  override fixRect() {
    super.fixRect();
    this.fixPath();
  }
  fixPath() {
    this._lastPath = this.path.copy;
  }

  isComplete(): boolean {
    let size = this.size;
    return size.width != 0 && size.height != 0;
  }

  get points(): Point[] {
    return this.path.points;
  }

  get position(): Point {
    let commands = this.path.getAll();
    let leftTop: Point = Object.assign({}, commands[0].position);

    for(let i = 1; i < commands.length; i++) {
      if (commands[i].position.x < leftTop.x)
        leftTop.x = commands[i].position.x;
      if (commands[i].position.y < leftTop.y)
        leftTop.y = commands[i].position.y;
    }
    return leftTop;
  }
  set position(delta: Point) {
    let lastCommands = this._lastPath.getAll();
    let thisCommands = this.path.getAll();

    for(let i = 0; i < lastCommands.length; i++)
      thisCommands[i].position = {
        x: lastCommands[i].position.x + delta.x,
        y: lastCommands[i].position.y + delta.y
      }

    this.path.setAll(thisCommands);

    this.setAttr({
      d: this.path.toString()
    });
  }

  get size(): Size {
    let commands = this.path.getAll();
    /* get copy, not reference */
    let min = Object.assign({}, commands[0].position);
    let max = Object.assign({}, commands[0].position);

    for(let i = 1; i < commands.length; i++) {
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
  setSize(size: Size) {}
}
