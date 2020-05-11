import {Profile} from "./Profile";
import {FilePath} from "./FilePath";
import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import {table} from 'table';
import {PathsFile} from "./PathsFile";
import {ConfigFileWrongFormatException} from "./exceptions/ConfigFileWrongFormatException";

const chalk = require('chalk');

export class ConfigFile {
    private readonly _path: string | null;
    private readonly _profiles: Profile[];


    private constructor(path: string | null, profiles: Profile[]) {
        this._path = path;
        this._profiles = profiles;
    }

    static create(path: string): ConfigFile {
        let filePath: FilePath = FilePath.create(path);
        if (!filePath.isValid()) {
            filePath.touch();
        }
        let configFile: string = filePath.readSync();

        try{
            let json = JSON.parse(configFile);
            let profiles: Profile[] = []
            for (let key of Object.keys(json)) {
                let profileJson = json[key];
                let {_id, _name, _startupFile, _aliasesFile, _isActive, _ps1, _pathsFile, _extensions} = profileJson;
                profiles.push(
                    Profile.restore(_id, _name, _isActive, _ps1, PathsFile.create(_pathsFile), StartupFile.create(_startupFile), AliasesFile.create(_aliasesFile), _extensions)
                );
            }

            return new ConfigFile(path, profiles);
        }
        catch (exception) {
            if (exception instanceof SyntaxError){
                throw new ConfigFileWrongFormatException();
            }
            throw exception;
        }

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


    get path(): string | null {
        return this._path;
    }

    get profiles(): Profile[] {
        return this._profiles;
    }

    writeToDisc() {
        let output: string = JSON.stringify(this.profiles, null, 2);
        // console.log('config--');
        // console.log(output);
        const configFile: FilePath = FilePath.create(this._path);
        configFile.writeSync(output);
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
                'extensions': chalk.magenta(profile.extensions.join(',')),
                'active': chalk.cyan(profile.isActive)
            });
        }
        ConfigFile.printTable(output, {
            headerStyleFn: (header: any) => chalk.bold(chalk.red(header))
        });
    }

    private static printTable(data: any, options: any) {
        if (!data || !data.length) {
            return;
        }
        options = options || {};
        options.columns = options.columns || Object.keys(data[0]);
        options.headerStyleFn = options.headerStyleFn || chalk.bold;
        const header = options.columns.map((property: any) => options.headerStyleFn(property));
        const tableText = table([
            header,
            ...data.map((item: { [x: string]: any; }) => options.columns.map((property: string | number) => item[property]))
        ], {
            columnDefault: {
                width: 15
            }
        });
        console.log(tableText);
    }
}