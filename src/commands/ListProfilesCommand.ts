import {Command} from "./Command";
import {DEFAULT_CONFIG_PATH} from "../tokens";
import {ConfigFile} from "../file/ConfigFile";

export class ListProfilesCommand extends Command {

    constructor() {
        super();
    }

    execute(): void {
        let config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
        config.printProfilesToConsole();
    }


}
