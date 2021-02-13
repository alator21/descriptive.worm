import {v4 as uuidv4} from 'uuid';
import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import {PathsFile} from "./PathsFile";
import {ExtensionConfigFile} from "./ExtensionConfigFile";
import {StartupCommandsFile} from "./StartupCommandsFile";

export class Profile {
    private readonly _id: string;
    private _name: string;
    private _isActive: boolean;
    private _ps1: string | null;
    private _pathsFile: string | null;
    private _startupFile: string | null;
    private _aliasesFile: string | null;
    private _startupCommandsFile: string | null;
    private _extensions: string[];


    private constructor(id: string, name: string, isActive: boolean, ps1: string | null, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null, startupCommandsFile: StartupCommandsFile | null, extensions: string[]) {
        this._id = id;
        this._name = name;
        this._isActive = isActive;
        this._ps1 = ps1;
        this._pathsFile = (pathsPath && pathsPath.filePath.path) || null;
        this._startupFile = (startupPath && startupPath.filePath.path) || null;
        this._aliasesFile = (aliasesPath && aliasesPath.filePath.path) || null;
        this._startupCommandsFile = (startupCommandsFile && startupCommandsFile.filePath.path) || null;
        this._extensions = extensions;
    }


    static create(name: string): Profile {
        const id: string = uuidv4();
        return new Profile(id, name, false, null, null, null, null, null, []);
    }

    static restore(id: string, name: string, isActive: boolean, ps1: string | null, pathsPath: PathsFile | null, startupPath: StartupFile | null, aliasesPath: AliasesFile | null, startupCommandsFile: StartupCommandsFile | null, extensions: string[]): Profile {
        return new Profile(id, name, isActive, ps1, pathsPath, startupPath, aliasesPath, startupCommandsFile, extensions);
    }

    setPs1(ps1: string | null) {
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
        this._startupFile = startupPath.filePath.path;
    }

    updateAliasesPath(aliasesPath: AliasesFile): void {
        this._aliasesFile = aliasesPath.filePath.path;
    }

    updatePathsPath(pathsPath: PathsFile): void {
        this._pathsFile = pathsPath.filePath.path;
    }

    updateStartupCommandsPath(startupCommandsPath: StartupCommandsFile): void {
        this._startupCommandsFile = startupCommandsPath.filePath.path;
    }

    addExtension(extensionPath: string) {
        if (this._extensions.includes(extensionPath)){
            return;
        }
        this._extensions.push(extensionPath);
    }


    // addExtension(profile: Profile): void {
    //     if (this.extensionExist(profile.id)) {
    //         return;
    //     }
    //     this._extensions.push(profile);
    // }
    //
    // removeExtension(profileId: string): void {
    //     if (!this.extensionExist(profileId)) {
    //         return;
    //     }
    //     for (let i = 0; i < this._extensions.length; i++) {
    //         let extension: Profile = this._extensions[i];
    //         if (extension.id === profileId) {
    //             this._extensions.slice(i, 1);
    //             break;
    //         }
    //     }
    // }

    // private extensionExist(profileId: string) {
    //     for (let extension of this._extensions) {
    //         if (extension.id === profileId) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    static getStartupPaths(startupsFilePath: string | null, extensions: string[]): string[] {
        let startupFile: StartupFile = new StartupFile(startupsFilePath);

        let paths: string[] = startupFile.startupPaths;

        for (let extension of extensions) {
            let extensionConfig: ExtensionConfigFile = new ExtensionConfigFile(extension);
            let extensionPathsFilePath = extensionConfig.profile.startupFile;
            let extensionExtensions = extensionConfig.profile.extensions;
            paths.push(...this.getStartupPaths(extensionPathsFilePath, extensionExtensions));
        }
        return paths;
    }

    static getPaths(pathsFilePath: string | null, extensions: string[]): string[] {
        let pathsFile: PathsFile = new PathsFile(pathsFilePath);

        let paths: string[] = pathsFile.paths;

        for (let extension of extensions) {
            let extensionConfig: ExtensionConfigFile = new ExtensionConfigFile(extension);
            let extensionPathsFilePath = extensionConfig.profile.pathsFile;
            let extensionExtensions = extensionConfig.profile.extensions;
            paths.push(...this.getPaths(extensionPathsFilePath, extensionExtensions));
        }
        return paths;
    }

    static getAliases(aliasesFilePath: string | null, extensions: string[]): Map<string, string> {
        let aliasesFile: AliasesFile = new AliasesFile(aliasesFilePath);

        let aliases: Map<string, string> = aliasesFile.aliases;
        for (let extension of extensions) {
            let extensionConfig: ExtensionConfigFile = new ExtensionConfigFile(extension);
            let extensionAliasesFilePath = extensionConfig.profile.aliasesFile;
            let extensionExtensions = extensionConfig.profile.extensions;
            this.getAliases(extensionAliasesFilePath, extensionExtensions).forEach((value, key) => {
                aliases.set(key, value);
            });
        }
        return aliases;
    }

    static getStartupCommands(startupCommandsFilePath: string | null, extensions: string[]): string[] {
        let startupCommandsFile: StartupCommandsFile = new StartupCommandsFile(startupCommandsFilePath);

        let paths: string[] = startupCommandsFile.startupCommands;

        for (let extension of extensions) {
            let extensionConfig: ExtensionConfigFile = new ExtensionConfigFile(extension);
            let extensionPathsFilePath = extensionConfig.profile.startupFile;
            let extensionExtensions = extensionConfig.profile.extensions;
            paths.push(...this.getStartupPaths(extensionPathsFilePath, extensionExtensions));
        }
        return paths;
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

    get startupCommandsFile(): string | null {
        return this._startupCommandsFile;
    }

    get extensions(): string[] {
        return this._extensions;
    }
}
