import {Command} from "./Command";
import {BASHRC_PATH, STARTSH_PATH} from "../tokens";
import {StartShFile} from "../file/StartShFile";
import {BashRcFile} from "../file/BashRcFile";

export class InitCommand extends Command {

    constructor() {
        super();
    }

    execute(): void {
        new StartShFile(STARTSH_PATH, true);
        const bashRcFile: BashRcFile = new BashRcFile(BASHRC_PATH);
        bashRcFile.config();
    }


}
