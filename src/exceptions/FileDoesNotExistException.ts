import {Exception} from "./Exception";

export class FileDoesNotExistException extends Exception {
	private readonly filePath: string;

	constructor(filePath: string) {
		super();
		this.filePath = filePath;
	}


	toString(): string {
		return `File[${this.filePath}] does not exist`;
	}
}
