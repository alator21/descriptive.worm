import {SystemFile} from "./SystemFile";
import {PathsFile} from "./PathsFile";
import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import {ConfigFileWrongFormatException} from "../exceptions/ConfigFileWrongFormatException";
import {StartupCommandsFile} from "./StartupCommandsFile";
import {table} from "table";
import {Profile} from "../Profile";
const chalk = require('chalk');

export class ConfigFile extends SystemFile {
    private readonly _profiles: Map<string/*profileId*/, Profile>;


    constructor(path: string, touch?: boolean) {
        super(path);
        try {
            if (touch) {
                this.touch();
            }
            const configFile: string = this.read();
            const json = JSON.parse(configFile);
            const profiles: Map<string, Profile> = new Map<string, Profile>();
            for (let key of Object.keys(json)) {
                let profileJson = json[key];
                let {
                    _id,
                    _name,
                    _startupFile,
                    _aliasesFile,
                    _isActive,
                    _ps1,
                    _pathsFile,
                    _startupCommandsFile,
                    _extensions
                } = profileJson;
                profiles
                    .set(_id, Profile.restore(
                        _id,
                        _name,
                        _isActive,
                        _ps1,
                        new PathsFile(_pathsFile),
                        new StartupFile(_startupFile),
                        new AliasesFile(_aliasesFile),
                        new StartupCommandsFile(_startupCommandsFile),
                        _extensions
                    ));
            }
            this._profiles = profiles;
        } catch (exception) {
            if (exception instanceof SyntaxError) {
                throw new ConfigFileWrongFormatException();
            }
            throw exception;
        }
    }

    getActive(): Profile | null {
        for (let profile of this._profiles.values()) {
            if (profile.isActive) {
                return profile;
            }
        }
        return null;
    }

    addProfile(profile: Profile): void {
        const p = this._profiles.get(profile.id);
        if (p != null) {
            return;
        }
        if (profile.isActive) {
            for (let prof of this._profiles.values()) {
                if (prof.isActive) {
                    prof.disable();
                    break;
                }
            }
        }
        this._profiles.set(profile.id, profile);
    }

    touch() {
        super.touch();
        super.writeSync('[\n\n]');
    }


    write() {
        let output: string = JSON.stringify(Array.from(this._profiles.values()), null, 2);
        super.writeSync(output);
    }

    printProfilesToConsole() {
        let output: any[] = [];
        for (let profile of this._profiles.values()) {
            output.push({
                'id': chalk.blue(profile.id),
                'name': chalk.yellow(profile.name),
                'ps1': `${(profile.ps1 && (chalk.cyan(profile.ps1.substring(0, 20)) + chalk.red('...')) || '')}`,
                'paths': chalk.yellow(profile.pathsFile),
                'startup': chalk.yellow(profile.startupFile),
                'aliases': chalk.yellow(profile.aliasesFile),
                'startup-commands': chalk.yellow(profile.startupCommandsFile),
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


    get profiles(): Map<string, Profile> {
        return this._profiles;
    }
}
