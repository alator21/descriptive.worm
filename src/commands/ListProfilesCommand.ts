import {Command} from "./Command";
import {DEFAULT_CONFIG_PATH} from "../tokens";
import {ConfigFile} from "../file/ConfigFile";
import {DisplayType} from "./DisplayType";

export class ListProfilesCommand extends Command {

	constructor(private readonly displayType: DisplayType) {
		super();
	}

	execute(): void {
		let config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
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
