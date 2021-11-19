import {XSVG} from "../../XSVG";

export interface XDrawable {
  start(container: XSVG): void;
  stop(): void;
  set perfect(mode: boolean);
}
