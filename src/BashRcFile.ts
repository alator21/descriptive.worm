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
        const bashRcFile = FilePath.create(this._path);
        const bashRc = bashRcFile.readSync();
        return bashRc.includes(`source ${startShPath}`);
    }

    appendSourceStart(startShPath: string): void {
        if (this.sourceStartExists(startShPath)) {
            console.warn(`Already initialized.`);
            return;
        }
        let filePath: FilePath = FilePath.create(this._path);
        filePath.appendSync(startShPath);
    }

    get path(): string {
        return this._path;
    }
}