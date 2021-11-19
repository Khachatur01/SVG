import {Position} from "../../../SVG";
import {CornerBox, CornerBoxes} from "./CornerBox";
import {GroupSVG} from "../../group/GroupSVG";
import {RectangleSVG} from "../RectangleSVG";

export class BoundingBoxSVG {
  private boxGroup: GroupSVG;
  private readonly borderRect: RectangleSVG;
  private cornerBoxes: CornerBoxes;

  constructor(x: number, y: number, width: number, height: number) {
    this.borderRect = new RectangleSVG(x, y, width, height)

    this.borderRect.setAttr({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: "transparent",
      stroke: "#113CFC",
      strokeWidth: "1",
      "stroke-dasharray": "3 3"
    });
    this.borderRect.SVG.style.pointerEvents = "none";

    this.cornerBoxes = new CornerBoxes(x, y, width, height);

    this.boxGroup = new GroupSVG();
    this.boxGroup.appendChild(this.borderRect);

    for(let svgElement of this.cornerBoxes.all) {
      this.boxGroup.appendChild(svgElement.elementSVG);
    }
  }

  get SVG(): SVGGElement {
    return this.boxGroup.SVG;
  }

  get position(): Position {
    let x: string | null = this.SVG.getAttribute("x");
    let y: string | null = this.SVG.getAttribute("y");
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
    let corners: CornerBox[] = this.cornerBoxes.all;
    for(let i = 0; i < corners.length; i++) {
      corners[i].position = position;
    }
    this.borderRect.position = position;

  }
  remove() {
    this.SVG.parentElement?.removeChild(this.SVG);
  }

}
