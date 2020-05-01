import * as fs from 'fs';
import {FilePath} from "./FilePath";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";

export class AliasesFile {
    private readonly _path: string;
    private readonly _aliases: Map<string, string>;


    private constructor(path: string, startupPaths: Map<string, string>) {
        this._path = path;
        this._aliases = startupPaths;
    }

    static create(path: string): AliasesFile {
        let filePath: FilePath = FilePath.create(path);
        if (!filePath.isValid()) {
            throw new FilePathIsNotValidException(path);
        }
        let aliasesFile: string = fs.readFileSync(path, 'utf8');

        let json = JSON.parse(aliasesFile);
        let aliases: Map<string, string> = new Map<string, string>();
        for (let key of Object.keys(json)) {
            aliases.set(key, json[key]);
        }
        return new AliasesFile(path, aliases);
    }

    get path(): string {
        return this._path;
    }

    get aliases(): Map<string, string> {
        return this._aliases;
    }

    writeToDisc() {
        let aliasesAsObject: object = {};
        this._aliases.forEach((value, key) => {
            aliasesAsObject[key] = value;
        });
        let output: string = JSON.stringify(aliasesAsObject, null, 2);
        // console.log('aliases--');
        // console.log(output);
        fs.writeFileSync(this.path, output)
    }
}