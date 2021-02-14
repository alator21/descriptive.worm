import {Exception} from "./Exception";

export class FolderAlreadyExistsException extends Exception {
	private readonly folderPath: string;

	constructor(folderPath: string) {
		super();
		this.folderPath = folderPath;
	}


	toString(): string {
		return `Folder[${this.folderPath}] already exists`;
	}
}
