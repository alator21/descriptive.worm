import {Command} from "./Command";
import {ConfigFile} from "../file/ConfigFile";
import {DisplayType} from "./DisplayType";
import {getConfigFile} from "../utils";

export class ListProfilesCommand extends Command {

	constructor(private readonly displayType: DisplayType) {
		super();
	}

	execute(): void {
		let config: ConfigFile = getConfigFile();
		switch (this.displayType) {
			case DisplayType.FULL:
				config.printProfilesFull();
				break;
			case DisplayType.SIMPLE:
				config.printProfilesSimple();
				break;
		}
	}
}
