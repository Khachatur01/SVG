import {MoveDraw} from "../../../mode/MoveDraw";
import {XElement} from "../../../../../../element/XElement";
import {XEllipse} from "../../../../../../element/shape/XEllipse";
import {Point} from "../../../../../../model/Point";

export class DrawEllipse extends MoveDraw {
  onStart(position: Point): XElement {
    let element = new XEllipse(this.container, position.x, position.y);
    element.fixPosition();
    return element;
  }

}
