import {MoveDraw} from "../../../mode/MoveDraw";
import {Element} from "../../../../../../element/Element";
import {Ellipse} from "../../../../../../element/shape/Ellipse";
import {Point} from "../../../../../../model/Point";

export class DrawEllipse extends MoveDraw {
  onStart(position: Point): Element {
    let element = new Ellipse(this.container, position.x, position.y);
    element.fixPosition();
    return element;
  }

}
