import {XRectangle} from "../../../element/shape/XRectangle";
import {Position} from "../../../../test/container/SVG/SVG";

export class XBoundingBox {
  private box: XRectangle;

  constructor(x: number, y: number, width: number, height: number) {
    this.box = new XRectangle(x, y, width, height)

    this.box.setAttr({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: "transparent",
      stroke: "#113CFC",
      strokeWidth: "1",
      "stroke-dasharray": "3 3"
    });
    this.box.SVG.style.pointerEvents = "none";
  }
  get position(): Position {
    let x: string | null = this.box.getAttr("x");
    let y: string | null = this.box.getAttr("y");
    if(!x || !y) {
      x = "0";
      y = "0";
    }
    return {
      x: parseInt(x),
      y: parseInt(y)
    }
  }
  set position(position: Position) {
    // let corners: CornerBox[] = this.cornerBoxes.all;
    // for(let i = 0; i < corners.length; i++) {
    //   corners[i].position = position;
    // }
    this.box.position = position;
  }
  remove() {
    this.box.SVG.parentElement?.removeChild(this.box.SVG);
  }
}
