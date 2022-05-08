import {StartShFile} from "./file/StartShFile";
import {ConfigFile} from "./file/ConfigFile";
import {Profile} from "./profile/Profile";
import {NoActiveProfileException} from "./exceptions/NoActiveProfileException";
import {BashConfigFile} from "./file/bash/BashConfigFile";
import {BashStartShFile} from "./file/bash/BashStartShFile";
import {CONFIG_PATH, STARTSH_PATH} from "./tokens";
import {FishConfigFile} from "./file/fish/FishConfigFile";
import {FishStartShFile} from "./file/fish/FishStartShFile";
import {UnknownShellException} from "./exceptions/UnknownShellException";
import {ShellType} from "./file/ShellType";

export function getStartShFile(): StartShFile {
	const config: ConfigFile = getConfigFile();
	const activeProfile: Profile | null = config.getActive();
	if (activeProfile == null) {
		throw new NoActiveProfileException();
	}

	if (config instanceof BashConfigFile) {
		return new BashStartShFile(STARTSH_PATH, false);
	} else if (config instanceof FishConfigFile) {
		return new FishStartShFile(STARTSH_PATH, false);
	}
	throw new UnknownShellException();
}

export function getConfigFile(): ConfigFile {
	const shellType: ShellType = ConfigFile.determineShellType(CONFIG_PATH);
	switch (shellType) {
		case ShellType.BASH:
			return new BashConfigFile(CONFIG_PATH, false);
		case ShellType.FISH:
			return new FishConfigFile(CONFIG_PATH, false);
	}
}

export function refreshStartSh() {
	const config: ConfigFile = getConfigFile();

	const activeProfile: Profile | null = config.getActive();
	if (activeProfile == null) {
		return;
	}
	const startSh: StartShFile = getStartShFile();
	startSh.refresh(activeProfile);
}
