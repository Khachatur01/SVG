import {PathCommand} from "./PathCommand";
import {Point} from "../Point";
import {MoveTo} from "./point/MoveTo";

export class PathObject {
  private commands: PathCommand[] = [];

  get copy(): PathObject {
    let path: PathObject = new PathObject();
    this.commands.forEach(
      (command: PathCommand) => path.add(command.copy)
    );
    return path;
  }

  get points(): Point[] {
    let points: Point[] = [];
    for (let command of this.commands)
      points.push(command.position);
    return points;
  }

  get pointedCommands(): PathCommand[] {
    let commands: PathCommand[] = [];
    for (let command of this.commands)
      commands.push(command);
    return commands;
  }

  getAll(): PathCommand[] {
    return this.commands;
  }

  setAll(commands: PathCommand[]) {
    this.commands = commands;
  }

  get(index: number): PathCommand {
    if (index < 0)
      index = this.commands.length + index;

    return this.commands[index];
  }

  set(index: number, command: PathCommand) {
    if (index < 0)
      index = this.commands.length + index;

    this.commands[index] = command;
  }

  add(command: PathCommand) {
    this.commands.push(command);
  }

  remove(index: number) {
    let pointedCommands = this.pointedCommands;
    if (index < 0)
      index = pointedCommands.length + index;

    let command = pointedCommands[index];
    this.commands = this.commands.splice(this.commands.indexOf(command), 1);
  }

  replace(index: number, point: Point) {
    let pointedCommands = this.pointedCommands;
    if (index < 0)
      index = pointedCommands.length + index;

    this.pointedCommands[index].position = point;
  }
  replaceCommand(index: number, command: PathCommand) {
    if (index < 0)
      index = this.commands.length + index;

    this.commands[index] = command;
  }

  toString(close: boolean = false): string {
    let result = "";
    for (let command of this.commands) {
      result += command.command + " ";
    }
    if (close)
      return result + "Z";
    else {
      return result.trimRight();
    }
  }
}
