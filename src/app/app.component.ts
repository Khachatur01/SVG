import {AfterViewInit, Component} from '@angular/core';
import {XSVG} from "./XSVG/XSVG";
import {Tool} from "./XSVG/dataSource/Tool";
import {Rect} from "./XSVG/model/Rect";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  title = 'svg-board';

  private svg:XSVG | null = null;

  public select() {
    if(!this.svg) return;
    this.svg.selectTool.on();
    this.showToolName("select");
  }
  public edit() {
    if(!this.svg) return;
    this.svg.editTool.on();
    this.showToolName("edit");
  }
  public rectangle() {
    if(!this.svg) return;
    this.svg.drawTool.tool = Tool.rectangle
    this.svg.drawTool.on();
    this.showToolName("rectangle");
  }
  public ellipse() {
    if(!this.svg) return;
    this.svg.drawTool.tool = Tool.ellipse
    this.svg.drawTool.on();
    this.showToolName("ellipse");
  }
  public line() {
    if(!this.svg) return;
    this.svg.drawTool.tool = Tool.line
    this.svg.drawTool.on();
    this.showToolName("line");
  }
  public polyline() {
    if(!this.svg) return;
    this.svg.drawTool.tool = Tool.polyline
    this.svg.drawTool.on();
    this.showToolName("polyline");
  }
  public polygon() {
    if(!this.svg) return;
    this.svg.drawTool.tool = Tool.polygon
    this.svg.drawTool.on();
    this.showToolName("polygon");
  }
  public free() {
    if(!this.svg) return;
    this.svg.drawTool.tool = Tool.free
    this.svg.drawTool.on();
    this.showToolName("free");
  }


  private keyDown(event: KeyboardEvent) {
    if(!this.svg) return;
    if (event.key == "Shift") {
        this.svg.drawTool.perfect = true;
    }
    if (event.key == "Alt") {
      this.svg.dragTool.on();
      this.showToolName("drag");
    }
    if (event.key == "Escape") {
      this.svg.selectTool.on();
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
    if (event.key == "Alt") {
      this.svg.selectTool.on();
      this.showToolName("select");
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
  showToolName(name: string) {
    let label = document.getElementById("tool-name");
    if(label) label.innerText = name;
  }

  ngAfterViewInit(): void {
    this.svg = new XSVG("svgContainer");
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));

    this.showCoordinates("svgContainer", "coordinates", " x: {x} &emsp; y: {y}")
  }

}
