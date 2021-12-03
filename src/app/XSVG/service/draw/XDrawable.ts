import {XSVG} from "../../XSVG";
import {XElement} from "../../element/XElement";

export interface XDrawable {
  start(container: XSVG): void;
  stop(): void;
  set perfect(mode: boolean);
}
