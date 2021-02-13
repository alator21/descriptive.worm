import {StartShFile} from "./StartShFile";
import {BashRcFile} from "./BashRcFile";
import {ConfigFile} from "./ConfigFile";
import {Profile} from "./Profile";
import {ProfileNameAlreadyExists} from "./exceptions/ProfileNameAlreadyExists";
import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import * as  readlineSync from "readline-sync";
import {ProfileNameDoesNotExist} from "./exceptions/ProfileNameDoesNotExist";
import {PathsFile} from "./PathsFile";
import {Exception} from "./exceptions/Exception";
import {StartupCommandsFile} from "./StartupCommandsFile";
import commandLineArgs = require('command-line-args');

export class Menu {


    private constructor(BASHRC_PATH: string, STARTSH_PATH: string, DEFAULT_CONFIG_PATH: string, DEFAULT_PROFILES_PATH: string) {
        const optionDefinitions = [
            {name: `init`, alias: `i`, type: Boolean},
            {name: `list`, alias: `l`, type: Boolean},
            {name: `new-profile`, alias: `n`, type: Boolean},
            {name: `new-empty`, type: Boolean},
            {name: `add-extension`, multiple: true, type: String},
            {name: `refresh`, alias: `r`, type: Boolean},
            {name: `enable`, alias: `e`, type: String},
            {name: `help`, alias: `h`, type: Boolean}
        ]
        try {
            const options = commandLineArgs(optionDefinitions);
            // console.log(options);
            if (options[`init`]) {
                this.init(BASHRC_PATH, STARTSH_PATH);
            } else if (options[`list`]) {
                this.list(DEFAULT_CONFIG_PATH);
            } else if (options[`new-profile`]) {
                this.newProfile(DEFAULT_CONFIG_PATH, STARTSH_PATH);
            } else if (options[`new-empty`]) {
                this.newEmptyProfile(DEFAULT_CONFIG_PATH, STARTSH_PATH, DEFAULT_PROFILES_PATH);
            } else if (options[`add-extension`]) {
                this.addExtensionToProfile(DEFAULT_CONFIG_PATH, STARTSH_PATH, options['add-extension']);
            } else if (options['refresh']) {
                this.refresh(DEFAULT_CONFIG_PATH, STARTSH_PATH);
            } else if (options['enable']) {
                this.enableProfile(options['enable'], DEFAULT_CONFIG_PATH, STARTSH_PATH);
            } else if (options['help']) {
                this.help();
            }
        } catch (exception) {
            if (exception instanceof Exception) {
                console.error(exception.toString());
                process.exit(1);
            }
            console.error(exception);
            process.exit(1);
        }
    }

    static create(BASHRC_PATH: string, STARTSH_PATH: string, DEFAULT_CONFIG_PATH: string, DEFAULT_PROFILES_PATH: string): Menu {
        return new Menu(BASHRC_PATH, STARTSH_PATH, DEFAULT_CONFIG_PATH, DEFAULT_PROFILES_PATH);
    }


    private init(BASHRC_PATH: string, STARTSH_PATH: string): void {
        const startShFile: StartShFile = new StartShFile(STARTSH_PATH);
        startShFile.touch();
        const bashRcFile: BashRcFile = new BashRcFile(BASHRC_PATH);
        bashRcFile.appendSourceStart(STARTSH_PATH);
    }

    private list(DEFAULT_CONFIG_PATH: string): void {
        let config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
        config.printProfilesToConsole();
    }

