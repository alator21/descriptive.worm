import {SystemFile} from "../SystemFile";
import {STARTSH_PATH} from "../../tokens";

export class FishRcFile extends SystemFile {
	constructor(path: string) {
		super(path);
	}


	config(): void {
		if (this.isConfigured()) {
			console.warn(`Already initialized.`);
			return;
		}
		this.appendSync(`\nsource ${STARTSH_PATH}\n`);
	}

	private isConfigured(): boolean {
		const configFish: string = this.read();
		return configFish.includes(`source ${STARTSH_PATH}`);
	}
}
