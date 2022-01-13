import {XForeignObject} from "../foreign/XForeignObject";
import {XSVG} from "../../XSVG";
import {MoveDrawable} from "../../service/tool/draw/type/MoveDrawable";
import {Rect} from "../../model/Rect";
import {Callback} from "../../model/Callback";

export class XTextBox extends XForeignObject implements MoveDrawable {
  constructor(container: XSVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container);
    let textarea = document.createElement("textarea");
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.resize = "none";
    textarea.style.border = "1px solid #999";
    textarea.style.background = "transparent";
    textarea.style.overflow = "hidden";
    textarea.style.lineHeight = container.grid.snapSide + 'px';
    this.setContent(textarea);

    this.container.addCallBack(Callback.EDIT_TOOl_OFF, () => {
      if (textarea.value == "")
        this.container.remove(this);
    });

    textarea.addEventListener("blur", (event) => {
      textarea.style.border = "none";
      if(textarea.value == "") {
        this.container.remove(this);
        this.container.selectTool.on();
      }
    });
  }

  drawSize(rect: Rect): void {
    this.setSize(rect);
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width > 15 && size.height > 15;
  }
}
