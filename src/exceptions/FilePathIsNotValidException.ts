import {Exception} from "./Exception";

export class FilePathIsNotValidException extends Exception {
    private readonly _path: string|null;


    constructor(path: string|null) {
        super();
        this._path = path;
    }


    get path(): string | null {
        return this._path;
    }

    toString() {
        return `FilePathIsNotValidException[${this._path}]`;
    }


}