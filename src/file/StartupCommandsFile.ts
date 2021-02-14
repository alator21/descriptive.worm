import {SystemFile} from "./SystemFile";
import {StartupFileWrongFormatException} from "../exceptions/StartupFileWrongFormatException";

export class StartupCommandsFile extends SystemFile {
    private readonly _startupCommands: string[];


    constructor(path: string, touch?: boolean) {
        super(path);
        if (touch) {
            this.touch();
        }
        let startupCommandsFile: string = this.read();

        let startupCommands: any[] = JSON.parse(startupCommandsFile);
        if (!Array.isArray(startupCommands)) {
            throw new StartupFileWrongFormatException();
        }
        this._startupCommands = startupCommands;
    }


    touch() {
        super.touch();
        super.writeSync(`[\n\n]`);
    }

    get startupCommands(): string[] {
        return this._startupCommands;
    }
}
