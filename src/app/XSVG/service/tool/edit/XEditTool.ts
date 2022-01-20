import {XTool} from "../XTool";
import {XSVG} from "../../../XSVG";
import {XPointed} from "../../../element/shape/pointed/XPointed";
import {XElement} from "../../../element/XElement";
import {Point} from "../../../model/Point";
import {XNode} from "./XNode";
import {Callback} from "../../../model/Callback";

export class XEditTool extends XTool {
  private readonly nodesGroup: SVGGElement;
  private _isOn: boolean = false;
  private _editableElement: XPointed | null = null;

  constructor(container: XSVG) {
    super(container);
    this.nodesGroup = document.createElementNS(XElement.svgURI, "g");
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

  get editableElement(): XPointed | null {
    return this._editableElement;
  }
  set editableElement(editableElement: XPointed | null) {
    this._editableElement = editableElement;
    if(!editableElement) return;
    let order = 0;
    for(let point of editableElement.points) {
      let node: XNode = new XNode(this.container, this, point, order++);
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
    for(let child of this.container.focused.children) {
      if(child instanceof XPointed) {
        this.editableElement = child;
        break;
      }
    }
    this.container.blur();

    this.container.callCallBacks(Callback.EDIT_TOOl_ON);
  }

  off(): void {
    this._isOn = false;
    this.removeEditableElement();

    this.container.callCallBacks(Callback.EDIT_TOOl_OFF);
  }

  isOn(): boolean {
    return this._isOn;
  }

}
