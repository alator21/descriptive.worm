import {Profile} from "../Profile";
import {PathsFile} from "../../file/PathsFile";
import {StartupFile} from "../../file/StartupFile";
import {AliasesFile} from "../../file/AliasesFile";
import {StartupCommandsFile} from "../../file/StartupCommandsFile";
import {v4 as uuidv4} from 'uuid';
import {ExtensionsNotValidException} from "../../exceptions/ExtensionsNotValidException";

export class BashProfile extends Profile {
	private _ps1: string | null;


	private constructor(id: string, name: string, isActive: boolean, ps1: string | null, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null, startupCommandsPath: StartupCommandsFile | null, extensions: string[]) {
		super(id, name, isActive, pathsPath, startupPath, aliasesPath, startupCommandsPath, extensions);
		this._ps1 = ps1;
	}

	static create(name: string): BashProfile {
		const id: string = uuidv4();
		return new BashProfile(id, name, false, null, null, null, null, null, []);
	}

	static restore(
		id: string,
		name: string,
		isActive: boolean,
		ps1: string | null,
		pathsPath: PathsFile | null,
		startupPath: StartupFile | null,
		aliasesPath: AliasesFile | null,
		startupCommandsFile: StartupCommandsFile | null,
		extensions: string[]): BashProfile {
		const profile: BashProfile = new BashProfile(id, name, isActive, ps1, pathsPath, startupPath, aliasesPath, startupCommandsFile, extensions);
		if (!profile.extensionsValid()) {
			throw new ExtensionsNotValidException();
		}
		return profile;
	}


	get ps1(): string | null {
		return this._ps1;
	}
}
