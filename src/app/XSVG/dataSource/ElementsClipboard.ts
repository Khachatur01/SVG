import {XElement} from "../element/XElement";

export class ElementsClipboard {
  private static xElements: XElement[];

  static save(xElements: XElement[]): void {
    ElementsClipboard.xElements = xElements;
  }
  static get(): XElement[] {
    return ElementsClipboard.xElements;
  }
  static clear(): void {
    ElementsClipboard.xElements = [];
  }
}
