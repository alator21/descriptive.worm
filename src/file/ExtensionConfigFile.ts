import {SystemFile} from "./SystemFile";
import {ExtensionProfile} from "../ExtensionProfile";
import {PathsFile} from "./PathsFile";
import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import {StartupCommandsFile} from "./StartupCommandsFile";

export class ExtensionConfigFile extends SystemFile {
	private readonly _profile: ExtensionProfile;


	constructor(path: string) {
		super(path);
		let extensionConfigFile: string = this.read();

		let profileJson = JSON.parse(extensionConfigFile);
		let {_id, _name, _startupFile, _aliasesFile, _pathsFile, _startupCommandsFile, _extensions} = profileJson;
		this._profile = ExtensionProfile.restore(
			_id, _name,
			new PathsFile(_pathsFile),
			new StartupFile(_startupFile),
			new AliasesFile(_aliasesFile),
			new StartupCommandsFile(_startupCommandsFile),
			_extensions);
	}

	get profile(): ExtensionProfile {
		return this._profile;
	}
}
