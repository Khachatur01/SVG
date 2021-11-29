import {Size} from "../../../model/Size";
import {Point} from "../../../model/Point";

export interface XResizeable {
  get position(): Point;
  set position(position: Point);
  get size(): Size;
  set size(size: Size);
}
