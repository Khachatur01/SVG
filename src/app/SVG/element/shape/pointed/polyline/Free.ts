import {Polyline} from "./Polyline";

export class Free extends Polyline {
  override get copy(): Free {
    return super.copy as Free;
  }
}
