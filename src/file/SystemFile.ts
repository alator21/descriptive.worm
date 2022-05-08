import fs from "fs";
import {FileDoesNotExistException} from "../exceptions/FileDoesNotExistException";
import {SystemPath} from "../utilities/SystemPath";
import log from "loglevel";

export class SystemFile {
	private readonly _path: string;
	private readonly _expandedPath: string;

	constructor(path: string) {
		const systemPath: SystemPath = new SystemPath(path);
		this._path = systemPath.originalPath;
		this._expandedPath = systemPath.expandedPath;
		log.debug(`SystemFile: ${this._path}`);
	}

	get path(): string {
		return this._path;
	}

	get expandedPath(): string {
		return this._expandedPath;
	}

	private static writeFileSyncRecursive(filename: string, content: string): void {
		// -- normalize path separator to '/' instead of path.sep,
		// -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
		let filepath = filename.replace(/\\/g, '/');

		// -- preparation to allow absolute paths as well
		let root = '';
		if (filepath[0] === '/') {
			root = '/';
			filepath = filepath.slice(1);
		} else if (filepath[1] === ':') {
			root = filepath.slice(0, 3);   // c:\
			filepath = filepath.slice(3);
		}

		// -- create folders all the way down
		const folders = filepath.split('/').slice(0, -1);  // remove last item, file
		folders.reduce(
			(acc, folder) => {
				const folderPath = acc + folder + '/';
				if (!fs.existsSync(folderPath)) {
					fs.mkdirSync(folderPath);
				}
				return folderPath
			},
			root // first 'acc', important
		);

		// -- write file
		fs.writeFileSync(root + filepath, content, 'utf8');
	}

	exists(): boolean {
		return fs.existsSync(this._expandedPath);
	}

	isFile(): boolean {
		if (!this.exists()) {
			return false;
		}
		const stats = fs.lstatSync(this._expandedPath);
		return stats.isFile();
	}

	touch(): void {
		if (this.exists()) {
			return;
		}
		SystemFile.writeFileSyncRecursive(this._expandedPath, '\n');
	}

	writeSync(data: string): void {
		if (!this.isFile()) {
			return;
		}

		SystemFile.writeFileSyncRecursive(this._expandedPath, data);
	}

	appendSync(data: string): void {
		if (!this.isFile()) {
			return;
		}
		fs.appendFileSync(this._expandedPath, data)
	}

	read(): string {
		if (!this.isFile()) {
			throw new FileDoesNotExistException(this._expandedPath);
		}
		return fs.readFileSync(this._expandedPath, 'utf8');
	}

}
