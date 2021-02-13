import * as fs from 'fs';

const expandHomeDir = require('expand-home-dir');

export class FilePath {
    private readonly _path: string | null;
    private readonly _expandedPath: string | null;


    private constructor(path: string | null) {
        this._path = path;
        this._expandedPath = expandHomeDir(path);
    }

    static create(path: string | null): FilePath {
        return new FilePath(path);
    }

    isValid(): boolean {
        if (this._expandedPath == null) {
            return false;
        }
        return fs.existsSync(this._expandedPath);
    }

    readSync(): string {
        if (this._expandedPath == null) {
            throw new Error('');
        }
        return fs.readFileSync(this._expandedPath, 'utf8');
    }

    touch(): void {
        if (this._expandedPath == null) {
            throw new Error('');
        }
        FilePath.writeFileSyncRecursive(this._expandedPath, '');
    }

    writeSync(data: string): void {
        if (this._expandedPath == null) {
            throw new Error('');
        }
        FilePath.writeFileSyncRecursive(this._expandedPath, data);
    }

    appendSync(data: string): void {
        if (this._expandedPath == null) {
            throw new Error('');
        }
        fs.appendFileSync(this._expandedPath, data)
    }


    get path(): string | null {
        return this._path;
    }

    get expandedPath(): string | null {
        return this._expandedPath;
    }

    private static writeFileSyncRecursive(filename: string, content: string): void {
        // -- normalize path separator to '/' instead of path.sep,
        // -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
        let filepath = filename.replace(/\\/g, '/');

        // -- preparation to allow absolute paths as well
        let root = '';
        if (filepath[0] === '/') {
            root = '/';
            filepath = filepath.slice(1);
        } else if (filepath[1] === ':') {
            root = filepath.slice(0, 3);   // c:\
            filepath = filepath.slice(3);
        }

        // -- create folders all the way down
        const folders = filepath.split('/').slice(0, -1);  // remove last item, file
        folders.reduce(
            (acc, folder) => {
                const folderPath = acc + folder + '/';
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                return folderPath
            },
            root // first 'acc', important
        );

        // -- write file
        fs.writeFileSync(root + filepath, content, 'utf8');
    }
}
