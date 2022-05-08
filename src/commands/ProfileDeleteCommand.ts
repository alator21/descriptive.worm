import {Command} from "./Command";
import {ConfigFile} from "../file/ConfigFile";
import {Profile} from "../profile/Profile";
import {ProfileNameDoesNotExist} from "../exceptions/ProfileNameDoesNotExist";
import {getConfigFile} from "../utils";

export class ProfileDeleteCommand extends Command {
	private readonly profileName: string;

	constructor(profileName: string) {
		super();
		this.profileName = profileName;
	}

	execute(): void {
		const config: ConfigFile = getConfigFile();
		const profiles: Map<string, Profile> = config.profiles();
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
