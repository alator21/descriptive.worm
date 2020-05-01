import {Exception} from "./Exception";

export class FilePathIsNotValidException extends Exception {
    private readonly path: string;


    constructor(path: string) {
        super();
        this.path = path;
    }

    toString() {
        return `FilePathIsNotValidException{${this.path}}`;
    }


}