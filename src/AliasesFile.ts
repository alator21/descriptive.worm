import {File} from "./File";

export class AliasesFile extends File {
    private readonly _aliases: Map<string, string>;


    constructor(path: string | null) {
        super(path);
        const aliasesFile: string = this.read();

        const json = JSON.parse(aliasesFile);
        const aliases: Map<string, string> = new Map<string, string>();
        for (let key of Object.keys(json)) {
            aliases.set(key, json[key]);
        }
        this._aliases = aliases;
    }

    get aliases(): Map<string, string> {
        return this._aliases;
    }

    write() {
        const aliasesAsObject: any = {};
        this._aliases.forEach((value, key) => {
            aliasesAsObject[key] = value;
        });
        const output: string = JSON.stringify(aliasesAsObject, null, 2);
        super.write(output);
    }
}
