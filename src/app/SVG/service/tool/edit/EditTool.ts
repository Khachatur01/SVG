import {Tool} from "../Tool";
import {SVG} from "../../../SVG";
import {PointedView} from "../../../element/shape/pointed/PointedView";
import {ElementView} from "../../../element/ElementView";
import {Point} from "../../../model/Point";
import {Node} from "./Node";
import {Callback} from "../../../dataSource/Callback";

export class EditTool extends Tool {
  private readonly nodesGroup: SVGGElement;
  private _isOn: boolean = false;
  private _editableElement: PointedView | null = null;

  constructor(container: SVG) {
    super(container);
    this.nodesGroup = document.createElementNS(ElementView.svgURI, "g");
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

  get editableElement(): PointedView | null {
    return this._editableElement;
  }

  set editableElement(editableElement: PointedView | null) {
    if (!editableElement) return;
    this.container.focus(editableElement, false);
    this._editableElement = editableElement;
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
      if (child instanceof PointedView) {
        this.editableElement = child;
        break;
      }
    }
    this.container.blur();
    if(this._editableElement)
      this.container.focus(this._editableElement, false);

    this.container.HTML.style.cursor = "default";
    this.container.call(Callback.EDIT_TOOl_ON);
  }

  off(): void {
    this._isOn = false;
    this.removeEditableElement();
    this.container.blur();
    this.container.call(Callback.EDIT_TOOl_OFF);
  }

  isOn(): boolean {
    return this._isOn;
  }

}
