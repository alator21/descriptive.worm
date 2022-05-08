import {Profile} from "../Profile";
import {PathsFile} from "../../file/PathsFile";
import {StartupFile} from "../../file/StartupFile";
import {AliasesFile} from "../../file/AliasesFile";
import {StartupCommandsFile} from "../../file/StartupCommandsFile";
import {v4 as uuidv4} from "uuid";
import {ExtensionsNotValidException} from "../../exceptions/ExtensionsNotValidException";
import {FishPromptFile} from "../../file/fish/FishPromptFile";

export class FishProfile extends Profile {
	private readonly _promptPath: string | null;

	constructor(id: string, name: string, isActive: boolean, promptPath: FishPromptFile | null, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null, startupCommandsPath: StartupCommandsFile | null, extensions: string[]) {
		super(id, name, isActive, pathsPath, startupPath, aliasesPath, startupCommandsPath, extensions);
		this._promptPath = promptPath ? promptPath.path : null;
	}

	static create(name: string): FishProfile {
		const id: string = uuidv4();
		return new FishProfile(id, name, false, null, null, null, null, null, []);
	}

	static restore(
		id: string,
		name: string,
		isActive: boolean,
		promptPath: FishPromptFile | null,
		pathsPath: PathsFile | null,
		startupPath: StartupFile | null,
		aliasesPath: AliasesFile | null,
		startupCommandsFile: StartupCommandsFile | null,
		extensions: string[]): FishProfile {
		const profile: FishProfile = new FishProfile(id, name, isActive, promptPath, pathsPath, startupPath, aliasesPath, startupCommandsFile, extensions);
		if (!profile.extensionsValid()) {
			throw new ExtensionsNotValidException();
		}
		return profile;
	}


	get promptPath(): string | null {
		return this._promptPath;
	}

	static calculatePrompt(promptFilePath: string | null): string | null {
		const promptFile: FishPromptFile | null = ((promptFilePath != null) && new FishPromptFile(promptFilePath)) || null;

		if (promptFile != null) {
			return promptFile.prompt;
		}
		return null;
	}
}
