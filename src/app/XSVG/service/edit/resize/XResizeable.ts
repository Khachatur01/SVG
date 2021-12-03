import {Size} from "../../../model/Size";
import {Rect} from "../../../model/Rect";

export interface XResizeable {
  get lastRect(): Rect;
  get size(): Size;
  set size(size: Size);
}
