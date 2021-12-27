import {XDrawTool} from "./service/tool/draw/XDrawTool";
import {XDragTool} from "./service/tool/drag/XDragTool";
import {XElement} from "./element/XElement";
import {XFocus} from "./service/edit/group/XFocus";
import {XSelectTool} from "./service/tool/select/XSelectTool";
import {XTool} from "./service/tool/XTool";

export class XSVG {
  private readonly container: HTMLElement;
  private _focusedElements: XFocus = new XFocus(this);
  private _elements: Set<XElement> = new Set<XElement>();
  public elementsGroup: SVGGElement;
  public readonly drawTool: XDrawTool;
  public readonly dragTool: XDragTool;
  public readonly selectTool: XSelectTool;
  public activeTool: XTool;

  private _multiSelect: boolean = false;

  constructor(containerId: string) {
    let container = document.getElementById(containerId);
    if(container)
      this.container = container;
    else
      throw DOMException;

    this.drawTool = new XDrawTool(this);
    this.dragTool = new XDragTool(this);
    this.selectTool = new XSelectTool(this);
    this.activeTool = this.selectTool;

    this.container.addEventListener("mousedown", event => {
      if(event.target == this.container) {
        this.blur();
      }
    });

    this.elementsGroup = document.createElementNS(XElement.svgURI, "g");
    this.elementsGroup.id = "elements";

    this.container.appendChild(this.elementsGroup);
    this.container.appendChild(this._focusedElements.SVG);
  }

  add(xElement: XElement) {
    if(!xElement) return;
    this.elementsGroup.appendChild(xElement.SVG);
    this._elements.add(xElement);

    xElement.SVG.addEventListener("mousedown", () => {
      if(this.drawTool.isDrawing()) return;
      this.drawTool.off();

      /* when tries to drag not selected element, all elements will blur, and that element will select */
      if(this.dragTool.isOn()) {
        if(!this._focusedElements.hasChild(xElement)) {
          this.blur();
          this.focus(xElement);
        }
        return;
      }

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
      if(this.dragTool.isOn() && this._focusedElements.hasChild(xElement)) {
        xElement.SVG.style.cursor = "move";
      } else {
        xElement.SVG.style.cursor = "pointer";
      }
    });
  }

  remove(xElement: XElement) {
    this._elements.delete(xElement);
    xElement.remove();
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

  get elements(): Set<XElement> {
    return this._elements;
  }
}
