import {ForeignObject} from "../ForeignObject";
import {SVG} from "../../../SVG";
import {MoveDrawable} from "../../../service/tool/draw/type/MoveDrawable";
import {Rect} from "../../../model/Rect";
import {Callback} from "../../../dataSource/Callback";

export class TextBox extends ForeignObject implements MoveDrawable {
  constructor(container: SVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container);
    let textarea = document.createElement("textarea");
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.resize = "none";
    textarea.style.border = "none";
    textarea.style.overflow = "hidden";
    this.setContent(textarea);

    this._container.addCallBack(Callback.EDIT_TOOl_OFF, () => {
      if (textarea.value == "")
        this._container.remove(this);
    });

    textarea.addEventListener('blur', () => {
      if (textarea.value == "") {
        this._container.remove(this);
        this._container.selectTool.on();
      }
    });
    this.style.setDefaultStyle();
  }

  override get copy(): TextBox {
    return super.copy as TextBox;
  }

  drawSize(rect: Rect): void {
    this.setSize(rect);
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width > 15 && size.height > 15;
  }
}
