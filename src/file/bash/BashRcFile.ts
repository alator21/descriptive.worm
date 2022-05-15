import {STARTSH_PATH} from "../../tokens";
import {RcFile} from "../RcFile";

export class BashRcFile extends RcFile {

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
		const bashRc: string = this.read();
		return bashRc.includes(`source ${STARTSH_PATH}`);
	}
}
