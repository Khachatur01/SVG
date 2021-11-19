import {ElementSVG} from "../../../container/SVG/element/ElementSVG";

export interface DrawableSVG {
  onStart(containerRect: DOMRect, event: MouseEvent): ElementSVG;
  onDraw(containerRect: DOMRect, event: MouseEvent, elementSVG: ElementSVG, perfectMode: boolean): void;
  onEnd(containerRect?: DOMRect, event?: MouseEvent, elementSVG?: ElementSVG): boolean;
  disable(): void;
}
