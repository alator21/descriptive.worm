import fs from "fs";

const expandHomeDir = require('expand-home-dir');

export class SystemFolder {
	private readonly _path: string;
	private readonly _expandedPath: string;


	constructor(path: string) {
		this._path = path;
		this._expandedPath = expandHomeDir(path);
	}

	get path(): string | null {
		return this._path;
	}

	get expandedPath(): string | null {
		return this._expandedPath;
	}

	exists(): boolean {
		return fs.existsSync(this._expandedPath);
	}

	isFolder(): boolean {
		if (!this.exists()) {
			return false;
		}
		const stats = fs.lstatSync(this._expandedPath);
		return stats.isDirectory();
	}

	touch(): void {
		if (this.exists()) {
			return;
		}
		fs.mkdirSync(this._expandedPath, {recursive: true});
	}

	cdTo(): void {
		if (!this.isFolder()) {
			return;
		}
		process.chdir(<string>this._expandedPath);
	}
}
