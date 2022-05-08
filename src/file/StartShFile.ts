import {SystemFile} from "./SystemFile";
import {Profile} from "../profile/Profile";
import log from "loglevel";

export abstract class StartShFile extends SystemFile {

	protected constructor(path: string, touch?: boolean) {
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
		this.update(profile);
	}

	abstract update(profile: Profile): void;

	print(): void {
		if (!this.exists()) {
			log.warn(`Couldn't find the start.sh file.`)
			return;
		}
		console.log(this.read()); //TODO implement a better and more friendly print version
	}
}
