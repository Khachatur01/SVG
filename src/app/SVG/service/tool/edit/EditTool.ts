import {Tool} from "../Tool";
import {SVG} from "../../../SVG";
import {Pointed} from "../../../element/shape/pointed/Pointed";
import {Element} from "../../../element/Element";
import {Point} from "../../../model/Point";
import {Node} from "./Node";
import {Callback} from "../../../dataSource/Callback";

export class EditTool extends Tool {
  private readonly nodesGroup: SVGGElement;
  private _isOn: boolean = false;
  private _editableElement: Pointed | null = null;

  constructor(container: SVG) {
    super(container);
    this.nodesGroup = document.createElementNS(Element.svgURI, "g");
    this.nodesGroup.id = "nodes";
  }

  set refPoint(refPoint: Point) {
    this.nodesGroup.style.transformOrigin = refPoint.x + "px " + refPoint.y + "px";
  }

  rotate(angle: number) {
    this.nodesGroup.style.transform = "rotate(" + angle + "deg)";
  }

  getContainer() {
    return this.container;
  }

  get SVG(): SVGGElement {
    return this.nodesGroup;
  }

  get editableElement(): Pointed | null {
    return this._editableElement;
  }

  set editableElement(editableElement: Pointed | null) {
    this._editableElement = editableElement;
    if (!editableElement) return;
    let order = 0;
    for (let point of editableElement.points) {
      let node: Node = new Node(this.container, this, point, order++);
      this.nodesGroup.appendChild(node.SVG);
    }
    this.refPoint = editableElement.refPoint;
    this.rotate(editableElement.angle);
  }

  removeEditableElement() {
    this._editableElement = null;
    this.nodesGroup.innerHTML = "";
  }

  _on(): void {
    this._isOn = true;
    for (let child of this.container.focused.children) {
      if (child instanceof Pointed) {
        this.editableElement = child;
        break;
      }
    }
    this.container.blur();
    this.container.HTML.style.cursor = "default";
    this.container.call(Callback.EDIT_TOOl_ON);
  }

  off(): void {
    this._isOn = false;
    this.removeEditableElement();

    this.container.call(Callback.EDIT_TOOl_OFF);
  }

  isOn(): boolean {
    return this._isOn;
  }

}
