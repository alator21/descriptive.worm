import * as fs from 'fs';
import {FilePath} from "./FilePath";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";
import {PathFileWrongFormatException} from "./exceptions/PathFileWrongFormatException";

export class PathsFile {
    private readonly _path: string|null;
    private readonly _paths: string[];


    private constructor(path: string|null, startupPaths: string[]) {
        this._path = path;
        this._paths = startupPaths;
    }

    static create(path: string | null): PathsFile {
        let filePath: FilePath = FilePath.create(path);
        if (!filePath.isValid()) {
            throw new FilePathIsNotValidException(path);
        }
        let pathFile: string = filePath.readSync();

        let paths: any[] = JSON.parse(pathFile);
        if (!Array.isArray(paths)) {
            throw new PathFileWrongFormatException();
        }
        for (let p of paths) {
            if (typeof p !== 'string') {
                throw new PathFileWrongFormatException();
            }
        }
        return new PathsFile(path, paths);
    }


    get path(): string |null{
        return this._path;
    }

    get paths(): string[] {
        return this._paths;
    }

    writeToDisc() {
        let output: string = JSON.stringify(this._paths, null, 2);
        // console.log('path--');
        // console.log(output);
        const pathsFile: FilePath = FilePath.create(this._path);
        pathsFile.writeSync(output);
    }
}