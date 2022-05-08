import {SystemFile} from "../SystemFile";

export class FishPromptFile extends SystemFile {
	private readonly _prompt: string;

	constructor(path: string, touch?: boolean) {
		super(path);
		if (touch) {
			this.touch();
		}
		this._prompt = this.read();
	}

	get prompt(): string {
		return this._prompt;
	}
}
