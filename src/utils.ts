import {StartShFile} from "./file/StartShFile";
import {ConfigFile} from "./file/ConfigFile";
import {Profile} from "./profile/Profile";
import {BashConfigFile} from "./file/bash/BashConfigFile";
import {BashStartShFile} from "./file/bash/BashStartShFile";
import {BASHRC_PATH, CONFIG_PATH, FISHRC_PATH, STARTSH_PATH} from "./tokens";
import {FishConfigFile} from "./file/fish/FishConfigFile";
import {FishStartShFile} from "./file/fish/FishStartShFile";
import {UnknownShellException} from "./exceptions/UnknownShellException";
import {ShellType} from "./file/ShellType";
import {BashRcFile} from "./file/bash/BashRcFile";
import {FishRcFile} from "./file/fish/FishRcFile";
import {RcFile} from "./file/RcFile";
import {BashProfile} from "./profile/bash/BashProfile";
import {FishProfile} from "./profile/fish/FishProfile";

export function getStartShFile(): StartShFile {
	const shellType: ShellType = ConfigFile.determineShellType(CONFIG_PATH);
	switch (shellType) {
		case ShellType.BASH:
			return new BashStartShFile(STARTSH_PATH, false);
		case ShellType.FISH:
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
	throw new UnknownShellException();
}

export function getRcFile(): RcFile {
	const shellType: ShellType = ConfigFile.determineShellType(CONFIG_PATH);
	switch (shellType) {
		case ShellType.BASH:
			return new BashRcFile(BASHRC_PATH);
		case ShellType.FISH:
			return new FishRcFile(FISHRC_PATH);
	}
	throw new UnknownShellException();
}

export function createProfile(profileName: string): Profile {
	const shellType: ShellType = ConfigFile.determineShellType(CONFIG_PATH);
	switch (shellType) {
		case ShellType.BASH:
			return BashProfile.create(profileName);
		case ShellType.FISH:
			return FishProfile.create(profileName);
	}
	throw new UnknownShellException();
}

export function refreshStartSh(): void {
	const config: ConfigFile = getConfigFile();
	const activeProfile: Profile | null = config.getActive();
	if (activeProfile == null) {
		return;
	}
	const startSh: StartShFile = getStartShFile();
	startSh.refresh(activeProfile);
}
