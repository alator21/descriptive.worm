import {Command} from "./Command";
import {ProfileNameAlreadyExists} from "../exceptions/ProfileNameAlreadyExists";
import {DEFAULT_CONFIG_PATH, DEFAULT_PROFILES_PATH} from "../tokens";
import {ProfileFolder} from "../folder/ProfileFolder";
import {PathsFile} from "../file/PathsFile";
import {AliasesFile} from "../file/AliasesFile";
import {StartupFile} from "../file/StartupFile";
import {ConfigFile} from "../file/ConfigFile";
import {Profile} from "../Profile";
import {StartupCommandsFile} from "../file/StartupCommandsFile";
import {FolderAlreadyExistsException} from "../exceptions/FolderAlreadyExistsException";

export class ProfileCreateCommand extends Command {
	private readonly profileName: string;

	constructor(profileName: string) {
		super();
		this.profileName = profileName;
	}

	/**
	 * check if profile name exists
	 * if it exists throw exception
	 * create structure for the new profile
	 */
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
		newProfile.updatePathsPath(new PathsFile(`${folderName}/paths.json`));
		newProfile.updateAliasesPath(new AliasesFile(`${folderName}/aliases.json`));
		newProfile.updateStartupPath(new StartupFile(`${folderName}/startup.json`));
		newProfile.updateStartupCommandsPath(new StartupCommandsFile(`${folderName}/startup-commands.json`));

		config.addProfile(newProfile);
		config.write();
	}

	private createEmptyStructure(folderName: string) {
		const profileFolder: ProfileFolder = new ProfileFolder(folderName);
		if (profileFolder.exists()) {
			throw new FolderAlreadyExistsException(folderName);
		}
		profileFolder.touch();

		const pathsFile: PathsFile = new PathsFile(`${folderName}/paths.json`, true);
		pathsFile.touch();

		const aliasesFile: AliasesFile = new AliasesFile(`${folderName}/aliases.json`, true);
		aliasesFile.touch();

		const startupFile: StartupFile = new StartupFile(`${folderName}/startup.json`, true);
		startupFile.touch();

		const startupCommandsFile: StartupCommandsFile = new StartupCommandsFile(`${folderName}/startup-commands.json`, true);
		startupCommandsFile.touch();

	}


}
