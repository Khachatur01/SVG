import {Command} from "./Command";
import {Point} from "../Point";
import {Close} from "./close/Close";

export class Path {
  private commands: Command[] = [];

  get copy(): Path {
    let path: Path = new Path();
    this.commands.forEach(
      (command: Command) => path.add(command.copy)
    );
    return path;
  }

  get points(): Point[] {
    let points: Point[] = [];
    for(let command of this.commands)
      if(!(command instanceof Close))
        points.push(command.position);
    return points;
  }

  get pointedCommands(): Command[] {
    let commands: Command[] = [];
    for(let command of this.commands)
      if(!(command instanceof Close))
        commands.push(command);
    return commands;
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
    let pointedCommands = this.pointedCommands;
    if(index < 0)
      index = pointedCommands.length - index;

    let command = pointedCommands[index];
    this.commands = this.commands.splice(this.commands.indexOf(command), 1);
  }
  replace(index: number, point: Point) {
    let pointedCommands = this.pointedCommands;
    if(index < 0)
      index = pointedCommands.length - index;

    this.pointedCommands[index].position = point;
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
