import {Point} from "../../model/Point";
import {XBoundingBox} from "../edit/bound/XBoundingBox";

export interface XDraggable {
  get position(): Point;
  set position(position: Point);
  get boundingBox(): XBoundingBox | null;
  get SVG(): SVGElement;
}
