import {MoveDraw} from "../../../mode/MoveDraw";
import {XElement} from "../../../../../../element/XElement";
import {XRectangle} from "../../../../../../element/shape/XRectangle";
import {Point} from "../../../../../../model/Point";

export class DrawRectangle extends MoveDraw {
  onStart(position: Point): XElement {
    return new XRectangle(this.container, position.x, position.y);
  }
}
