import {PathView} from "../PathView";

export class FreeView extends PathView {
  override get copy(): FreeView {
    return super.copy as FreeView;
  }
}
