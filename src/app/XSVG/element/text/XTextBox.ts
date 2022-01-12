import {XForeignObject} from "../foreign/XForeignObject";
import {XSVG} from "../../XSVG";
import {MoveDrawable} from "../../service/tool/draw/type/MoveDrawable";
import {Rect} from "../../model/Rect";

export class XTextBox extends XForeignObject implements MoveDrawable {
  constructor(container: XSVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container);
    let textarea = document.createElement("textarea");
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.resize = "none";
    textarea.style.border = "1px solid #999";
    textarea.style.background = "transparent";
    this.setContent(textarea);

    // this.style.fill = function () {};
  }

  drawSize(rect: Rect): void {
    this.setSize(rect);
  }
}
