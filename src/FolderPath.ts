import * as fs from 'fs';

const expandHomeDir = require('expand-home-dir');

export class FolderPath{
    private readonly _path: string | null;
    private readonly _expandedPath: string | null;


    private constructor(path: string | null) {
        this._path = path;
        this._expandedPath = expandHomeDir(path);
    }

    static create(path: string | null): FolderPath {
        return new FolderPath(path);
    }

    isValid(): boolean {
        if (this._expandedPath == null) {
            return false;
        }
        if (!fs.existsSync(this._expandedPath)){
            return false;
        }
        const stats = fs.lstatSync(this._expandedPath);
        return stats.isDirectory();
    }

    touch(): void {
        if (this._expandedPath == null) {
            throw new Error('');
        }
        fs.mkdirSync(this._expandedPath, { recursive: true });
    }

    cdTo():void{
        if (!this.isValid()){
            return;
        }
        process.chdir(<string>this._expandedPath);
    }
}
