import {StartupFileWrongFormatException} from "./exceptions/StartupFileWrongFormatException";
import {File} from "./File";
import {FilePath} from "./FilePath";

export class StartupCommandsFile extends File {
    private readonly _startupCommands: string[];


    constructor(path: string | null) {
        super(path);
        let startupCommandsFile: string = this.read();

        let startupCommands: any[] = JSON.parse(startupCommandsFile);
        if (!Array.isArray(startupCommands)) {
            throw new StartupFileWrongFormatException();
        }
        this._startupCommands = startupCommands;
    }

    static empty(path: string): StartupCommandsFile {
        let fp: FilePath = FilePath.create(path);
        fp.touch();
        fp.appendSync('[\n\n]')
        return new StartupCommandsFile(path)
    }

    get startupCommands(): string[] {
        return this._startupCommands;
    }

    writeToDisc() {
        let output: string = JSON.stringify(this._startupCommands, null, 2);
        this.write(output);
    }
}
