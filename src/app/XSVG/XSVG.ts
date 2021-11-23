import {XDrawTool} from "./service/draw/XDrawTool";
import {XDragTool} from "./service/drag/XDragTool";
import {XElement} from "./element/XElement";

export class XSVG {
  private readonly container: HTMLElement;
  private _focusedElement: XElement | null = null;
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
  }

  add(element: XElement) {
    if(!element) return;
    this.container.appendChild(element.group);
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
    this.blur();
    this._focusedElement = element;
    this._focusedElement.focusStyle();
  }
  blur() {
    this._focusedElement?.blurStyle();
    this._focusedElement = null;
  }
  get focused(): XElement | null {
    return this._focusedElement;
  }
}
