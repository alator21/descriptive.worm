import {v4 as uuidv4} from 'uuid';
import {PathsFile} from "../file/PathsFile";
import {StartupFile} from "../file/StartupFile";
import {AliasesFile} from "../file/AliasesFile";
import {StartupCommandsFile} from "../file/StartupCommandsFile";
import {ExtensionConfigFile} from "../file/ExtensionConfigFile";
import {AbstractProfile} from "./AbstractProfile";
import {ExtensionProfile} from "./ExtensionProfile";
import {ExtensionsNotValidException} from "../exceptions/ExtensionsNotValidException";

export class Profile extends AbstractProfile {
	private _isActive: boolean;
	private _ps1: string | null;

	private constructor(id: string, name: string, isActive: boolean, ps1: string | null, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null, startupCommandsPath: StartupCommandsFile | null, extensions: string[]) {
		super(
			id,
			name,
			(pathsPath && pathsPath.path) || null,
			(startupPath && startupPath.path) || null,
			(aliasesPath && aliasesPath.path) || null,
			(startupCommandsPath && startupCommandsPath.path) || null,
			extensions
		)
		this._isActive = isActive;
		this._ps1 = ps1;
	}

	static create(name: string): Profile {
		const id: string = uuidv4();
		return new Profile(id, name, false, null, null, null, null, null, []);
	}

	static restore(
		id: string,
		name: string,
		isActive: boolean,
		ps1: string | null,
		pathsPath: PathsFile,
		startupPath: StartupFile | null,
		aliasesPath: AliasesFile | null,
		startupCommandsFile: StartupCommandsFile | null,
		extensions: string[]): Profile {
		const profile: Profile = new Profile(id, name, isActive, ps1, pathsPath, startupPath, aliasesPath, startupCommandsFile, extensions);
		if (!profile.extensionsValid()) {
			throw new ExtensionsNotValidException();
		}
		return profile;
	}


	//
	// addExtension(extensionPath: string) {
	//     if (this._extensions.includes(extensionPath)){
	//         return;
	//     }
	//     this._extensions.push(extensionPath);
	// }


	// addExtension(profile: Profile): void {
	//     if (this.extensionExist(profile.id)) {
	//         return;
	//     }
	//     this._extensions.push(profile);
	// }
	//
	// removeExtension(profileId: string): void {
	//     if (!this.extensionExist(profileId)) {
	//         return;
	//     }
	//     for (let i = 0; i < this._extensions.length; i++) {
	//         let extension: Profile = this._extensions[i];
	//         if (extension.id === profileId) {
	//             this._extensions.slice(i, 1);
	//             break;
	//         }
	//     }
	// }

	// private extensionExist(profileId: string) {
	//     for (let extension of this._extensions) {
	//         if (extension.id === profileId) {
	//             return true;
	//         }
	//     }
	//     return false;
	// }

	setActive(): void {
		this._isActive = true;
	}

	disable(): void {
		this._isActive = false;
	}

	static calculatePaths(pathsFilePath: string | null, extensions: string[]): string[] {
		const pathsFile: PathsFile | null = ((pathsFilePath != null) && new PathsFile(pathsFilePath)) || null;

		const paths: string[] = (pathsFile && pathsFile.paths) || [];

		for (const extension of extensions) {
			const extensionConfig: ExtensionConfigFile = new ExtensionConfigFile(extension);
			const extensionProfile: ExtensionProfile = extensionConfig.profile;
			const extensionPathsFilePath: string | null = extensionProfile.pathsFile;
			const extensionExtensions: string[] = extensionProfile.extensions;
			paths.push(...this.calculatePaths(extensionPathsFilePath, extensionExtensions));
		}
		return paths;
	}

	static calculateStartupPaths(startupsFilePath: string | null, extensions: string[]): string[] {
		const startupFile: StartupFile | null = ((startupsFilePath != null) && new StartupFile(startupsFilePath)) || null;

		const paths: string[] = (startupFile && startupFile.startupPaths) || [];

		for (const extension of extensions) {
			const extensionConfig: ExtensionConfigFile = new ExtensionConfigFile(extension);
			const extensionProfile: ExtensionProfile = extensionConfig.profile;
			const extensionPathsFilePath = extensionProfile.startupFile;
			const extensionExtensions = extensionProfile.extensions;
			paths.push(...this.calculateStartupPaths(extensionPathsFilePath, extensionExtensions));
		}
		return paths;
	}

	static calculateAliases(aliasesFilePath: string | null, extensions: string[]): Map<string, string> {
		const aliasesFile: AliasesFile | null = ((aliasesFilePath != null) && new AliasesFile(aliasesFilePath)) || null;

		const aliases: Map<string, string> = (aliasesFile && aliasesFile.aliases) || new Map<string, string>();
		for (const extension of extensions) {
			const extensionConfig: ExtensionConfigFile = new ExtensionConfigFile(extension);
			const extensionProfile: ExtensionProfile = extensionConfig.profile;
			const extensionAliasesFilePath = extensionProfile.aliasesFile;
			const extensionExtensions = extensionProfile.extensions;
			this.calculateAliases(extensionAliasesFilePath, extensionExtensions).forEach((value, key) => {
				aliases.set(key, value);
			});
		}
		return aliases;
	}

	static calculateStartupCommands(startupCommandsFilePath: string | null, extensions: string[]): string[] {
		const startupCommandsFile: StartupCommandsFile | null = ((startupCommandsFilePath != null) && new StartupCommandsFile(startupCommandsFilePath)) || null;

		const paths: string[] = (startupCommandsFile && startupCommandsFile.startupCommands) || [];


		for (const extension of extensions) {
			const extensionConfig: ExtensionConfigFile = new ExtensionConfigFile(extension);
			const extensionProfile: ExtensionProfile = extensionConfig.profile;
			const extensionPathsFilePath = extensionProfile.startupFile;
			const extensionExtensions = extensionProfile.extensions;
			paths.push(...this.calculateStartupCommands(extensionPathsFilePath, extensionExtensions));
		}
		return paths;
	}


	get isActive(): boolean {
		return this._isActive;
	}


	get ps1(): string | null {
		return this._ps1;
	}

}
