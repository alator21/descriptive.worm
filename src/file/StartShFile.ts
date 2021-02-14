import {SystemFile} from "./SystemFile";
import {FilePathIsNotValidException} from "../exceptions/FilePathIsNotValidException";
import {Profile} from "../Profile";

export class StartShFile extends SystemFile {

	constructor(path: string, touch?: boolean) {
		super(path);
		if (touch) {
			this.touch();
		}
	}


	refresh(profile: Profile): void {
		if (profile == null) {
			console.warn(`No active profile selected.`);
			return;
		}
		const startupsFilePath: string | null = profile.startupFile;
		const startupCommandsFilePath: string | null = profile.startupCommandsFile;
		const aliasesFilePath: string | null = profile.aliasesFile;
		const pathsFilePath: string | null = profile.pathsFile;
		const extensions: string[] = profile.extensions
			.map(extension => {
				const extensionFile: SystemFile = new SystemFile(extension);
				if (!extensionFile.isFile()) {
					throw new FilePathIsNotValidException(extension);
				}
				return extension;
			});


		const startupPaths: string[] = Profile.calculateStartupPaths(startupsFilePath, extensions);
		const startupCommands: string[] = Profile.calculateStartupCommands(startupCommandsFilePath, extensions);
		const aliases: Map<string, string> = Profile.calculateAliases(aliasesFilePath, extensions);
		const paths: string[] = Profile.calculatePaths(pathsFilePath, extensions);

		let ps1: string | null = profile.ps1;

		this.update(startupPaths, aliases, paths, startupCommands, ps1);
	}

	update(startups: string[], aliases: Map<string, string>, paths: string[], startupCommands: string[], ps1: string | null): void {
		if (!this.exists()) {
			this.touch();
		}
		let output: string = `#!/bin/bash\n`;
		if (startups.length > 0) {
			output += `\n\n`;
			output += `#Startups\n`;
			for (let startup of startups) {
				output += `source ${startup};\n`;
			}
		}

		if (aliases.size > 0) {
			output += `\n\n`;
			output += `#Aliases\n`;
			aliases.forEach((value, key) => {
				output += `alias ${key}=\"${value}\";\n`;
			});
		}


		if (paths.length > 0) {
			output += `\n\n`;
			output += `#Path\n`;
			for (let path of paths) {
				output += `PATH=$PATH:${path}\n`;
			}
		}

		if (startupCommands.length > 0) {
			output += `\n\n`;
			output += `#Commands\n`;
			for (let command of startupCommands) {
				output += `${command}\n`;
			}
		}

		if (ps1 != null) {
			output += `\n\n`;
			output += `#Prompt\n`;
			output += `export PS1=\"${ps1}\"`;
		}
		output += `\n`;


		this.writeSync(output);
	}
}
