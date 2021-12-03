import {XSVG} from "../../../XSVG";

export class XResizeTool {
  private container: XSVG;
  private isDrag: boolean = false;

  private start = this.onStart.bind(this);
  private resize = this.onResize.bind(this);
  private end = this.onEnd.bind(this);

  constructor(container: XSVG) {
    this.container = container;
  }

  private onStart() {

  }
  private onResize() {

  }
  private onEnd() {

  }

  public on(): void {
    this.isDrag = true;
  }

  public off(): void {
    this.isDrag = false;
  }

  public isOn(): boolean {
    return this.isDrag;
  }

}
