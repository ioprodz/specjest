import * as readline from "node:readline";
import { stdin as input, stdout as output, argv } from "node:process";
import { padStart } from "../utils/string";

export class Cli {
  private readonly rl: readline.ReadLine;

  private constructor(rl: readline.ReadLine) {
    this.rl = rl;
  }

  // read stream capabilities
  onLine(fn: (input: string) => void) {
    this.rl.on("line", fn);
  }

  getContent(): Promise<string> {
    return new Promise((resolve) => {
      let buffer = "";
      this.onLine((line) => {
        buffer += line + "\n";
      });

      this.rl.on("close", () => {
        resolve(buffer);
      });
    });
  }

  // write stream capabilities
  write(string: string): void {
    this.rl.write(string);
  }

  writeLine(line: string = ""): void {
    this.write(`${line}\n`);
  }

  // terminal capabilities

  prompt(message: string): Promise<string> {
    if (!this.rl.terminal) {
      throw new Error("Can not use prompt when not in terminal mode");
    }
    return new Promise((resolve) => {
      this.rl.question(message, (input) => {
        resolve(input);
      });
    });
  }

  async promptSelect(message: string, choices: string[]) {
    choices.forEach((name, index) => {
      this.writeLine(`${padStart(index + 1 + "", 3)} : ${name}`);
    });

    const selectedIndex = await this.prompt(`\n${message}`);
    return choices[parseInt(selectedIndex, 10) - 1];
  }

  static getProcessArguments() {
    return argv.slice(2);
  }

  static async streamSession(fn: (cli: Cli) => any): Promise<any> {
    return this.session(fn, false);
  }

  static async terminalSession(fn: (cli: Cli) => any): Promise<any> {
    return this.session(fn, true);
  }

  private static async session(fn: (cli: Cli) => any, isTerminal: boolean) {
    const cli = new Cli(
      readline.createInterface({ input, output, terminal: isTerminal })
    );
    const result = await fn(cli);
    cli.close();
    return result;
  }

  private close() {
    this.rl.close();
  }
}
