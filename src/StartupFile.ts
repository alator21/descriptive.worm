import {FilePath} from "./FilePath";
import {StartupFileWrongFormatException} from "./exceptions/StartupFileWrongFormatException";
import {File} from "./File";

export class StartupFile extends File {
    private readonly _startupPaths: string[];


    constructor(path: string | null) {
        super(path);
        let startupFile: string = this.read();

        let startupPaths: any[] = JSON.parse(startupFile);
        if (!Array.isArray(startupPaths)) {
            throw new StartupFileWrongFormatException();
        }
        for (let p of startupPaths) {
            if (typeof p !== 'string') {
                throw new StartupFileWrongFormatException();
            }
            let startupPath: FilePath = FilePath.create(p);
            if (!startupPath.isValid()) {
                throw new StartupFileWrongFormatException();
            }
        }
        this._startupPaths = startupPaths;
    }

    get startupPaths(): string[] {
        return this._startupPaths;
    }

    write() {
        let output: string = JSON.stringify(this._startupPaths, null, 2);
        super.write(output);
    }
}
