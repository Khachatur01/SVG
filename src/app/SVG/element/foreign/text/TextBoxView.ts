import {ForeignObjectView} from "../ForeignObjectView";
import {SVG} from "../../../SVG";
import {MoveDrawable} from "../../../service/tool/draw/type/MoveDrawable";
import {Rect} from "../../../model/Rect";
import {Callback} from "../../../dataSource/Callback";

export class TextBoxView extends ForeignObjectView {
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

  override addEditCallBack() {
    this._content?.addEventListener("input", () => {
      this.container.call(Callback.TEXT_TYPING,
        {text: (this._content as HTMLTextAreaElement).value}
      );
    });
  }

  override get copy(): TextBoxView {
    return super.copy as TextBoxView;
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width > 15 && size.height > 15;
  }
}
