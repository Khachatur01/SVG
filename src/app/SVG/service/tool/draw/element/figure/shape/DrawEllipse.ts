import {MoveDraw} from "../../../mode/MoveDraw";
import {ElementView} from "../../../../../../element/ElementView";
import {EllipseView} from "../../../../../../element/shape/EllipseView";
import {Point} from "../../../../../../model/Point";

export class DrawEllipse extends MoveDraw {
  onStart(position: Point): ElementView {
    let element = new EllipseView(this.container, position.x, position.y);
    element.fixPosition();
    return element;
  }

}
