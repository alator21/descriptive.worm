import {SystemFile} from "../file/SystemFile";
import {PathsFile} from "../file/PathsFile";
import {ExtensionConfigFile} from "../file/ExtensionConfigFile";
import {StartupFile} from "../file/StartupFile";
import {AliasesFile} from "../file/AliasesFile";
import {StartupCommandsFile} from "../file/StartupCommandsFile";

export abstract class AbstractProfile {
	private readonly _id: string;
	private _name: string;
	private _pathsFile: string | null;
	private _startupFile: string | null;
	private _aliasesFile: string | null;
	private _startupCommandsFile: string | null;
	private readonly _extensions: string[];


	protected constructor(id: string, name: string, pathsFile: string | null, startupFile: string | null, aliasesFile: string | null, startupCommandsFile: string | null, extensions: string[]) {
		this._id = id;
		this._name = name;
		this._pathsFile = pathsFile;
		this._startupFile = startupFile;
		this._aliasesFile = aliasesFile;
		this._startupCommandsFile = startupCommandsFile;
		this._extensions = extensions;
	}

	extensionsValid(): boolean {
		for (const extension of this._extensions) {
			const extensionFile: SystemFile = new SystemFile(extension);
			if (!extensionFile.isFile()) {
				return false;
			}
		}
		return true;
	}


	updateName(name: string): void {
		this._name = name;
	}

	updateStartupPath(startupPath: StartupFile): void {
		this._startupFile = startupPath.path;
	}

	updateAliasesPath(aliasesPath: AliasesFile): void {
		this._aliasesFile = aliasesPath.path;
	}

	updatePathsPath(pathsPath: PathsFile): void {
		this._pathsFile = pathsPath.path;
	}

	updateStartupCommandsPath(startupCommandsPath: StartupCommandsFile): void {
		this._startupCommandsFile = startupCommandsPath.path;
	}


	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get pathsFile(): string | null {
		return this._pathsFile;
	}

	get startupFile(): string | null {
		return this._startupFile;
	}

	get aliasesFile(): string | null {
		return this._aliasesFile;
	}

	get startupCommandsFile(): string | null {
		return this._startupCommandsFile;
	}

	get extensions(): string[] {
		return this._extensions;
	}
}
