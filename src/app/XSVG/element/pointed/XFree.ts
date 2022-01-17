import {XPolyline} from "./XPolyline";

export class XFree extends XPolyline {
  override get copy(): XFree {
    return super.copy as XFree;
  }
}
