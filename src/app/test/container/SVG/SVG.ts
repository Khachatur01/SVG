import {ElementSVG} from "./element/ElementSVG";
import {DrawableSVG} from "../../service/element/draw/DrawableSVG";

export interface Position {
  x: number,
  y: number
}

export class SVG {
  private _container: HTMLElement;
  private _focusedElement: ElementSVG | null = null
  private _drawableElement: ElementSVG | null = null
  private _drawableSVG:DrawableSVG | null = null;

  /* drag */
  private _mouseStartX: number = 0;
  private _mouseStartY: number = 0;
  private _elementStartPos: Position = {x:0, y:0};
  private _onDragStart = this.onDragStart.bind(this);
  private _onDrag = this.onDrag.bind(this);
  private _onDragEnd = this.onDragEnd.bind(this);
  private _dragMode: boolean = false;

  /* draw */
  private _onDrawStart = this.onDrawStart.bind(this);
  private _onDraw = this.onDraw.bind(this);
  private _onDrawEnd = this.onDrawEnd.bind(this);
  private _perfectMode: boolean = false;

  /* keys */
  private _keyPressed = this.keyDown.bind(this);
  private _keyReleased = this.keyUp.bind(this);

  constructor(id: string) {
    let container = document.getElementById(id);
    if(!container)
      throw DOMException;

    this._container = container;

    document.addEventListener("mousedown", () => {

    });
    document.addEventListener("keydown", this._keyPressed);
    document.addEventListener("keyup", this._keyReleased);
  }

  public add(element: ElementSVG): void {
    if(!element) return;

    this._container.appendChild(element.SVG);
    element.SVG.addEventListener("mousedown", () => {
      this._focusedElement?.blur();
      this._focusedElement = element;
      this._focusedElement?.focus();
    });
    element.SVG.addEventListener("click", () => {
      this._focusedElement?.blur();
      this._focusedElement = element;
      this._focusedElement?.focus();
      this._drawableSVG?.disable();
    });

    element.SVG.addEventListener("mousemove", () => {
      if(this._dragMode) {
        element.SVG.style.cursor = "move";
      } else {
        element.SVG.style.cursor = "pointer";
      }
    });
  }
  public getBoundingClientRect(): DOMRect {
    return this._container.getBoundingClientRect();
  }

  private mouseInContainer(event: MouseEvent): boolean {
    let rect: DOMRect = this.getBoundingClientRect();
    let XInContainer =
      event.clientX > rect.x && event.clientX < rect.x + rect.width;
    let YInContainer =
      event.clientY > rect.y && event.clientY < rect.y + rect.height;

    return XInContainer && YInContainer;
  }

  private keyDown(event: KeyboardEvent) {
    if (event.shiftKey) {
      this._perfectMode = true;
    }
    if (event.ctrlKey) {
      this.dragOn();
      this.drawOff();
    }
  }
  private keyUp(event: KeyboardEvent) {
    if (event.key == "Shift") {
      this._perfectMode = false;
    }
    if (event.key == "Control") {
      this.dragOff();
    }
    if (event.key == "Delete") {
      this._focusedElement?.remove();
    }
    if (event.key == "Escape") {
      this.dragOff();
      this.drawOff();
      this._drawableSVG?.disable();
    }
  }

  /* draw */
  private onDrawStart(event:MouseEvent) {
    if(!this._drawableSVG) return;

    this._focusedElement?.blur();
    this._drawableElement = this._drawableSVG.onStart(this.getBoundingClientRect(), event);
    this.add(this._drawableElement);

    this._container.addEventListener('mousemove', this._onDraw);
  }
  private onDraw(event: MouseEvent) {
    if(this._drawableElement)
      this._drawableSVG?.onDraw(this.getBoundingClientRect(), event, this._drawableElement, this._perfectMode);
  }
  private onDrawEnd(event: MouseEvent) {
    this._container.removeEventListener('mousemove', this._onDraw);

    if(this._drawableElement) {
      this._drawableSVG?.onEnd(this.getBoundingClientRect(), event, this._drawableElement);
      this._focusedElement = this._drawableElement;
      this._focusedElement.focus();
    }

    if(!this.mouseInContainer(event)) {
      console.log("in container")
    } else {
      console.log("not in container")
    }

  }

  drawOn() {
    this._container.addEventListener('mousedown', this._onDrawStart);
    document.addEventListener('mouseup', this._onDrawEnd);
  }
  drawOff() {
    this._container.removeEventListener('mousemove', this._onDraw);
    this._container.removeEventListener('mousedown', this._onDrawStart);
    document.removeEventListener('mouseup', this._onDrawEnd);
  }
  set drawableSVG(drawableSVG: DrawableSVG) {
    this._drawableSVG = drawableSVG;
  }

  /* drag */
  onDragStart(event: MouseEvent) {

    this._mouseStartX = event.clientX;
    this._mouseStartY = event.clientY;
    this._elementStartPos = this._focusedElement?.position as Position;

    this._container.addEventListener("mousemove", this._onDrag);
  }
  onDrag(event: MouseEvent) {
    if(!this._focusedElement) return;

    let newX = this._elementStartPos.x + event.clientX - this._mouseStartX;
    let newY = this._elementStartPos.y + event.clientY - this._mouseStartY;
    this._focusedElement.position = {x: newX, y: newY} as Position;
  }
  onDragEnd(){
    this._container.removeEventListener("mousemove", this._onDrag);
  }

  dragOn() {
    this._dragMode = true;
    this._container.addEventListener("mousedown", this._onDragStart);
    document.addEventListener("mouseup", this._onDragEnd);
  }
  dragOff() {
    this._dragMode = false;
    this._container.removeEventListener("mousedown", this._onDragStart);
    this._container.removeEventListener("mousemove", this._onDrag);
    document.removeEventListener("mouseup", this._onDragEnd);
  }

}
