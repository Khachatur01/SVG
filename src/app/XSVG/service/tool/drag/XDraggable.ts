import {Point} from "../../../model/Point";

export interface XDraggable {
  get position(): Point;
  set position(position: Point);
  get SVG(): SVGElement;
  fixRect(): void;
  fixPosition(): void;
}
