import {AfterViewInit, Component} from '@angular/core';
import {XSVG} from "./XSVG/XSVG";
import {Rect} from "./XSVG/model/Rect";
import {XImage} from "./XSVG/element/image/XImage";
import {XForeignObject} from "./XSVG/element/foreign/XForeignObject";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  title = 'svg-board';

  private svg:XSVG | null = null;

  private activeElement: HTMLElement | null = null;

  public select() {
    if(!this.svg) return;
    this.svg.selectTool.on();
    this.switchActive('select');
  }
  public edit() {
    if(!this.svg) return;
    this.svg.editTool.on();
    this.switchActive('edit');
  }
  public grid() {
    if(!this.svg) return;
    if(this.svg.grid.isGrid()) {
      this.svg.grid.gridOff();
      this.makePassive('snap');
      this.makePassive('grid');
    } else {
      this.svg.grid.gridOn(20, 1, "#777");
      this.makeActive('grid');
    }
  }
  public snap() {
    if(!this.svg) return;
    if(this.svg.grid.isSnap()) {
      this.svg.grid.snapOff();
      this.makePassive('snap');
    } else if(this.svg.grid.isGrid()) {
      this.svg.grid.snapOn();
      this.makeActive('snap');
    }
  }
  public toPath() {
    if(!this.svg) return;
    this.svg.focused.toPath();
  }

  public rectangle() {
    if(!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.rectangle;
    this.svg.drawTool.on();
    this.switchActive('rect');
  }
  public ellipse() {
    if(!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.ellipse;
    this.svg.drawTool.on();
    this.switchActive('ellipse');
  }
  public line() {
    if(!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.line;
    this.svg.drawTool.on();
    this.switchActive('line');
  }
  public polyline() {
    if(!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.polyline;
    this.svg.drawTool.on();
    this.switchActive('polyline');
  }
  public polygon() {
    if(!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.polygon;
    this.svg.drawTool.on();
    this.switchActive('polygon');
  }
  public free() {
    if(!this.svg) return;
    this.svg.drawTool.tool = this.svg.drawTools.free;
    this.svg.drawTool.on();
    this.switchActive('free');
  }


  private keyDown(event: KeyboardEvent) {
    if(!this.svg) return;
    if (event.key == "Shift") {
        this.svg.drawTool.perfect = true;
    }
    if (event.key == "Escape") {
      this.svg.drawTool.off();
      this.svg.drawTool.on();
    }
    if (event.key == "Control") {
      this.svg.multiSelect();
    }
  }
  private keyUp(event: KeyboardEvent) {
    if(!this.svg) return;
    if (event.key == "Shift") {
        this.svg.drawTool.perfect = false;
    }
    if (event.key == "Delete") {
      this.svg.focused?.remove();
    }
    if (event.key == "Control") {
      this.svg.singleSelect();
    }
  }

  showCoordinates(containerId: string, labelId: string, mask: string) { /* x: {x} y: {y} ... replace {x} to x coordinate and {y} to y*/
    let container = document.getElementById(containerId);
    let label = document.getElementById(labelId);
    if(!container) return;

    let containerRect: Rect = container.getBoundingClientRect();

    container.addEventListener("mousemove", (event) => {
      let text = mask
          .replace("{x}", (event.clientX - containerRect.x + window.scrollX) + "")
          .replace("{y}", (event.clientY - containerRect.y + window.scrollY) + "");

      if(label)
        label.innerHTML = text;
    });
  }

  switchActive(id: string) {
    if(this.activeElement)
      this.makePassive(this.activeElement.id);

    this.activeElement = document.getElementById(id);
    if(this.activeElement)
      this.makeActive(this.activeElement.id);
  }
  makeActive(id: string) {
    let element = document.getElementById(id);
    if(!element) return;
    element.classList.add("active")
  }
  makePassive(id: string) {
    let element = document.getElementById(id);
    if(!element) return;
    element.classList.remove("active")
  }

  ngAfterViewInit(): void {
    this.svg = new XSVG("svgContainer");
    this.select();
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));

    this.showCoordinates("svgContainer", "coordinates", " x: {x} &emsp; y: {y}")
  }

  transparentStroke() {
    if(this.svg)
      this.svg.focused.style.strokeColor = "none";
  }
  transparentFill() {
    if(this.svg)
      this.svg.focused.style.fill = "none";
  }

  strokeWidth(event: Event) {
    let picker = document.getElementById((event.target as Element).id) as HTMLInputElement;
    let width = picker?.value;
    if(this.svg && width)
      this.svg.focused.style.strokeWidth = width;
  }

  strokeColorChange(event: Event) {
    let picker = document.getElementById((event.target as Element).id) as HTMLInputElement;
    let color = picker?.value;
    if(this.svg && color)
      this.svg.focused.style.strokeColor = color;
  }
  fillColorChange(event: Event) {
    let picker = document.getElementById((event.target as Element).id) as HTMLInputElement;
    let color = picker?.value;
    if(this.svg && color)
      this.svg.focused.style.fill = color;
  }

  selectImage(event: Event) {
    if(!this.svg) return;

    let image = new XImage(this.svg, 0, 0, 200, 200);
    image.refPoint = {x: 100, y: 100};
    image.setImage("https://absolutearmenia.com/wp-content/uploads/2021/01/Yerevan-Armenia-from-Cascades.jpg")

    this.svg?.add(image);
  }
  selectHTML(event: Event) {
    if(!this.svg) return;

    let element = new XForeignObject(this.svg, 0, 0, 200, 200);
    element.refPoint = {x: 100, y: 100};
    element.setContent(
      "<div><h1>DIV CONTENT</h1></div>"
    );

    this.svg.add(element);
  }

}
