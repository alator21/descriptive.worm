import {FilePath} from "./FilePath";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";
import {StartupFileWrongFormatException} from "./exceptions/StartupFileWrongFormatException";

export class StartupCommandsFile {
    private readonly _path: string | null;
    private readonly _startupCommands: string[];


    private constructor(path: string | null, startupCommands: string[]) {
        this._path = path;
        this._startupCommands = startupCommands;
    }

    static create(path: string | null): StartupCommandsFile {
        let filePath: FilePath = FilePath.create(path);
        if (!filePath.isValid()) {
            throw new FilePathIsNotValidException(path);
        }
        let startupCommandsFile: string = filePath.readSync();

        let startupCommands: any[] = JSON.parse(startupCommandsFile);
        if (!Array.isArray(startupCommands)) {
            throw new StartupFileWrongFormatException();
        }
        return new StartupCommandsFile(path, startupCommands);
    }


    get path(): string | null {
        return this._path;
    }

    get startupCommands(): string[] {
        return this._startupCommands;
    }

    writeToDisc() {
        let output: string = JSON.stringify(this._startupCommands, null, 2);
        // console.log('startup--');
        // console.log(output);
        const startupCommandsFile: FilePath = FilePath.create(this._path);
        startupCommandsFile.writeSync(output);
    }
}