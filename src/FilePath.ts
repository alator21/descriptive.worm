import * as fs from 'fs';
import * as expandHomeDir from "expand-home-dir";

export class FilePath {
    private readonly path: string;
    private readonly expandedPath: string


    private constructor(path: string) {
        this.path = path;
        this.expandedPath = expandHomeDir(path);
    }

    static create(path: string): FilePath {
        return new FilePath(path);
    }

    isValid(): boolean {
        return fs.existsSync(this.expandedPath);
    }

    readSync(): string {
        return fs.readFileSync(this.expandedPath, 'utf8');
    }

    writeSync(data: string): void {
        fs.writeFileSync(this.expandedPath, data);
    }
}