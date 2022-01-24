import {Element} from "../element/Element";

export class ElementsClipboard {
  private static xElements: Element[];

  static save(xElements: Element[]): void {
    ElementsClipboard.xElements = xElements;
  }

  static get(): Element[] {
    return ElementsClipboard.xElements;
  }

  static clear(): void {
    ElementsClipboard.xElements = [];
  }
}
