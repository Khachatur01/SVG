import {SVG} from "../../../SVG";

export interface Drawable {
  start(container: SVG): void;
  stop(): void;
}
