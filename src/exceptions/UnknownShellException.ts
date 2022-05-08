import {Exception} from "./Exception";

export class UnknownShellException extends Exception {

	constructor() {
		super();
	}


	toString(): string {
		return `UnknownShellException`;
	}
}
