import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import {PathsFile} from "./PathsFile";

export class ExtensionProfile {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _pathsFile: string | null;
    private readonly _startupFile: string | null;
    private readonly _aliasesFile: string | null;
    private readonly _extensions: string[];


    private constructor(id: string, name: string, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null, extensions: string[]) {
        this._id = id;
        this._name = name;
        this._pathsFile = (pathsPath && pathsPath.path) || null;
        this._startupFile = (startupPath && startupPath.path) || null;
        this._aliasesFile = (aliasesPath && aliasesPath.path) || null;
        this._extensions = extensions;
    }

    static restore(id: string, name: string, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null, extensions: string[]): ExtensionProfile {
        return new ExtensionProfile(id, name, pathsPath, startupPath, aliasesPath, extensions);
    }


    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
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

    get extensions(): string[] {
        return this._extensions;
    }
}