import {SystemFile} from "./SystemFile";

export abstract class RcFile extends SystemFile {


	protected constructor(path: string) {
		super(path);
	}

	abstract config(): void;

}
