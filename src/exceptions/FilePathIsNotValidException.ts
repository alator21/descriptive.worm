import {Exception} from "./Exception";

export class FilePathIsNotValidException extends Exception {
    private readonly path: string|null;


    constructor(path: string|null) {
        super();
        this.path = path;
    }

    toString() {
        return `FilePathIsNotValidException[${this.path}]`;
    }


}