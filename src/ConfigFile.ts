import {Profile} from "./Profile";
import {FilePath} from "./FilePath";
import * as fs from "fs";
import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";
import * as chalk from "chalk";
import {table} from 'table';
import {PathsFile} from "./PathsFile";
import * as expandHomeDir from "expand-home-dir";

export class ConfigFile {
    private readonly _path: string;
    private readonly _profiles: Profile[];


    private constructor(path: string, profiles: Profile[]) {
        this._path = path;
        this._profiles = profiles;
    }

    static create(path: string): ConfigFile {
        let filePath: FilePath = FilePath.create(path);
        if (!filePath.isValid()) {
            throw new FilePathIsNotValidException(path);
        }
        let configFile: string = fs.readFileSync(path, 'utf8');

        let json = JSON.parse(configFile);
        let profiles: Profile[] = []
        for (let key of Object.keys(json)) {
            let profileJson = json[key];
            let {_id, _name, _startupFile, _aliasesFile, _isActive, _ps1, _pathsFile} = profileJson;
            profiles.push(
                Profile.restore(_id, _name, _isActive, _ps1, PathsFile.create(expandHomeDir(_pathsFile)), StartupFile.create(expandHomeDir(_startupFile)), AliasesFile.create(expandHomeDir(_aliasesFile)))
            );
        }

        return new ConfigFile(path, profiles);
    }


    addProfile(profile: Profile): void {
        for (let prof of this._profiles) {
            if (prof.id === profile.id || prof.name === profile.name) {
                return;
            }
        }
        if (profile.isActive) {
            for (let prof of this._profiles) {
                if (prof.isActive) {
                    prof.disable();
                    break;
                }
            }
        }
        this._profiles.push(profile);
    }


    getActive(): Profile | null {
        for (let profile of this._profiles) {
            if (profile.isActive) {
                return profile;
            }
        }
        return null;
    }


    get path(): string {
        return this._path;
    }

    get profiles(): Profile[] {
        return this._profiles;
    }

    writeToDisc() {
        let output: string = JSON.stringify(this.profiles, null, 2);
        // console.log('config--');
        // console.log(output);
        fs.writeFileSync(this._path, output)
    }

    printProfilesToConsole() {
        let output: any[] = [];
        for (let profile of this._profiles) {
            output.push({
                'id': chalk.blue(profile.id),
                'name': chalk.yellow(profile.name),
                'ps1': `${(profile.ps1 && (chalk.cyan(profile.ps1.substring(0, 20)) + chalk.red('...')) || '')}`,
                'paths': chalk.yellow(profile.pathsFile),
                'startup': chalk.yellow(profile.startupFile),
                'aliases': chalk.yellow(profile.aliasesFile),
                'active': chalk.cyan(profile.isActive)
            });
        }
        ConfigFile.printTable(output, {
            headerStyleFn: header => chalk.bold(chalk.red(header))
        });
    }

    private static printTable(data, options) {
        if (!data || !data.length) {
            return;
        }
        options = options || {};
        options.columns = options.columns || Object.keys(data[0]);
        options.headerStyleFn = options.headerStyleFn || chalk.bold;
        const header = options.columns.map(property => options.headerStyleFn(property));
        const config = {

        }
        const tableText = table([
            header,
            ...data.map(item => options.columns.map(property => item[property]))
        ],{
            columnDefault: {
                width: 15
            }
        });
        console.log(tableText);
    }
}