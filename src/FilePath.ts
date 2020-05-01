import * as fs from 'fs';

export class FilePath {
    private readonly path: string;


    private constructor(path: string) {
        this.path = path;
    }

    static create(path: string): FilePath {
        return new FilePath(path);
    }

    isValid(): boolean {
        return fs.existsSync(this.path);
    }
}