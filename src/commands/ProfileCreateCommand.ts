import {Command} from "./Command";
import {ProfileNameAlreadyExists} from "../exceptions/ProfileNameAlreadyExists";
import {PROFILE_ALIASES_NAME, PROFILE_PATHS_NAME, PROFILE_STARTUP_COMMANDS_NAME, PROFILE_STARTUPS_NAME, PROFILES_PATH} from "../tokens";
import {ProfileFolder} from "../folder/ProfileFolder";
import {PathsFile} from "../file/PathsFile";
import {AliasesFile} from "../file/AliasesFile";
import {StartupFile} from "../file/StartupFile";
import {ConfigFile} from "../file/ConfigFile";
import {Profile} from "../profile/Profile";
import {StartupCommandsFile} from "../file/StartupCommandsFile";
import {FolderAlreadyExistsException} from "../exceptions/FolderAlreadyExistsException";
import {createProfile, getConfigFile} from "../utils";

export class ProfileCreateCommand extends Command {
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
				throw new ProfileNameAlreadyExists();
			}
		}
		const folderName: string = `${PROFILES_PATH}/${this.profileName}`;
		this.createEmptyStructure(folderName);
		let newProfile: Profile = createProfile(this.profileName);
		newProfile.updatePathsPath(new PathsFile(`${folderName}/${PROFILE_PATHS_NAME}.json`));
		newProfile.updateAliasesPath(new AliasesFile(`${folderName}/${PROFILE_ALIASES_NAME}.json`));
		newProfile.updateStartupPath(new StartupFile(`${folderName}/${PROFILE_STARTUPS_NAME}.json`));
		newProfile.updateStartupCommandsPath(new StartupCommandsFile(`${folderName}/${PROFILE_STARTUP_COMMANDS_NAME}.json`));

		config.addProfile(newProfile);
		config.write();
	}

	private createEmptyStructure(folderName: string) {
		const profileFolder: ProfileFolder = new ProfileFolder(folderName);
		if (profileFolder.exists()) {
			throw new FolderAlreadyExistsException(folderName);
		}
		profileFolder.touch();

		const pathsFile: PathsFile = new PathsFile(`${folderName}/${PROFILE_PATHS_NAME}.json`, true);
		pathsFile.touch();

		const aliasesFile: AliasesFile = new AliasesFile(`${folderName}/${PROFILE_ALIASES_NAME}.json`, true);
		aliasesFile.touch();

		const startupFile: StartupFile = new StartupFile(`${folderName}/${PROFILE_STARTUPS_NAME}.json`, true);
		startupFile.touch();

		const startupCommandsFile: StartupCommandsFile = new StartupCommandsFile(`${folderName}/${PROFILE_STARTUP_COMMANDS_NAME}.json`, true);
		startupCommandsFile.touch();

	}


}
