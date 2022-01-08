import {Command} from "../Command";

export class Close extends Command {
  constructor() {
    super({x: 0, y: 0});
  }
  get command(): string {
    return "Z";
  }

  get copy(): Command {
    return new Close();
  }

}
