import {Command} from "./Command";
import {ProfileNameAlreadyExists} from "../exceptions/ProfileNameAlreadyExists";
import {
	DEFAULT_CONFIG_PATH,
	DEFAULT_PROFILE_ALIASES_NAME,
	DEFAULT_PROFILE_PATHS_NAME, DEFAULT_PROFILE_STARTUP_COMMANDS_NAME, DEFAULT_PROFILE_STARTUPS_NAME,
	DEFAULT_PROFILES_PATH
} from "../tokens";
import {ProfileFolder} from "../folder/ProfileFolder";
import {PathsFile} from "../file/PathsFile";
import {AliasesFile} from "../file/AliasesFile";
import {StartupFile} from "../file/StartupFile";
import {ConfigFile} from "../file/ConfigFile";
import {Profile} from "../profile/Profile";
import {StartupCommandsFile} from "../file/StartupCommandsFile";
import {FolderAlreadyExistsException} from "../exceptions/FolderAlreadyExistsException";

export class ProfileCreateCommand extends Command {
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
				throw new ProfileNameAlreadyExists();
			}
		}
		const folderName: string = `${DEFAULT_PROFILES_PATH}/${this.profileName}`;
		this.createEmptyStructure(folderName);
		const newProfile: Profile = Profile.create(this.profileName);
		newProfile.updatePathsPath(new PathsFile(`${folderName}/${DEFAULT_PROFILE_PATHS_NAME}.json`));
		newProfile.updateAliasesPath(new AliasesFile(`${folderName}/${DEFAULT_PROFILE_ALIASES_NAME}.json`));
		newProfile.updateStartupPath(new StartupFile(`${folderName}/${DEFAULT_PROFILE_STARTUPS_NAME}.json`));
		newProfile.updateStartupCommandsPath(new StartupCommandsFile(`${folderName}/${DEFAULT_PROFILE_STARTUP_COMMANDS_NAME}.json`));

		config.addProfile(newProfile);
		config.write();
	}

	private createEmptyStructure(folderName: string) {
		const profileFolder: ProfileFolder = new ProfileFolder(folderName);
		if (profileFolder.exists()) {
			throw new FolderAlreadyExistsException(folderName);
		}
		profileFolder.touch();

		const pathsFile: PathsFile = new PathsFile(`${folderName}/${DEFAULT_PROFILE_PATHS_NAME}.json`, true);
		pathsFile.touch();

		const aliasesFile: AliasesFile = new AliasesFile(`${folderName}/${DEFAULT_PROFILE_ALIASES_NAME}.json`, true);
		aliasesFile.touch();

		const startupFile: StartupFile = new StartupFile(`${folderName}/${DEFAULT_PROFILE_STARTUPS_NAME}.json`, true);
		startupFile.touch();

		const startupCommandsFile: StartupCommandsFile = new StartupCommandsFile(`${folderName}/${DEFAULT_PROFILE_STARTUP_COMMANDS_NAME}.json`, true);
		startupCommandsFile.touch();

	}


}
