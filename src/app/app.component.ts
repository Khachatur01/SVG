import {AfterViewInit, Component} from '@angular/core';
import {XSVG} from "./XSVG/XSVG";
import {Tool} from "./XSVG/dataSource/Tool";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  title = 'svg-board';

  private svg:XSVG | null = null;

  public rectangle() {
    this.svg?.drawTool.draw(Tool.rectangle);
  }
  public ellipse() {
    this.svg?.drawTool.draw(Tool.ellipse);
  }
  public line() {
    this.svg?.drawTool.draw(Tool.line);
  }
  public polyline() {
    this.svg?.drawTool.draw(Tool.polyline);
  }
  public polygon() {
    this.svg?.drawTool.draw(Tool.polygon);
  }
  public free() {
    this.svg?.drawTool.draw(Tool.free);
  }


  private keyDown(event: KeyboardEvent) {
    if (event.key == "Shift") {
      if(this.svg?.drawTool)
        this.svg.drawTool.perfect = true;
    }
    if (event.key == "Alt") {
      this.svg?.drawTool.pause();
      this.svg?.dragTool.on();
    }
    if (event.key == "Enter") {
      this.svg?.drawTool.pause();
    }
    if (event.key == "Escape") {
      this.svg?.drawTool.pause();
    }
    if (event.key == "Control") {
      this.svg?.multiSelect();
      this.svg?.drawTool.pause();
    }
  }
  private keyUp(event: KeyboardEvent) {
    if (event.key == "Shift") {
      if(this.svg?.drawTool)
        this.svg.drawTool.perfect = false;
    }
    if (event.key == "Alt") {
      this.svg?.dragTool.off();
      this.svg?.drawTool.resume();
    }
    if (event.key == "Delete") {
      this.svg?.focused?.remove();
    }
    if (event.key == "Enter") {
      this.svg?.drawTool.resume();
    }
    if (event.key == "Control") {
      this.svg?.singleSelect();
      this.svg?.drawTool.resume();
    }
  }

  ngAfterViewInit(): void {
    this.svg = new XSVG("svgContainer");
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
  }

}
