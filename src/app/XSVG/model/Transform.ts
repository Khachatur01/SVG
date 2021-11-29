export class Transform {
  private _translateX: number = 0;
  private _translateY: number = 0;
  private _rotate: number = 0;
  private _skewX: number = 0;
  private _skewY: number = 0;

  get translateX(): number {
    return this._translateX;
  }

  set translateX(value: number) {
    this._translateX = value;
  }

  get translateY(): number {
    return this._translateY;
  }

  set translateY(value: number) {
    this._translateY = value;
  }

  get rotate(): number {
    return this._rotate;
  }

  set rotate(value: number) {
    this._rotate = value;
  }

  get skewX(): number {
    return this._skewX;
  }

  set skewX(value: number) {
    this._skewX = value;
  }

  get skewY(): number {
    return this._skewY;
  }

  set skewY(value: number) {
    this._skewY = value;
  }

  toString(): string {
    return "translateX(" + this._translateX + "px) " +
      "translateY(" + this._translateY + "px) " +
      "rotate(" + this._rotate + "deg) " +
      "skewX(" + this._skewX + "deg) " +
      "skewY(" + this._skewY + "deg) "
  }

  reset() {
    this._translateX = 0;
    this._translateY = 0;
    this._rotate = 0;
    this._skewX = 0;
    this._skewY = 0;
  }
}
