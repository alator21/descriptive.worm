import {Command} from "./Command";
import {ConfigFile} from "../file/ConfigFile";
import {DEFAULT_CONFIG_PATH} from "../tokens";
import {Profile} from "../Profile";
import {ProfileNameDoesNotExist} from "../exceptions/ProfileNameDoesNotExist";

export class ProfileDeleteCommand extends Command {
    private readonly profileName: string;

    constructor(profileName: string) {
        super();
        this.profileName = profileName;
    }

    execute(): void {
        const config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
        const profiles: Map<string, Profile> = config.profiles;
        for (let prof of profiles.values()) {
            if (prof.name === this.profileName) {
                profiles.delete(prof.id);
                config.write();
                return;
            }
        }
        throw new ProfileNameDoesNotExist();
    }


}
