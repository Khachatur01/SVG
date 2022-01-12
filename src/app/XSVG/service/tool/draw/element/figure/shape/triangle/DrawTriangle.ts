import {XTriangle} from "../../../../../../../element/shape/triangle/XTriangle";
import {MoveDraw} from "../../../../mode/MoveDraw";
import {XElement} from "../../../../../../../element/XElement";
import {Point} from "../../../../../../../model/Point";

export class DrawTriangle extends MoveDraw {
  onStart(position: Point): XElement {
    return new XTriangle(this.container);
  }
}
