import {ConfigFile} from "../ConfigFile";
import {FishProfile} from "../../profile/fish/FishProfile";
import chalk from "chalk";
import {FishPromptFile} from "./FishPromptFile";
import {PathsFile} from "../PathsFile";
import {StartupFile} from "../StartupFile";
import {AliasesFile} from "../AliasesFile";
import {StartupCommandsFile} from "../StartupCommandsFile";
import {ConfigFileWrongFormatException} from "../../exceptions/ConfigFileWrongFormatException";
import log from "loglevel";

export class FishConfigFile extends ConfigFile {
	private readonly _profiles: Map<string/*profileId*/, FishProfile>;


	constructor(path: string, touch: boolean) {
		super(path, touch);
		try {
			const configFile: string = this.read();
			const json = JSON.parse(configFile);
			const profiles: Map<string, FishProfile> = new Map<string, FishProfile>();
			const jsonProfiles = json['_profiles'];

			log.debug(jsonProfiles)
			for (let key of Object.keys(jsonProfiles)) {
				const profileJson = jsonProfiles[key];
				let {
					_id,
					_name,
					_startupFile,
					_aliasesFile,
					_isActive,
					_promptFile,
					_pathsFile,
					_startupCommandsFile,
					_extensions
				} = profileJson;
				log.debug(_id, _name, _startupFile, _aliasesFile, _isActive, _promptFile, _pathsFile, _startupCommandsFile, _extensions);
				profiles
					.set(_id, FishProfile.restore(
						_id,
						_name,
						_isActive,
						new FishPromptFile(_promptFile),
						new PathsFile(_pathsFile),
						new StartupFile(_startupFile),
						new AliasesFile(_aliasesFile),
						new StartupCommandsFile(_startupCommandsFile),
						_extensions
					));
			}
			this._profiles = profiles;
			log.debug(this._profiles);
		} catch (exception) {
			if (exception instanceof SyntaxError) {
				throw new ConfigFileWrongFormatException();
			}
			throw exception;
		}
	}


	addActualProfile(profile: FishProfile): void {
		this._profiles.set(profile.id, profile);
	}

	profiles(): Map<string, FishProfile> {
		return this._profiles;
	}


	printProfilesFull(): void {
		let output: any[] = [];
		for (let profile of this._profiles.values()) {
			output.push({
				'id': chalk.blue(profile.id),
				'name': chalk.yellow(profile.name),
				'paths': chalk.yellow(profile.pathsFile),
				'startup': chalk.yellow(profile.startupFile),
				'aliases': chalk.yellow(profile.aliasesFile),
				'startup-commands': chalk.yellow(profile.startupCommandsFile),
				'extensions': chalk.magenta(profile.extensions.join(',')),
				'active': chalk.cyan(profile.isActive)
			});
		}
		ConfigFile.printTable(output, {
			headerStyleFn: (header: any) => chalk.bold(chalk.red(header))
		});
	}
}
