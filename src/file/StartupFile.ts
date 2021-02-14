import {SystemFile} from "./SystemFile";
import {StartupFileWrongFormatException} from "../exceptions/StartupFileWrongFormatException";

export class StartupFile extends SystemFile {
	private readonly _startupPaths: string[];


	constructor(path: string, touch?: boolean) {
		super(path);
		if (touch) {
			this.touch();
		}
		let startupFile: string = this.read();

		let startupPaths: any[] = JSON.parse(startupFile);
		if (!Array.isArray(startupPaths)) {
			throw new StartupFileWrongFormatException();
		}
		for (let p of startupPaths) {
			if (typeof p !== 'string') {
				throw new StartupFileWrongFormatException();
			}
			let startupPath: SystemFile = new SystemFile(p);
			if (!startupPath.isFile()) {
				throw new StartupFileWrongFormatException();
			}
		}
		this._startupPaths = startupPaths;
	}

	get startupPaths(): string[] {
		return this._startupPaths;
	}

	touch() {
		super.touch();
		super.writeSync(`[\n\n]`);
	}
}
