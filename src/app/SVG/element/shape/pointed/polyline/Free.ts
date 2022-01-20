import {Path} from "../Path";

export class Free extends Path {
  override get copy(): Free {
    return super.copy as Free;
  }
}
