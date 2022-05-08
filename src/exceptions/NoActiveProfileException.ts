import {Exception} from "./Exception";

export class NoActiveProfileException extends Exception {

	constructor() {
		super();
	}


	toString(): string {
		return `NoActiveProfileException`;
	}
}
