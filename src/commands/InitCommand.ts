import {Command} from "./Command";
import {BASHRC_PATH, STARTSH_PATH} from "../tokens";
import {BashRcFile} from "../file/bash/BashRcFile";
import {BashStartShFile} from "../file/bash/BashStartShFile";
import {StartShFile} from "../file/StartShFile";
import {FishStartShFile} from "../file/fish/FishStartShFile";
import {FishRcFile} from "../file/fish/FishRcFile";
import {getStartShFile} from "../utils";

export class InitCommand extends Command {

	constructor() {
		super();
	}

	execute(): void {
		const startShFile: StartShFile = getStartShFile();
		if (startShFile instanceof BashStartShFile) {
			const bashRcFile: BashRcFile = new BashRcFile(BASHRC_PATH);
			bashRcFile.config();
		} else if (startShFile instanceof FishStartShFile) {
			const fishConfigFile: FishRcFile = new FishRcFile(STARTSH_PATH);
			fishConfigFile.config();
		}
	}


}
