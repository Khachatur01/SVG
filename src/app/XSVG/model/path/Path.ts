import {Command} from "./Command";
import {Point} from "../Point";

export class Path {
  private commands: Command[] = [];

  get copy(): Path {
    let path: Path = new Path();
    this.commands.forEach(
      (command: Command) => path.add(command.copy)
    );
    return path
  }

  get points(): Point[] {
    let points: Point[] = [];
    for(let command of this.commands)
      points.push(command.point);
    return points;
  }
  set points(points: Point[]) {
    for(let i = 0; i < this.commands.length; i++)
      this.commands[i].point = points[i];
  }

  getAll(): Command[] {
    return this.commands;
  }
  setAll(commands: Command[]) {
    this.commands = commands;
  }
  get(index: number): Command {
    if(index < 0)
      index = this.commands.length - index;

    return this.commands[index];
  }
  set(index: number, command: Command) {
    if(index < 0)
      index = this.commands.length - index;

    this.commands[index] = command;
  }
  add(command: Command) {
    this.commands.push(command);
  }
  remove(index: number) {
    if(index < 0)
      index = this.commands.length - index;

    this.commands = this.commands.splice(index, 1);
  }

  toString(close: boolean = false): string {
    let result = "";
    for(let command of this.commands) {
      result += command.command + " ";
    }
    if(close)
      return result + "Z";
    else {
      return result.trimRight();
    }
  }
}
