import * as fs from 'fs';

const expandHomeDir = require('expand-home-dir');

export class FilePath {
    private readonly path: string | null;
    private readonly expandedPath: string | null;


    private constructor(path: string | null) {
        this.path = path;
        this.expandedPath = expandHomeDir(path);
    }

    static create(path: string | null): FilePath {
        return new FilePath(path);
    }

    isValid(): boolean {
        if (this.expandedPath == null){
            return false;
        }
        return fs.existsSync(this.expandedPath);
    }

    readSync(): string {
        if (this.expandedPath == null){
            throw new Error('');
        }
        return fs.readFileSync(this.expandedPath, 'utf8');
    }

    writeSync(data: string): void {
        if (this.expandedPath == null){
            throw new Error('');
        }
        fs.writeFileSync(this.expandedPath, data);
    }
}