import {Command} from "./Command";
import {ConfigFile} from "../file/ConfigFile";
import {DEFAULT_CONFIG_PATH} from "../tokens";
import {Profile} from "../Profile";
import {ProfileNameDoesNotExist} from "../exceptions/ProfileNameDoesNotExist";

export class ProfileEnableCommand extends Command {
	private readonly profileName: string;

	constructor(profileName: string) {
		super();
		this.profileName = profileName;
	}

	execute(): void {
		let config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
		const profiles: Map<string, Profile> = config.profiles;

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
