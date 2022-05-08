import {ConfigFile} from "../ConfigFile";
import {BashProfile} from "../../profile/bash/BashProfile";
import {PathsFile} from "../PathsFile";
import {StartupFile} from "../StartupFile";
import {AliasesFile} from "../AliasesFile";
import {StartupCommandsFile} from "../StartupCommandsFile";
import chalk from "chalk";
import {ConfigFileWrongFormatException} from "../../exceptions/ConfigFileWrongFormatException";
import log from "loglevel";

export class BashConfigFile extends ConfigFile {
	private readonly _profiles: Map<string/*profileId*/, BashProfile>;

	constructor(path: string, touch: boolean) {
		super(path, touch);
		try {
			const configFile: string = this.read();
			const json = JSON.parse(configFile);
			const profiles: Map<string, BashProfile> = new Map<string, BashProfile>();
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
					_ps1,
					_pathsFile,
					_startupCommandsFile,
					_extensions
				} = profileJson;
				log.debug(_id, _name, _startupFile, _aliasesFile, _isActive, _ps1, _pathsFile, _startupCommandsFile, _extensions);
				profiles
					.set(_id, BashProfile.restore(
						_id,
						_name,
						_isActive,
						_ps1,
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


	addActualProfile(profile: BashProfile): void {
		this._profiles.set(profile.id, profile);
	}

	profiles(): Map<string, BashProfile> {
		return this._profiles;
	}


	printProfilesFull(): void {
		let output: any[] = [];
		for (let profile of this._profiles.values()) {
			output.push({
				'id': chalk.blue(profile.id),
				'name': chalk.yellow(profile.name),
				'ps1': `${(profile.ps1 && (chalk.cyan(profile.ps1.substring(0, 20)) + chalk.red('...')) || '')}`,
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
