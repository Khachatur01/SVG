import {DrawTool} from "./service/tool/draw/DrawTool";
import {Element} from "./element/Element";
import {Focus} from "./service/edit/group/Focus";
import {SelectTool} from "./service/tool/select/SelectTool";
import {Tool} from "./service/tool/Tool";
import {EditTool} from "./service/tool/edit/EditTool";
import {DrawTools} from "./dataSource/DrawTools";
import {Grid} from "./service/grid/Grid";
import {Callback} from "./model/Callback";
import {Group} from "./element/group/Group";
import {Pointed} from "./element/shape/pointed/Pointed";
import {ElementsClipboard} from "./dataSource/ElementsClipboard";

class GlobalStyle {
  private _styleCallBacks: Map<Callback, Function[]> = new Map<Callback, Function[]>();
  private _globalStyle: any = {
    "fill": "none",
    "stroke": "#000000",
    "stroke-width": 5,
    "stroke-dasharray": ""
  };
  private _lastGlobalStyle: any = Object.assign({}, this._globalStyle);
  private container: SVG;
  constructor(container: SVG) {
    this.container = container;
  }
  set strokeWidth(width: string) {
    if(this.container.focused.children.size == 0) {
      this._globalStyle["stroke-width"] = width;
      this._lastGlobalStyle["stroke-width"] = width;
      return;
    }
    this._globalStyle["stroke-width"] = width;
    this.container.focused.children.forEach((child: Element) => {
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
    this.container.focused.children.forEach((child: Element) => {
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
    this.container.focused.children.forEach((child: Element) => {
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
  removeCallBack(name: Callback, callback: Function) {
    let functions = this._styleCallBacks.get(name);
    if(functions)
      functions.splice(functions.indexOf(callback), 1);
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

export class SVG {
  private readonly container: HTMLElement;
  private _focus: Focus = new Focus(this);
  private _elements: Set<Element> = new Set<Element>();
  private _callBacks: Map<Callback, Function[]> = new Map<Callback, Function[]>();

  public elementsGroup: SVGGElement;
  public readonly drawTool: DrawTool;
  public readonly selectTool: SelectTool;
  public readonly editTool: EditTool;
  public grid: Grid;
  public style: GlobalStyle = new GlobalStyle(this);

  public readonly drawTools: DrawTools = new DrawTools(this);
  public activeTool: Tool;

  private _multiSelect: boolean = false;

  constructor(containerId: string) {
    let container = document.getElementById(containerId);
    if(container)
      this.container = container;
    else
      throw new DOMException("Can't create container", "Container not found");

    this.drawTool = new DrawTool(this);
    this.selectTool = new SelectTool(this);
    this.editTool = new EditTool(this);
    this.activeTool = this.selectTool;
    this.grid = new Grid(this);
    this.style = new GlobalStyle(this);

    this.container.addEventListener("mousedown", event => {
      if(event.target == this.container) {
        this.blur();
        this.editTool.removeEditableElement();
      }
    });

    this.elementsGroup = document.createElementNS(Element.svgURI, "g");
    this.elementsGroup.id = "elements";
    this._focus.SVG.style.cursor = "move";

    this.container.appendChild(this.grid.group);
    this.container.appendChild(this.elementsGroup);
    this.container.appendChild(this._focus.SVG);
    this.container.appendChild(this.editTool.SVG);
  }

  get callBacks(): Map<Callback, Function[]> {
    return this._callBacks;
  }

  callCallBacks(name: Callback): void {
    let callback = this.callBacks.get(name);
    if(callback)
      callback.forEach((func: Function) => {
        func();
      });
  }
  addCallBack(name: Callback, callback: Function) {
    let functions = this._callBacks.get(name);
    if(!functions) {
      this._callBacks.set(name, []);
    }
    this._callBacks.get(name)?.push(callback)
  }
  removeCallBack(name: Callback, callback: Function) {
    let functions = this._callBacks.get(name);
    if(functions)
      functions.splice(functions.indexOf(callback), 1);
  }

  setElementActivity(element: Element) {
    if(element instanceof Group) return;
    element.SVG.addEventListener("mousedown", () => {
      if(!this.selectTool.isOn() && !this.editTool.isOn())
        return;

      this.editTool.removeEditableElement();

      if(this.editTool.isOn()) {
        if(element instanceof Pointed)
          this.editTool.editableElement = element;
      } else {
        if(element.group) /* if element has grouped, then select group */
          element = element.group;

        let hasChild = this._focus.hasChild(element);
        if(!this._multiSelect && hasChild) return;

        if(!this._multiSelect && !hasChild) {
          this.blur();
          this.focus(element);
        } else if(hasChild) {
          this.blur(element);
        } else {
          this.focus(element);
        }
      }
    });

    element.SVG.addEventListener("mousemove", () => {
      if(this.selectTool.isOn()) {
        element.SVG.style.cursor = "move";
      } else if(this.editTool.isOn()) {
        element.SVG.style.cursor = "crosshair";
      } else if(this.drawTool.isOn()) {
        element.SVG.style.cursor = "crosshair";
      }
    });
  }

  get elements(): Set<Element> {
    return this._elements;
  }
  add(xElement: Element) {
    if(!xElement) return;
    xElement.group = null;
    this.elementsGroup.appendChild(xElement.SVG);
    this._elements.add(xElement);
    this.setElementActivity(xElement);
  }

  remove(xElement: Element) {
    this._elements.delete(xElement);
    xElement.remove();
  }
  clear() {
    this._elements.clear();
    this.elementsGroup.innerHTML = "";
  }

  get HTML(): HTMLElement {
    return this.container;
  }

  focusAll() {
    this._elements.forEach((element: Element) => {
      this.focus(element);
    });
  }
  focus(xElement: Element) {
    this._focus.appendChild(xElement);
  }
  blur(xElement: Element | null = null) {
    if(xElement)
      this._focus.removeChild(xElement);
    else
      this._focus.clear();
  }

  get focused(): Focus {
    return this._focus;
  }

  multiSelect(): void {
    this._multiSelect = true;
  }
  singleSelect(): void {
    this._multiSelect = false;
  }

  copyFocused(): void {
    let elements: Element[] = [];
    for(let element of this._focus.children) {
      elements.push(element.copy);
    }

    ElementsClipboard.save(elements);
  }
  cutFocused(): void {
    this.copyFocused();
    this._focus.remove();
  }
  paste(): void {
    let elements: Element[] = ElementsClipboard.get();

    this.blur();
    elements.forEach((element: Element) => {
      element = element.copy;
      element.container = this;
      if(element instanceof Group)
        element.elements.forEach((child: Element) => {
          this.setElementActivity(child);
          child.container = this;
        });

      this.add(element);
      this.focus(element);
    });
  }
}
