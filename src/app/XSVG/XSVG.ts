import {XDrawTool} from "./service/draw/XDrawTool";
import {XDragTool} from "./service/drag/XDragTool";
import {XElement} from "./element/XElement";
import {XGroup} from "./service/edit/group/XGroup";

export class XSVG {
  private readonly container: HTMLElement;
  private _focusedElements: XGroup = new XGroup(this);
  public readonly drawTool: XDrawTool;
  public readonly dragTool: XDragTool;

  constructor(containerId: string) {
    let container = document.getElementById(containerId);
    if(container)
      this.container = container;
    else
      throw DOMException;

    this.drawTool = new XDrawTool(this);
    this.dragTool = new XDragTool(this);

    this.container.addEventListener("mousedown", event => {
      if(event.target == this.container)
        this.blur();
    })

    this.container.appendChild(this._focusedElements.SVG);
  }

  add(element: XElement) {
    if(!element) return;
    this.container.appendChild(element.SVG);
    element.SVG.addEventListener("mousedown", () => {
      this.focus(element);
    });
    element.SVG.addEventListener("mousemove", () => {
      if(this.dragTool.isOn()) {
        element.SVG.style.cursor = "move";
      } else {
        element.SVG.style.cursor = "pointer";
      }
    });
  }

  remove(element: XElement) {
    element.remove();
  }

  get HTML(): HTMLElement {
    return this.container;
  }

  focus(element: XElement) {
    this._focusedElements.appendChild(element);
    this._focusedElements.focusStyle();
  }
  blur() {
    this._focusedElements.blurStyle();
    this._focusedElements.clear();
  }
  get focused(): XGroup {
    return this._focusedElements;
  }
}
