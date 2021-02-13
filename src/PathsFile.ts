import {PathFileWrongFormatException} from "./exceptions/PathFileWrongFormatException";
import {File} from "./File";
import {FilePath} from "./FilePath";

export class PathsFile extends File {
    private readonly _paths: string[];


    constructor(path: string | null) {
        super(path);
        let pathFile: string = this.read();

        let paths: any[] = JSON.parse(pathFile);
        if (!Array.isArray(paths)) {
            throw new PathFileWrongFormatException();
        }
        for (let p of paths) {
            if (typeof p !== 'string') {
                throw new PathFileWrongFormatException();
            }
        }
        this._paths = paths;
    }

    get paths(): string[] {
        return this._paths;
    }

    static empty(path: string): PathsFile {
        let fp: FilePath = FilePath.create(path);
        fp.touch();
        fp.appendSync('[\n\n]')
        return new PathsFile(path)
    }

    writeToDisc() {
        let output: string = JSON.stringify(this._paths, null, 2);
        this.write(output);
    }
}
