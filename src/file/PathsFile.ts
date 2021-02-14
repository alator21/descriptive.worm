import {SystemFile} from "./SystemFile";
import {PathFileWrongFormatException} from "../exceptions/PathFileWrongFormatException";

export class PathsFile extends SystemFile {
	private readonly _paths: string[];


	constructor(path: string, touch?: boolean) {
		super(path);
		if (touch) {
			this.touch();
		}
		let pathFile: string = this.read();

		let paths: any[] = JSON.parse(pathFile);
		if (!Array.isArray(paths)) {
			throw new PathFileWrongFormatException();
		}
		for (let p of paths) {
			if (typeof p !== 'string') {
				throw new PathFileWrongFormatException();
			}
		}
		this._paths = paths;
	}

	get paths(): string[] {
		return this._paths;
	}

	touch() {
		super.touch();
		super.writeSync('[\n\n]');
	}
}
