import {v4 as uuidv4} from 'uuid';
import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import {PathsFile} from "./PathsFile";

export class Profile {
    private readonly _id: string;
    private _name: string;
    private _isActive: boolean;
    private _ps1: string | null;
    private _pathsFile: string | null;
    private _startupFile: string | null;
    private _aliasesFile: string | null;


    private constructor(id: string, name: string, isActive: boolean, ps1: string | null, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null) {
        this._id = id;
        this._name = name;
        this._isActive = isActive;
        this._ps1 = ps1;
        this._pathsFile = (pathsPath && pathsPath.path) || null;
        this._startupFile = (startupPath && startupPath.path) || null;
        this._aliasesFile = (aliasesPath && aliasesPath.path) || null;
    }


    static create(name: string): Profile {
        const id: string = uuidv4();
        return new Profile(id, name, false, null, null, null, null);
    }

    static restore(id: string, name: string, isActive: boolean, ps1: string | null, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null): Profile {
        return new Profile(id, name, isActive, ps1, pathsPath, startupPath, aliasesPath);
    }

    setPs1(ps1: string) {
        this._ps1 = ps1;
    }

    setActive(): void {
        this._isActive = true;
    }

    disable(): void {
        this._isActive = false;
    }

    updateName(name: string): void {
        this._name = name;
    }

    updateStartupPath(startupPath: StartupFile): void {
        this._startupFile = startupPath.path;
    }

    updateAliasesPath(aliasesPath: AliasesFile): void {
        this._aliasesFile = aliasesPath.path;
    }

    updatePathsPath(pathsPath: PathsFile): void {
        this._pathsFile = pathsPath.path;
    }


    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get isActive(): boolean {
        return this._isActive;
    }


    get ps1(): string | null {
        return this._ps1;
    }


    get pathsFile(): string | null {
        return this._pathsFile;
    }

    get startupFile(): string | null {
        return this._startupFile;
    }

    get aliasesFile(): string | null {
        return this._aliasesFile;
    }
}