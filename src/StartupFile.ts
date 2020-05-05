import {FilePath} from "./FilePath";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";
import {StartupFileWrongFormatException} from "./exceptions/StartupFileWrongFormatException";

export class StartupFile {
    private readonly _path: string | null;
    private readonly _startupPaths: string[];


    private constructor(path: string | null, startupPaths: string[]) {
        this._path = path;
        this._startupPaths = startupPaths;
    }

    static create(path: string | null): StartupFile {
        let filePath: FilePath = FilePath.create(path);
        if (!filePath.isValid()) {
            throw new FilePathIsNotValidException(path);
        }
        let startupFile: string = filePath.readSync();

        let startupPaths: any[] = JSON.parse(startupFile);
        if (!Array.isArray(startupPaths)) {
            throw new StartupFileWrongFormatException();
        }
        for (let p of startupPaths) {
            if (typeof p !== 'string') {
                throw new StartupFileWrongFormatException();
            }
            let startupPath: FilePath = FilePath.create(p);
            if (!startupPath.isValid()) {
                throw new StartupFileWrongFormatException();
            }
        }
        return new StartupFile(path, startupPaths);
    }


    get path(): string | null {
        return this._path;
    }

    get startupPaths(): string[] {
        return this._startupPaths;
    }

    writeToDisc() {
        let output: string = JSON.stringify(this._startupPaths, null, 2);
        // console.log('startup--');
        // console.log(output);
        const startupFile: FilePath = FilePath.create(this._path);
        startupFile.writeSync(output);
    }
}