import {Exception} from "./Exception";

export class ExtensionsNotValidException extends Exception{


	toString(): string {
		return `ExtensionsNotValidException`;
	}
}
