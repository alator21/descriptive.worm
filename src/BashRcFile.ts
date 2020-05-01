import * as fs from 'fs';
import {FilePath} from "./FilePath";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";

export class BashRcFile {
    private readonly _path: string;


    private constructor(path: string) {
        this._path = path;
    }

    static create(path: string): BashRcFile {
        let filePath: FilePath = FilePath.create(path);
        if (!filePath.isValid()) {
            throw new FilePathIsNotValidException(path);
        }

        return new BashRcFile(path);
    }

    private sourceStartExists(startShPath: string): boolean {
        const bashRc = fs.readFileSync(this._path);
        return bashRc.includes(`source ${startShPath}`);
    }

    appendSourceStart(startShPath: string): void {
        if (this.sourceStartExists(startShPath)){
            console.warn(`Already initialized.`);
            return;
        }
        fs.appendFileSync(this._path, startShPath)
    }

    get path(): string {
        return this._path;
    }
}