import {Command} from "./Command";

export class ProfileDeleteCommand extends Command {
    private readonly profileName: string;

    constructor(profileName: string) {
        super();
        this.profileName = profileName;
    }

    execute(): void {

    }


}
