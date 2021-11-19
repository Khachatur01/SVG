import {RectangleSVG} from "../RectangleSVG";
import {ElementSVG} from "../../ElementSVG";
import {Position} from "../../../SVG";

class BoundingCorner {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public cornerSize = 5;
  public cornerMargin = this.cornerSize - 2;
}

export abstract class CornerBox {
  abstract set position(position: Position);
  abstract get elementSVG(): ElementSVG;
}

class LTCornerBox extends CornerBox {
  private readonly rect: RectangleSVG;
  private boundingCorner: BoundingCorner;
  constructor(boundingCorner: BoundingCorner) {
    super();
    this.boundingCorner = boundingCorner;
    this.rect = new RectangleSVG(
      boundingCorner.x - boundingCorner.cornerMargin,
      boundingCorner.y - boundingCorner.cornerMargin,
      boundingCorner.cornerSize,
      boundingCorner.cornerSize
    );
  }
  get elementSVG(): RectangleSVG {
    return this.rect;
  }
  set position(position: Position) {
    this.rect.position = {
      x: position.x - this.boundingCorner.cornerMargin,
      y: position.y - this.boundingCorner.cornerMargin
    }
  }
}

class RTCornerBox extends CornerBox {
  private readonly rect: RectangleSVG;
  private boundingCorner: BoundingCorner;
  constructor(boundingCorner: BoundingCorner) {
    super();
    this.boundingCorner = boundingCorner;
    this.rect = new RectangleSVG(
      boundingCorner.x + boundingCorner.width - boundingCorner.cornerMargin,
      boundingCorner.y - boundingCorner.cornerMargin,
      boundingCorner.cornerSize,
      boundingCorner.cornerSize
    );
  }
  get elementSVG(): RectangleSVG {
    return this.rect;
  }

  set position(position: Position) {
    this.rect.position = {
      x: position.x + this.boundingCorner.width - this.boundingCorner.cornerMargin,
      y: position.y - this.boundingCorner.cornerMargin
    }
  }
}
class RBCornerBox extends CornerBox {
  private readonly rect: RectangleSVG;
  private boundingCorner: BoundingCorner;
  constructor(boundingCorner: BoundingCorner) {
    super();
    this.boundingCorner = boundingCorner;
    this.rect = new RectangleSVG(
      boundingCorner.x + boundingCorner.width - boundingCorner.cornerMargin,
      boundingCorner.y + boundingCorner.height - boundingCorner.cornerMargin,
      boundingCorner.cornerSize,
      boundingCorner.cornerSize
    );
  }
  get elementSVG(): RectangleSVG {
    return this.rect;
  }

  set position(position: Position) {
    this.rect.position = {
      x: position.x + this.boundingCorner.width - this.boundingCorner.cornerMargin,
      y: position.y + this.boundingCorner.height - this.boundingCorner.cornerMargin
    }
  }
}
class LBCornerBox extends CornerBox {
  private readonly rect: RectangleSVG;
  private boundingCorner: BoundingCorner;
  constructor(boundingCorner: BoundingCorner) {
    super();
    this.boundingCorner = boundingCorner;
    this.rect = new RectangleSVG(
      boundingCorner.x - boundingCorner.cornerMargin,
      boundingCorner.y + boundingCorner.height - boundingCorner.cornerMargin,
      boundingCorner.cornerSize,
      boundingCorner.cornerSize
    );
  }
  get elementSVG(): RectangleSVG {
    return this.rect;
  }

  set position(position: Position) {
    this.rect.position = {
      x: position.x - this.boundingCorner.cornerMargin,
      y: position.y + this.boundingCorner.height - this.boundingCorner.cornerMargin
    }
  }
}

export class CornerBoxes {
  private leftTopCorner: LTCornerBox;
  private rightTopCorner: RTCornerBox;
  private rightBottomCorner: RBCornerBox;
  private leftBottomCorner: LBCornerBox;

  constructor(x: number, y: number, width: number, height: number) {
    let boundingCorner: BoundingCorner = new BoundingCorner(x, y, width, height);

    this.leftTopCorner = new LTCornerBox(boundingCorner);
    this.rightTopCorner = new RTCornerBox(boundingCorner);
    this.rightBottomCorner = new RBCornerBox(boundingCorner);
    this.leftBottomCorner = new LBCornerBox(boundingCorner);
  }

  get all(): CornerBox[] {
    return [this.leftTopCorner, this.rightTopCorner, this.rightBottomCorner, this.leftBottomCorner];
  }
}
