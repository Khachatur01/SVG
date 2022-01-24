import {DrawTool} from "./service/tool/draw/DrawTool";
import {Element} from "./element/Element";
import {Focus} from "./service/edit/group/Focus";
import {SelectTool} from "./service/tool/select/SelectTool";
import {Tool} from "./service/tool/Tool";
import {EditTool} from "./service/tool/edit/EditTool";
import {DrawTools} from "./dataSource/DrawTools";
import {Grid} from "./service/grid/Grid";
import {Callback} from "./dataSource/Callback";
import {Group} from "./element/group/Group";
import {Pointed} from "./element/shape/pointed/Pointed";
import {ElementsClipboard} from "./dataSource/ElementsClipboard";
import {Style} from "./service/style/Style";
import {HighlightTool} from "./service/tool/highlighter/HighlightTool";

class GlobalStyle extends Style {
  private readonly default: Style;
  private container: SVG;

  constructor(container: SVG) {
    super();
    this.container = container;
    this.default = new Style();
  }

  override get strokeWidth(): string {
    return super.strokeWidth;
  }
  override set strokeWidth(width: string) {
    super.strokeWidth = width;
    if(this.container.focused.children.size == 0) {
      this.default.strokeWidth = width;
      return;
    }
    this.container.focused.children.forEach((child: Element) => {
      child.style.strokeWidth = width;
    });
  }

  override get strokeDashArray(): string {
    return super.strokeDashArray;
  }
  override set strokeDashArray(array: string) {
    super.strokeDashArray = array;
    if(this.container.focused.children.size == 0) {
      this.default.strokeDashArray = array;
      return;
    }
    this.container.focused.children.forEach((child: Element) => {
      child.style.strokeDashArray = array;
    });
  }

  override get strokeColor(): string {
    return super.strokeColor;
  }
  override set strokeColor(color: string) {
    super.strokeColor = color;
    if(this.container.focused.children.size == 0) {
      this.default.strokeColor = color;
      return;
    }
    this.container.focused.children.forEach((child: Element) => {
      child.style.strokeColor = color;
    });
  }

  override get fillColor(): string {
    return super.fillColor;
  }
  override set fillColor(color: string) {
    super.fillColor = color;
    if(this.container.focused.children.size == 0) {
      this.default.fillColor = color;
      return;
    }
    this.container.focused.children.forEach((child: Element) => {
      child.style.fillColor = color;
    });
  }

  override get fontSize(): string {
    return super.fontSize;
  }
  override set fontSize(size: string) {
    super.fontSize = size;
    if(this.container.focused.children.size == 0) {
      this.default.fontSize = size;
      return;
    }
    this.container.focused.children.forEach((child: Element) => {
      child.style.fontSize = size;
    });
  }

  override get fontColor(): string {
    return super.fontColor;
  }
  override set fontColor(color: string) {
    super.fontColor = color;
    if(this.container.focused.children.size == 0) {
      this.default.fontColor = color;
      return;
    }
    this.container.focused.children.forEach((child: Element) => {
      child.style.fontColor = color;
    });
  }

  override get backgroundColor(): string {
    return super.backgroundColor;
  }
  override set backgroundColor(color: string) {
    super.backgroundColor = color;
    if(this.container.focused.children.size == 0) {
      this.default.backgroundColor = color;
      return;
    }
    this.container.focused.children.forEach((child: Element) => {
      child.style.backgroundColor = color;
    });
  }

  recoverGlobalStyle() {
    this.setGlobalStyle(this.default);
  }
  fixGlobalStyle() {
    this.default.strokeWidth = this.strokeWidth;
    this.default.strokeColor = this.strokeColor;
    this.default.fillColor =  this.fillColor;
    this.default.fontSize =  this.fontSize;
    this.default.fontColor =  this.fontColor;
    this.default.backgroundColor =  this.backgroundColor;
  }
  setGlobalStyle(style: Style) {
    super.strokeWidth = style.strokeWidth;
    super.strokeColor = style.strokeColor;
    super.fillColor = style.fillColor;
    super.fontSize = style.fontSize;
    super.fontColor = style.fontColor;
    super.backgroundColor = style.backgroundColor;

    this._styleCallBacks.get(Callback.STOKE_WIDTH_CHANGE)?.forEach((callBack: Function) => {
      callBack(style.strokeWidth);
    });
    this._styleCallBacks.get(Callback.STROKE_COLOR_CHANGE)?.forEach((callBack: Function) => {
      callBack(style.strokeColor);
    });
    this._styleCallBacks.get(Callback.FILL_COLOR_CHANGE)?.forEach((callBack: Function) => {
      callBack(style.fillColor);
    });
    this._styleCallBacks.get(Callback.FONT_SIZE_CHANGE)?.forEach((callBack: Function) => {
      callBack(style.fontSize);
    });
    this._styleCallBacks.get(Callback.FONT_COLOR_CHANGE)?.forEach((callBack: Function) => {
      callBack(style.fontColor);
    });
    this._styleCallBacks.get(Callback.FONT_BACKGROUND_CHANGE)?.forEach((callBack: Function) => {
      callBack(style.backgroundColor);
    });
  }
}

export class SVG {
  private readonly container: HTMLElement;
  private _focus: Focus = new Focus(this);
  private _elements: Set<Element> = new Set<Element>();
  private _callBacks: Map<Callback, Function[]> = new Map<Callback, Function[]>();

  public elementsGroup: SVGGElement;
  public readonly drawTool: DrawTool;
  public readonly highlightTool: HighlightTool;
  public readonly selectTool: SelectTool;
  public readonly editTool: EditTool;
  public perfect: boolean = false;
  public grid: Grid;
  public style: GlobalStyle = new GlobalStyle(this);

  public readonly drawTools: DrawTools = new DrawTools(this);
  public activeTool: Tool;

  private _multiSelect: boolean = false;

  private static idPrefix: string;
  private static id: number = 0;

  constructor(containerId: string, idPrefix: string = "element") {
    let container = document.getElementById(containerId);
    if(container)
      this.container = container;
    else
      throw new DOMException("Can't create container", "Container not found");

    SVG.idPrefix = idPrefix;

    this.drawTool = new DrawTool(this);
    this.highlightTool = new HighlightTool(this);
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
    this.container.appendChild(this.editTool.SVG);
    this.container.appendChild(this.highlightTool.SVG);
    this.container.appendChild(this._focus.SVG);
  }

  get id(): number {
    return SVG.id;
  }
  set id(id: number) {
    SVG.id = id;
  }
  get nextId(): string {
    return SVG.idPrefix + SVG.id++;
  }

  call(name: Callback): void {
    let callback = this._callBacks.get(name);
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
      } else if(this.highlightTool.isOn()) {
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
    this.selectTool.on();
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
