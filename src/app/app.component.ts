import {AfterViewInit, Component} from '@angular/core';
import {SVG} from "./SVG/SVG";
import {Rect} from "./SVG/model/Rect";
import {Callback} from './SVG/dataSource/Callback';
import {GraphicView} from "./SVG/element/foreign/graphic/GraphicView";
import {DemoAsset} from "./SVG/dataSource/DemoAsset";
import Picker from 'vanilla-picker';
import {ColorPicker} from "./SVG/colorPicker/ColorPicker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  title = 'svg-board';

  private svg: SVG | null = null;
  private activeTool: HTMLElement | null = null;

  select() {
    if (!this.svg) return;
    this.svg.selectTool.on();
  }
  edit() {
    if (!this.svg) return;
    this.svg.editTool.on();
  }
  grid() {
    if (!this.svg) return;
    if (this.svg.grid.isGrid()) {
      this.svg.grid.gridOff();
      this.makePassive('snap');
      this.makePassive('grid');
    } else {
      this.svg.grid.gridOn();
      this.makeActive('grid');
    }
  }
  snap() {
    if (!this.svg) return;
    if (this.svg.grid.isSnap()) {
      this.svg.grid.snapOff();
      this.makePassive('snap');
    } else {
      this.svg.grid.gridOn();
      this.svg.grid.snapOn();
      this.makeActive('grid');
      this.makeActive('snap');
    }
  }

  group() {
    if (!this.svg) return;
    this.svg.focused.group();
  }
  ungroup() {
    if (!this.svg) return;
    this.svg.focused.ungroup();
  }

  toPath() {
    if (!this.svg) return;
    this.svg.focused.toPath();
  }
  rectangle() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.rectangle;
    this.svg.drawTool.on();
    this.switchActive('rect');
  }
  ellipse() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.ellipse;
    this.svg.drawTool.on();
    this.switchActive('ellipse');
  }
  triangle() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.isoscelesTriangle;
    this.svg.drawTool.on();
    this.switchActive('triangle');
  }
  rightTriangle() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.rightTriangle;
    this.svg.drawTool.on();
    this.switchActive('right-triangle');
  }
  line() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.line;
    this.svg.drawTool.on();
    this.switchActive('line');
  }
  polyline() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.polyline;
    this.svg.drawTool.on();
    this.switchActive('polyline');
  }
  polygon() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.polygon;
    this.svg.drawTool.on();
    this.switchActive('polygon');
  }
  free() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.free;
    this.svg.drawTool.on();
    this.switchActive('free');
  }
  highlighter() {
    if (!this.svg) return;
    this.svg.highlightTool.on();
    this.switchActive('highlighter');
  }
  pointer() {
    if (!this.svg) return;
    this.svg.pointerTool.on();
    this.switchActive('pointer');
  }
  textBox() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.textBox;
    this.svg.drawTool.on();
    this.switchActive('text-box');
  }

  private keyDown(event: KeyboardEvent) {
    if (!this.svg) return;

    if (event.ctrlKey && event.key === "c") {
      this.copyFocused();
    }
    if (event.ctrlKey && event.key === "x") {
      this.cutFocused();
    }
    if (event.ctrlKey && event.key === "v") {
      this.paste();
    }
    if (event.ctrlKey && event.key === "a") {
      this.selectAll();
      event.preventDefault(); /* remove browser all selection */
    }

    if (event.shiftKey && event.key == "PageUp") {
      this.orderTop();
      event.preventDefault(); /* disable window scrolling */
    }
    if (event.shiftKey && event.key == "PageDown") {
      this.orderBottom();
      event.preventDefault(); /* disable window scrolling */
    }
    if (event.key == "ArrowLeft") {
      this.svg.focused.fixPosition();
      this.svg.focused.position = {x: -5, y: 0};
      if (!this.svg.editTool.isOn())
        event.preventDefault(); /* disable window scrolling */
    }
    if (event.key == "ArrowRight") {
      this.svg.focused.fixPosition();
      this.svg.focused.position = {x: +5, y: 0};
      if (!this.svg.editTool.isOn())
        event.preventDefault(); /* disable window scrolling */
    }
    if (event.key == "ArrowDown") {
      this.svg.focused.fixPosition();
      this.svg.focused.position = {x: 0, y: +5};
      if (!this.svg.editTool.isOn())
        event.preventDefault(); /* disable window scrolling */
    }
    if (event.key == "ArrowUp") {
      this.svg.focused.fixPosition();
      this.svg.focused.position = {x: 0, y: -5};
      if (!this.svg.editTool.isOn())
        event.preventDefault(); /* disable window scrolling */
    }

    if (event.key == "Shift") {
      this.svg.perfect = true;
    }
    if (event.key == "Escape") {
      this.svg.selectTool.on();
    }
    if (event.key == "Control") {
      this.svg.multiSelect();
    }
  }
  private keyUp(event: KeyboardEvent) {
    if (!this.svg) return;
    if (event.key == "Shift") {
      this.svg.perfect = false;
    }
    if (event.key == "Delete") {
      let active = document.activeElement;
      if (active instanceof HTMLInputElement && (active.type == "text" || active.type == "number")) return;
      this.svg.focused?.remove();
    }
    if (event.key == "Control") {
      this.svg.singleSelect();
    }
  }

  showCoordinates(containerId: string, labelId: string, mask: string) { /* x: {x} y: {y} ... replace {x} to x coordinate and {y} to y*/
    let container = document.getElementById(containerId);
    let label = document.getElementById(labelId);

    container?.addEventListener("mousemove", (event) => {
      if (!container) return;
      let containerRect: Rect = container.getBoundingClientRect();
      let text = mask
        .replace("{x}", (event.clientX - containerRect.x) + "")
        .replace("{y}", (event.clientY - containerRect.y) + "");

      if (label)
        label.innerHTML = text;
    });
  }

  switchActive(id: string) {
    if (this.activeTool)
      this.makePassive(this.activeTool.id);

    this.activeTool = document.getElementById(id);
    if (this.activeTool)
      this.makeActive(this.activeTool.id);
  }
  makeActive(id: string) {
    let element = document.getElementById(id);
    if (!element) return;
    element.classList.add("active")
  }
  makePassive(id: string) {
    let element = document.getElementById(id);
    if (!element) return;
    element.classList.remove("active")
  }

  /* callbacks */
  selectToolOnCallBack() {
    this.switchActive("select");
  }
  editToolOnCallBack() {
    this.switchActive("edit");
  }
  focusChangedCallBack() {
    if (this.svg?.focused.canGroup)
      document.getElementById("group")?.removeAttribute("disabled");
    else
      document.getElementById("group")?.setAttribute("disabled", "true");

    if (this.svg?.focused.canUngroup)
      document.getElementById("ungroup")?.removeAttribute("disabled");
    else
      document.getElementById("ungroup")?.setAttribute("disabled", "true");
  }
  bluredCallBack() {
    document.getElementById("group")?.setAttribute("disabled", "true");
    document.getElementById("ungroup")?.setAttribute("disabled", "true");
  }

  snapSideChangeCallBack(parameters: any) {
    // console.log(parameters.snapSide);
  }
  elementFocusedCallBack(parameters: any) {
    // console.log(parameters.element);
  }
  elementBluredCallBack(parameters: any) {
    // console.log(parameters.element);
  }
  drawClickCallBack(parameters: any) {
    // console.log(parameters.position);
  }
  drawMoveCallBack(parameters: any) {
    // console.log(parameters.position);
  }
  dragCallBack(parameters: any) {
    // console.log(parameters.delta); // translate
  }
  dragEndCallBack(parameters: any) {
    // console.log(parameters.delta); // drag
  }
  rotateCallBack(parameters: any) {
    // console.log(parameters.angle);
  }
  resizeCallBack(parameters: any) {
    // console.log(parameters.rect);
    // console.log(parameters.delta);
    // console.log();
  }
  textTypingCallBack(parameters: any) {
    // console.log(parameters.text);
  }
  assetEditCallBack(parameters: any) {
    // console.log(parameters.content);
  }
  refPointViewChangeCallBack(parameters: any) {
    // console.log(parameters.refPoint);
  }
  refPointChangeCallBack(parameters: any) {
    // console.log(parameters.refPoint);
  }
  nodeEditCallBack(parameters: any) {
    // console.log(parameters.position);
  }

  strokeWidthCallBack(parameters: any) {
    let stokeWidthInput = document.getElementById("stroke-width") as HTMLInputElement;
    if (!stokeWidthInput || !this.svg) return;
    stokeWidthInput.value = parameters.strokeWidth;
  }
  strokeColorCallBack(parameters: any) {
    let stokeColorInput = document.getElementById("stroke-color") as HTMLInputElement;
    if (!stokeColorInput || !this.svg) return;
    stokeColorInput.style.backgroundColor = parameters.strokeColor;
  }
  fillCallBack(parameters: any) {
    let fillInput = document.getElementById("fill-color") as HTMLInputElement;
    if (!fillInput || !this.svg) return;
    fillInput.style.backgroundColor = parameters.fillColor;
  }
  fontSizeCallBack(parameters: any) {
    let fontSizeInput = document.getElementById("font-size") as HTMLInputElement;
    if (!fontSizeInput || !this.svg) return;
    fontSizeInput.value = parameters.fontSize;
  }
  fontColorCallBack(parameters: any) {
    let fontColorInput = document.getElementById("font-color") as HTMLInputElement;
    if (!fontColorInput || !this.svg) return;
    fontColorInput.style.backgroundColor = parameters.fontColor;
  }
  fontBackgroundCallBack(parameters: any) {
    let backgroundColorInput = document.getElementById("font-background") as HTMLInputElement;
    if (!backgroundColorInput || !this.svg) return;
    backgroundColorInput.style.backgroundColor = parameters.backgroundColor;
  }
  /* callbacks */

  demoVideo() {
    if (!this.svg) return;

    this.svg.drawTools.video.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    this.svg.drawTool.tool = this.svg.drawTools.video;
    this.svg.drawTool.on();
    this.switchActive('video');
  }
  demoImage() {
    if (!this.svg) return;

    this.svg.drawTools.image.src = "/assets/test/img1.png";
    this.svg.drawTool.tool = this.svg.drawTools.image;
    this.svg.drawTool.on();
    this.switchActive('image');
  }
  demoAsset() {
    if (!this.svg) return;

    let htmlDiv = document.createElement("div");
    htmlDiv.innerHTML = DemoAsset.content;

    this.svg.drawTools.asset.content = htmlDiv;
    this.svg.drawTool.tool = this.svg.drawTools.asset;
    this.svg.drawTool.on();
    this.switchActive('asset');
  }
  demoGraphic() {
    if (!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.graphic;
    this.svg.drawTool.on();
  }

  gridSideChange(event: Event) {
    let gridSide = document.getElementById((event.target as Element).id) as HTMLInputElement;
    let side = gridSide?.value;
    if (this.svg && side)
      this.svg.grid.snapSide = parseInt(side);
  }
  strokeWidthChange(event: Event) {
    let picker = document.getElementById((event.target as Element).id) as HTMLInputElement;
    let width = picker?.value;
    if (this.svg && width)
      this.svg.style.strokeWidth = width;
  }
  fontSizeChange(event: Event) {
    let picker = document.getElementById((event.target as Element).id) as HTMLInputElement;
    let size = picker?.value;
    if (this.svg && size)
      this.svg.style.fontSize = size;
  }

  copyFocused() {
    if (!this.svg) return;
    this.svg.copyFocused();
  }
  cutFocused() {
    if (!this.svg) return;
    this.svg.cutFocused();
  }
  paste() {
    if (!this.svg) return;
    this.svg.paste();
  }
  selectAll() {
    if (!this.svg) return;
    this.svg.focusAll();
  }
  delete() {
    if (!this.svg) return;
    this.svg.focused.remove();
  }
  orderTop() {
    if (!this.svg) return;
    this.svg.focused.orderTop();
  }
  orderBottom() {
    if (!this.svg) return;
    this.svg.focused.orderBottom();
  }

  recenterRefPoint() {
    if (!this.svg) return;
    this.svg.focused.recenterRefPoint();
  }

  zoomIn() {
    if(!this.svg) return;
    let [first] = this.svg?.focused.children;
    if(first instanceof GraphicView)
      first.zoomIn();
  }
  zoomOut() {
    if(!this.svg) return;
    let [first] = this.svg?.focused.children;
    if(first instanceof GraphicView)
      first.zoomOut();
    }

  setColorPickers() {
    if (!this.svg) return;
    let strokeColorPicker = new ColorPicker(document.getElementById("stroke-color") as HTMLDivElement);
    strokeColorPicker.color = this.svg.style.strokeColor;
    strokeColorPicker.onChange = (color: string) => {
      if (!this.svg) return;
      this.svg.style.strokeColor = color;
    };
    let fillColorPicker = new ColorPicker(document.getElementById("fill-color") as HTMLDivElement);
    fillColorPicker.color = this.svg.style.fillColor;
    fillColorPicker.onChange = (color: string) => {
      if (!this.svg) return;
      this.svg.style.fillColor = color;
    };
    let fontColorPicker = new ColorPicker(document.getElementById("font-color") as HTMLDivElement);
    fontColorPicker.color = this.svg.style.fontColor;
    fontColorPicker.onChange = (color: string) => {
      if (!this.svg) return;
      this.svg.style.fontColor = color;
    };
    let backgroundColorPicker = new ColorPicker(document.getElementById("font-background") as HTMLDivElement);
    backgroundColorPicker.color = this.svg.style.backgroundColor;
    backgroundColorPicker.onChange = (color: string) => {
      if (!this.svg) return;
      this.svg.style.backgroundColor = color;
    };
  }

  ngAfterViewInit(): void {
    this.svg = new SVG("svgContainer");
    this.svg.addCallBack(Callback.SELECT_TOOl_ON, this.selectToolOnCallBack.bind(this));
    this.svg.addCallBack(Callback.EDIT_TOOl_ON, this.editToolOnCallBack.bind(this));
    this.svg.addCallBack(Callback.ELEMENT_FOCUSED, this.focusChangedCallBack.bind(this));
    this.svg.addCallBack(Callback.BLURED, this.bluredCallBack.bind(this));
    this.svg.addCallBack(Callback.SNAP_SIDE_CHANGE, this.snapSideChangeCallBack.bind(this));
    this.svg.addCallBack(Callback.ELEMENT_FOCUSED, this.elementFocusedCallBack.bind(this));
    this.svg.addCallBack(Callback.ELEMENT_BLURED, this.elementBluredCallBack.bind(this));
    this.svg.addCallBack(Callback.DRAW_CLICK, this.drawClickCallBack.bind(this));
    this.svg.addCallBack(Callback.DRAW_MOVE, this.drawMoveCallBack.bind(this));
    this.svg.addCallBack(Callback.DRAG, this.dragCallBack.bind(this));
    this.svg.addCallBack(Callback.DRAG_END, this.dragEndCallBack.bind(this));
    this.svg.addCallBack(Callback.ROTATE, this.rotateCallBack.bind(this));
    this.svg.addCallBack(Callback.RESIZE, this.resizeCallBack.bind(this));
    this.svg.addCallBack(Callback.TEXT_TYPING, this.textTypingCallBack.bind(this));
    this.svg.addCallBack(Callback.ASSET_EDIT, this.assetEditCallBack.bind(this));
    this.svg.addCallBack(Callback.REF_POINT_VIEW_CHANGE, this.refPointViewChangeCallBack.bind(this));
    this.svg.addCallBack(Callback.REF_POINT_CHANGE, this.refPointChangeCallBack.bind(this));
    this.svg.addCallBack(Callback.NODE_EDIT, this.nodeEditCallBack.bind(this));

    this.svg.style.addCallBack(Callback.STOKE_WIDTH_CHANGE, this.strokeWidthCallBack.bind(this));
    this.svg.style.addCallBack(Callback.STROKE_COLOR_CHANGE, this.strokeColorCallBack.bind(this));
    this.svg.style.addCallBack(Callback.FILL_COLOR_CHANGE, this.fillCallBack.bind(this));
    this.svg.style.addCallBack(Callback.FONT_SIZE_CHANGE, this.fontSizeCallBack.bind(this));
    this.svg.style.addCallBack(Callback.FONT_COLOR_CHANGE, this.fontColorCallBack.bind(this));
    this.svg.style.addCallBack(Callback.FONT_BACKGROUND_CHANGE, this.fontBackgroundCallBack.bind(this));

    this.select();
    this.setColorPickers();
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));

    this.showCoordinates("svgContainer", "coordinates", " x: {x} &emsp; y: {y}")
  }
}
