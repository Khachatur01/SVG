import {SVG} from "../../../SVG";

export interface Drawable {
  _new(): Drawable;
  start(container: SVG): void;
  stop(): void;
}
