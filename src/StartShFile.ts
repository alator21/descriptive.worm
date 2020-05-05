import * as fs from 'fs';
import {FilePath} from "./FilePath";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";

export class StartShFile {
    private readonly _path: string;


    private constructor(path: string) {
        this._path = path;
    }

    static create(path: string): StartShFile {
        let filePath: FilePath = FilePath.create(path);
        if (!filePath.isValid()) {
            throw new FilePathIsNotValidException(path);
        }
        return new StartShFile(path);
    }

    private exists(): boolean {
        return fs.existsSync(this._path);
    }

    touch(): void {
        if (this.exists()) {
            console.warn(`Start.sh already exists`);
            return;
        }
        fs.writeFileSync(this._path, '');
    }

    update(startups: string[], aliases: Map<string, string>, paths: string[], ps1: string): void {
        if (!this.exists()) {
            this.touch();
        }
        let output: string = `#!/bin/bash\n`;
        if (startups.length > 0 ){
            output += `\n\n`;
            output += `#Startups\n`;
            for (let startup of startups) {
                output += `source ${startup};\n`;
            }
        }

        if (aliases.size > 0){
            output += `\n\n`;
            output += `#Aliases\n`;
            aliases.forEach((value, key) => {
                output += `alias ${key}=\"${value}\";\n`;
            });
        }


        if (paths.length > 0){
            output += `\n\n`;
            output += `#Path\n`;
            for (let path of paths) {
                output += `PATH=$PATH:${path}\n`;
            }
        }

        if (ps1 != null) {
            output += `\n\n`;
            output += `#Prompt\n`;
            output += `export PS1=\"${ps1}\"`;
        }
        output += `\n`;


        fs.writeFileSync(this._path, output);
    }

    get path(): string {
        return this._path;
    }

}