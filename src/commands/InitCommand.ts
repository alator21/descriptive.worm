import {Command} from "./Command";
import {getRcFile} from "../utils";
import {RcFile} from "../file/RcFile";

export class InitCommand extends Command {

	constructor() {
		super();
	}

	execute(): void {
		const rcFile: RcFile = getRcFile();
		rcFile.config();
	}


}
