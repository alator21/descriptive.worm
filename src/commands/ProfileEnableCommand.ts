import {Command} from "./Command";
import {ConfigFile} from "../file/ConfigFile";
import {Profile} from "../profile/Profile";
import {ProfileNameDoesNotExist} from "../exceptions/ProfileNameDoesNotExist";
import {getConfigFile} from "../utils";

export class ProfileEnableCommand extends Command {
	private readonly profileName: string;

	constructor(profileName: string) {
		super();
		this.profileName = profileName;
	}

	execute(): void {
		let config: ConfigFile = getConfigFile();
		const profiles: Map<string, Profile> = config.profiles();

		let activeProfile: Profile | null = config.getActive();
		if (activeProfile != null) {
			activeProfile.disable();
		}
		let profileNameExists: boolean = false;
		for (let profile of profiles.values()) {
			if (profile.name === this.profileName) {
				profile.setActive();
				profileNameExists = true;
				break;
			}
		}
		if (!profileNameExists) {
			throw new ProfileNameDoesNotExist();
		}

		config.write();
	}


}
