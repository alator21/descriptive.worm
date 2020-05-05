import {FilePath} from "./FilePath";
import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";
import {PathsFile} from "./PathsFile";
import {ExtensionProfile} from "./ExtensionProfile";

export class ExtensionConfigFile {
    private readonly _path: string;
    private readonly _profile: ExtensionProfile;


    private constructor(path: string, profile: ExtensionProfile) {
        this._path = path;
        this._profile = profile;
    }

    static create(path: string): ExtensionConfigFile {
        let filePath: FilePath = FilePath.create(path);
        if (!filePath.isValid()) {
            throw new FilePathIsNotValidException(path);
        }
        let extensionConfigFile: string = filePath.readSync();

        let profileJson = JSON.parse(extensionConfigFile);
        let {_id, _name, _startupFile, _aliasesFile, _pathsFile, _extensions} = profileJson;
        let profile: ExtensionProfile = ExtensionProfile.restore(_id, _name, PathsFile.create(_pathsFile), StartupFile.create(_startupFile), AliasesFile.create(_aliasesFile), _extensions);
        return new ExtensionConfigFile(path, profile);
    }


    get path(): string {
        return this._path;
    }

    get profile(): ExtensionProfile {
        return this._profile;
    }
}