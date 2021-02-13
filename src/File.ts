import {FilePath} from "./FilePath";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";

export abstract class File {
    private readonly _filePath: FilePath;


    protected constructor(path: string | null) {
        this._filePath = FilePath.create(path);
        if (!this._filePath.isValid()) {
            throw new FilePathIsNotValidException(path);
        }

    }

    read(): string {
        if (this.filePath.isValid()) {
            return this.filePath.readSync();
        }
        throw new Error('');
    }

    touch(): void {
        if (this.exists()) {
            console.warn(`File already exists`);
            return;
        }
        this.write('');
    }

    write(content: any): void {
        this.filePath.writeSync(content);
    };

    append(content: any): void {
        this.filePath.appendSync(content);
    }

    exists(): boolean {
        return this.filePath.isValid();
    }


    get filePath(): FilePath {
        return this._filePath;
    }
}
