import {XDrawTool} from "./service/draw/XDrawTool";
import {XDragTool} from "./service/drag/XDragTool";
import {XElement} from "./element/XElement";
import {XFocus} from "./service/edit/group/XFocus";

export class XSVG {
  private readonly container: HTMLElement;
  private _focusedElements: XFocus = new XFocus(this);
  public readonly drawTool: XDrawTool;
  public readonly dragTool: XDragTool;

  private _multiSelect: boolean = false;

  constructor(containerId: string) {
    let container = document.getElementById(containerId);
    if(container)
      this.container = container;
    else
      throw DOMException;

    this.drawTool = new XDrawTool(this);
    this.dragTool = new XDragTool(this);

    this.container.addEventListener("mousedown", event => {
      if(event.target == this.container) {
        this.blur();
      }
    })

    this.container.appendChild(this._focusedElements.SVG);
  }

  add(xElement: XElement) {
    if(!xElement) return;
    this.container.appendChild(xElement.SVG);
    xElement.SVG.addEventListener("mousedown", () => {
      if(this.drawTool.isDrawing() || this.dragTool.isOn()) return;

      if(!this._multiSelect) {
        this.blur();
        this.focus(xElement);
      } else if(this._focusedElements.hasChild(xElement)) {
        this.blur(xElement);
      } else {
        this.focus(xElement);
      }

    });

    xElement.SVG.addEventListener("mousemove", () => {
      if(this.dragTool.isOn()) {
        xElement.SVG.style.cursor = "move";
      } else {
        xElement.SVG.style.cursor = "pointer";
      }
    });
  }

  remove(element: XElement) {
    element.remove();
  }

  get HTML(): HTMLElement {
    return this.container;
  }

  focus(xElement: XElement) {
    this._focusedElements.appendChild(xElement);
  }
  blur(xElement: XElement | null = null) {
    if(xElement)
      this._focusedElements.removeChild(xElement);
    else
      this._focusedElements.clear();
  }

  get focused(): XFocus {
    return this._focusedElements;
  }

  multiSelect(): void {
    this._multiSelect = true;
  }
  singleSelect(): void {
    this._multiSelect = false;
  }
}
