import {XElement} from "../XElement";
import {Path} from "../../model/path/Path";
import {Point} from "../../model/Point";
import {Size} from "../../model/Size";

export class XPath extends XElement {
  protected _size: Size = {width: 0, height: 0};
  public path: Path;
  constructor(path: Path = new Path()) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "path");
    this.path = path;
    this.setAttr({
      d: this.path.toString()
    })
    this.setOverEvent();
    this.setDefaultStyle();
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width != 0 && size.height != 0;
  }

  get position(): Point {
    let commands = this.path.getAll();
    let leftTop: Point = commands[0].point;

    for(let i = 1; i < commands.length; i++) {
      if (commands[i].point.x < leftTop.x)
        leftTop.x = commands[i].point.x;
      if (commands[i].point.y < leftTop.y)
        leftTop.y = commands[i].point.y;
    }
    return leftTop;
  }
  set position(delta: Point) {

  }

  get size(): Size {
    let commands = this.path.getAll();
    /* get copy, not reference */
    let min = Object.assign({}, commands[0].point);
    let max = Object.assign({}, commands[0].point);

    for(let i = 1; i < commands.length; i++) {
      if(commands[i].point.x < min.x)
        min.x = commands[i].point.x
      if(commands[i].point.y < min.y)
        min.y = commands[i].point.y

      if(commands[i].point.x > max.x)
        max.x = commands[i].point.x
      if(commands[i].point.y > max.y)
        max.y = commands[i].point.y
    }

    this._size = {
      width: max.x - min.x,
      height: max.y - min.y
    };

    return this._size;
  }
  set size(size: Size) {

  }
}
