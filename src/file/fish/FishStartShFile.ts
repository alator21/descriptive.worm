import {StartShFile} from "../StartShFile";
import {Profile} from "../../profile/Profile";
import {FishProfile} from "../../profile/fish/FishProfile";

export class FishStartShFile extends StartShFile {


	constructor(path: string, touch?: boolean) {
		super(path, touch);
	}

	update(profile: FishProfile): void {
		const startupsFilePath: string | null = profile.startupFile;
		const startupCommandsFilePath: string | null = profile.startupCommandsFile;
		const aliasesFilePath: string | null = profile.aliasesFile;
		const pathsFilePath: string | null = profile.pathsFile;
		const promptFilePath: string | null = profile.promptPath;
		const extensions: string[] = profile.extensions;

		const startupPaths: string[] = Profile.calculateStartupPaths(startupsFilePath, extensions);
		const startupCommands: string[] = Profile.calculateStartupCommands(startupCommandsFilePath, extensions);
		const aliases: Map<string, string> = Profile.calculateAliases(aliasesFilePath, extensions);
		const paths: string[] = Profile.calculatePaths(pathsFilePath, extensions);
		const prompt: string | null = FishProfile.calculatePrompt(promptFilePath)

		let output: string = `#!/usr/bin/env fish\n`;

		if (startupPaths.length > 0) {
			output += `\n\n`;
			output += `#Startups\n`;
			for (let startup of startupPaths) {
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
				output += `contains ${path} $fish_user_paths; or set -Ua fish_user_paths ${path}\n`;
			}
		}

		if (startupCommands.length > 0) {
			output += `\n\n`;
			output += `#Commands\n`;
			for (let command of startupCommands) {
				output += `${command}\n`;
			}
		}

		if (prompt != null) {
			output += `\n\n`;
			output += `#Prompt function\n`;
			output += `${prompt}\n`;
		}

		output += `\n`;

		this.writeSync(output);
	}


}