    private newProfile(DEFAULT_CONFIG_PATH: string, STARTSH_PATH: string): void {
        let config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
        let profiles: Profile[] = config.profiles;

        let profileNameFromUser: string = readlineSync.question(`Profile name: `);
        const profileName: string = profileNameFromUser.trim();
        for (let prof of profiles) {
            if (prof.name === profileName) {
                throw new ProfileNameAlreadyExists();
            }
        }
        let newProfile: Profile = Profile.create(profileName);

        let startupPathFromUser: string = readlineSync.question(`Startup path: `);
        const startupFile: StartupFile = new StartupFile(startupPathFromUser);
        newProfile.updateStartupPath(startupFile);


        let aliasesPathFromUser: string = readlineSync.question(`Aliases path: `);
        const aliasesFile: AliasesFile = new AliasesFile(aliasesPathFromUser);
        newProfile.updateAliasesPath(aliasesFile);

        let pathsPathFromUser: string = readlineSync.question(`Paths path: `);
        const pathsFile: PathsFile = new PathsFile(pathsPathFromUser);
        newProfile.updatePathsPath(pathsFile);


        let ps1FromUser: string = readlineSync.question('PS1(or empty for default)');
        newProfile.setPs1(((ps1FromUser !== '') && ps1FromUser) || null);

        let activeProfile: Profile | null = config.getActive();
        newProfile.setActive();
        if (activeProfile != null) {
            console.warn(`There is already an active profile with name:${activeProfile.name}.`)
            let activateNew: string = readlineSync.question(`Want to activate this new one instead?(y/n): `);
            if (activateNew !== `y`) {
                newProfile.disable();
            }
        }


        config.addProfile(newProfile);

        config.write();
        startupFile.write();
        aliasesFile.write();

        const startSh: StartShFile = new StartShFile(STARTSH_PATH);
        if (activeProfile == null) {
            return;
        }
        startSh.refresh(activeProfile);
    }

    private newEmptyProfile(DEFAULT_CONFIG_PATH: string, STARTSH_PATH: string, DEFAULT_PROFILES_PATH: string) {
        let config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
        let profiles: Profile[] = config.profiles;

        let profileNameFromUser: string = readlineSync.question(`Profile name: `);
        const profileName: string = profileNameFromUser.trim();
        for (let prof of profiles) {
            if (prof.name === profileName) {
                throw new ProfileNameAlreadyExists();
            }
        }
        let profilePath: string = `${DEFAULT_PROFILES_PATH}/${profileName}`;

        let newProfile: Profile = Profile.create(profileName);
        newProfile.updatePathsPath(PathsFile.empty(`${profilePath}/paths.json`));
        newProfile.updateStartupPath(StartupFile.empty(`${profilePath}/startup.json`));
        newProfile.updateAliasesPath(AliasesFile.empty(`${profilePath}/aliases.json`));
        newProfile.updateStartupCommandsPath(StartupCommandsFile.empty(`${profilePath}/startup-commands.json`));
        config.addProfile(newProfile);

        config.write();
    }

    private addExtensionToProfile(DEFAULT_CONFIG_PATH: string, STARTSH_PATH: string, options: [string, string]) {
        const profileName: string = options[0];
        const extensionPath: string = options[1];
        let config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
        const profile: Profile | undefined = config.profiles.find(profile => {
            return profile.name === profileName
        })
        if (profile == null) {
            return;
        }
        profile.addExtension(extensionPath);

        config.write();
        this.refresh(DEFAULT_CONFIG_PATH, STARTSH_PATH);
    }

    private refresh(DEFAULT_CONFIG_PATH: string, STARTSH_PATH: string): void {
        let config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
        let activeProfile: Profile | null = config.getActive();
        if (activeProfile == null) {
            return;
        }
        const startSh: StartShFile = new StartShFile(STARTSH_PATH);
        startSh.refresh(activeProfile);
    }

    private enableProfile(profileName: string, DEFAULT_CONFIG_PATH: string, STARTSH_PATH: string): void {

        let config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
        let profiles: Profile[] = config.profiles;

        let activeProfile: Profile | null = config.getActive();
        if (activeProfile != null) {
            activeProfile.disable();
        }
        let profileNameExists: boolean = false;
        for (let profile of profiles) {
            if (profile.name === profileName) {
                profile.setActive();
                profileNameExists = true;
                break;
            }
        }
        if (!profileNameExists) {
            throw new ProfileNameDoesNotExist();
        }

        config.write();
        if (activeProfile == null) {
            return;
        }
        const startSh: StartShFile = new StartShFile(STARTSH_PATH);
        startSh.refresh(activeProfile);
    }

    private help(): void {
        console.log('HELP-blabla');
    }
}
