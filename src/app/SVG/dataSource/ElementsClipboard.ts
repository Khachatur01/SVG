import {ElementView} from "../element/ElementView";

export class ElementsClipboard {
  private static xElements: ElementView[];

  static save(xElements: ElementView[]): void {
    ElementsClipboard.xElements = xElements;
  }

  static get(): ElementView[] {
    return ElementsClipboard.xElements;
  }

  static clear(): void {
    ElementsClipboard.xElements = [];
  }
}
