import {XDrawTool} from "./service/tool/draw/XDrawTool";
import {XElement} from "./element/XElement";
import {XFocus} from "./service/edit/group/XFocus";
import {XSelectTool} from "./service/tool/select/XSelectTool";
import {XTool} from "./service/tool/XTool";
import {XEditTool} from "./service/tool/edit/XEditTool";
import {XPointed} from "./element/type/XPointed";
import {Tool} from "./dataSource/Tool";
import {XGrid} from "./service/grid/XGrid";
import {Callback} from "./model/Callback";

class GlobalStyle {
  private _styleCallBacks: Map<Callback, Function[]> = new Map<Callback, Function[]>();
  private _globalStyle: any = {
    "fill": "none",
    "stroke": "#000000",
    "stroke-width": 5,
    "stroke-dasharray": ""
  };
  private _lastGlobalStyle: any = Object.assign({}, this._globalStyle);
  private container: XSVG;
  constructor(container: XSVG) {
    this.container = container;
  }
  set strokeWidth(width: string) {
    if(this.container.focused.children.size == 0) {
      this._globalStyle["stroke-width"] = width;
      this._lastGlobalStyle["stroke-width"] = width;
      return;
    }
    this._globalStyle["stroke-width"] = width;
    this.container.focused.children.forEach((child: XElement) => {
      child.style.strokeWidth = width;
    });
  }
  set strokeColor(color: string) {
    if(this.container.focused.children.size == 0) {
      this._globalStyle["stroke"] = color;
      this._lastGlobalStyle["stroke"] = color;
      return;
    }
    this._globalStyle["stroke"] = color;
    this.container.focused.children.forEach((child: XElement) => {
      child.style.strokeColor = color;
    });
  }
  set fill(color: string) {
    if(this.container.focused.children.size == 0) {
      this._globalStyle["fill"] = color;
      this._lastGlobalStyle["fill"] = color;
      return;
    }
    this._globalStyle["fill"] = color;
    this.container.focused.children.forEach((child: XElement) => {
      child.style.fill = color;
    });
  }


  addCallBack(name: Callback, callback: Function) {
    let functions = this._styleCallBacks.get(name);
    if(!functions) {
      this._styleCallBacks.set(name, []);
    }
    this._styleCallBacks.get(name)?.push(callback)
  }

  recoverGlobalStyle() {
    this.setGlobalStyle(this._lastGlobalStyle);
    this.fixGlobalStyle();
  }
  fixGlobalStyle() {
    this._lastGlobalStyle = Object.assign({}, this._globalStyle);
  }
  get lastGlobalStyle(): any{
    return this._lastGlobalStyle;
  }
  setGlobalStyle(style: any) {
    this.fixGlobalStyle();
    this._globalStyle = Object.assign({}, style);
    this._styleCallBacks.forEach((callback) => callback.forEach((func: Function) => {
      func()
    }));
  }
  get globalStyle(): any {
    return this._globalStyle;
  }
}

export class XSVG {
  private readonly container: HTMLElement;
  private _focusedElements: XFocus = new XFocus(this);
  private _elements: Set<XElement> = new Set<XElement>();
  private _callBacks: Map<Callback, Function[]> = new Map<Callback, Function[]>();

  public elementsGroup: SVGGElement;
  public readonly drawTool: XDrawTool;
  public readonly selectTool: XSelectTool;
  public readonly editTool: XEditTool;
  public grid: XGrid;
  public style: GlobalStyle = new GlobalStyle(this);

  public readonly drawTools: Tool = new Tool(this);
  public activeTool: XTool;

  private _multiSelect: boolean = false;

  constructor(containerId: string) {
    let container = document.getElementById(containerId);
    if(container)
      this.container = container;
    else
      throw new DOMException("Can't create container", "Container not found");

    this.drawTool = new XDrawTool(this);
    this.selectTool = new XSelectTool(this);
    this.editTool = new XEditTool(this);
    this.activeTool = this.selectTool;
    this.grid = new XGrid(this);
    this.style = new GlobalStyle(this);

    this.container.addEventListener("mousedown", event => {
      if(event.target == this.container) {
        this.blur();
        this.editTool.removeEditableElement();
      }
    });

    this.elementsGroup = document.createElementNS(XElement.svgURI, "g");
    this.elementsGroup.id = "elements";
    this._focusedElements.SVG.style.cursor = "move";

    this.container.appendChild(this.grid.group);
    this.container.appendChild(this.elementsGroup);
    this.container.appendChild(this._focusedElements.SVG);
    this.container.appendChild(this.editTool.SVG);
  }

  get callBacks(): Map<Callback, Function[]> {
    return this._callBacks;
  }

  addCallBack(name: Callback, callback: Function) {
    let functions = this._callBacks.get(name);
    if(!functions) {
      this._callBacks.set(name, []);
    }
    this._callBacks.get(name)?.push(callback)
  }

  add(xElement: XElement) {
    if(!xElement) return;
    this.elementsGroup.appendChild(xElement.SVG);
    this._elements.add(xElement);

    xElement.SVG.addEventListener("mousedown", () => {
      if(!this.selectTool.isOn() && !this.editTool.isOn())
        return;

      this.editTool.removeEditableElement();
      if(this.editTool.isOn()) {
        if(xElement instanceof XPointed)
          this.editTool.editableElement = xElement;
      } else {
        let hasChild = this._focusedElements.hasChild(xElement);
        if(!this._multiSelect && hasChild) return;

        if(!this._multiSelect && !hasChild) {
          this.blur();
          this.focus(xElement);
        } else if(hasChild) {
          this.blur(xElement);
        } else {
          this.focus(xElement);
        }
      }
    });

    xElement.SVG.addEventListener("mousemove", () => {
      if(this.selectTool.isOn()) {
        xElement.SVG.style.cursor = "move";
      } else if(this.editTool.isOn()) {
        xElement.SVG.style.cursor = "crosshair";
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
