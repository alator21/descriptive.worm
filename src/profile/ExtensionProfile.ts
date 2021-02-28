import {PathsFile} from "../file/PathsFile";
import {StartupFile} from "../file/StartupFile";
import {AliasesFile} from "../file/AliasesFile";
import {StartupCommandsFile} from "../file/StartupCommandsFile";
import {AbstractProfile} from "./AbstractProfile";
import {ExtensionsNotValidException} from "../exceptions/ExtensionsNotValidException";

export class ExtensionProfile extends AbstractProfile {
	private constructor(id: string, name: string, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null, startupCommandsPath: StartupCommandsFile | null, extensions: string[]) {
		super(
			id,
			name,
			(pathsPath && pathsPath.path) || null,
			(startupPath && startupPath.path) || null,
			(aliasesPath && aliasesPath.path) || null,
			(startupCommandsPath && startupCommandsPath.path) || null,
			extensions
		);
	}

	static restore(id: string, name: string, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null, startupCommandsFile: StartupCommandsFile | null, extensions: string[]): ExtensionProfile {
		const extensionProfile: ExtensionProfile = new ExtensionProfile(id, name, pathsPath, startupPath, aliasesPath, startupCommandsFile, extensions);
		if (!extensionProfile.extensionsValid()) {
			throw new ExtensionsNotValidException();
		}
		return extensionProfile;
	}
}
