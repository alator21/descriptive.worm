import {SystemFile} from "./SystemFile";

export class AliasesFile extends SystemFile {
	private readonly _aliases: Map<string, string>;


	constructor(path: string, touch?: boolean) {
		super(path);
		if (touch) {
			this.touch();
		}
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

	touch() {
		super.touch();
		super.writeSync(`{\n\n}`);
	}
}
