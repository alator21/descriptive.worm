import path from 'path';
import os from 'os'

export class SystemPath {
	private readonly _originalPath: string;
	private readonly _expandedPath: string;


	constructor(originalPath: string) {
		this._originalPath = originalPath;
		this._expandedPath = SystemPath.expandHomeDirectory(originalPath);
	}


	get originalPath(): string {
		return this._originalPath;
	}

	get expandedPath(): string {
		return this._expandedPath;
	}

	private static expandHomeDirectory(originalPath: string): string {
		const homedir: string = os.homedir();
		if (!originalPath) return originalPath;
		if (originalPath === '~') return homedir;
		if (originalPath.slice(0, 2) != '~/') return originalPath;
		return path.join(homedir, originalPath.slice(2));
	}
}
