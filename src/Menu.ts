import {StartShFile} from "./StartShFile";
import {BashRcFile} from "./BashRcFile";
import {ConfigFile} from "./ConfigFile";
import {Profile} from "./Profile";
import {ProfileNameAlreadyExists} from "./exceptions/ProfileNameAlreadyExists";
import {StartupFile} from "./StartupFile";
import {AliasesFile} from "./AliasesFile";
import * as  readlineSync from "readline-sync";
import {ProfileNameDoesNotExist} from "./exceptions/ProfileNameDoesNotExist";
import commandLineArgs = require('command-line-args');
import {PathsFile} from "./PathsFile";
import {Exception} from "./exceptions/Exception";

export class Menu {


    private constructor(BASHRC_PATH: string, STARTSH_PATH: string, DEFAULT_CONFIG_PATH: string) {
        const optionDefinitions = [
            {name: `init`, alias: `i`, type: Boolean},
            {name: `list`, alias: `l`, type: Boolean},
            {name: `new-profile`, alias: `n`, type: Boolean},
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

    static create(BASHRC_PATH: string, STARTSH_PATH: string, DEFAULT_CONFIG_PATH: string): Menu {
        return new Menu(BASHRC_PATH, STARTSH_PATH, DEFAULT_CONFIG_PATH);
    }


    private init(BASHRC_PATH: string, STARTSH_PATH: string): void {
        const startShFile: StartShFile = StartShFile.create(STARTSH_PATH);
        startShFile.touch();
        const bashRcFile: BashRcFile = BashRcFile.create(BASHRC_PATH);
        bashRcFile.appendSourceStart(STARTSH_PATH);
    }

    private list(DEFAULT_CONFIG_PATH: string): void {
        let config: ConfigFile = ConfigFile.create(DEFAULT_CONFIG_PATH);
        config.printProfilesToConsole();
    }

    private newProfile(DEFAULT_CONFIG_PATH: string, STARTSH_PATH: string): void {
        let config: ConfigFile = ConfigFile.create(DEFAULT_CONFIG_PATH);
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
        const startupFile: StartupFile = StartupFile.create(startupPathFromUser);
        newProfile.updateStartupPath(startupFile);


        let aliasesPathFromUser: string = readlineSync.question(`Aliases path: `);
        const aliasesFile: AliasesFile = AliasesFile.create(aliasesPathFromUser);
        newProfile.updateAliasesPath(aliasesFile);

        let pathsPathFromUser: string = readlineSync.question(`Paths path: `);
        const pathsFile: PathsFile = PathsFile.create(pathsPathFromUser);
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

        config.writeToDisc();
        startupFile.writeToDisc();
        aliasesFile.writeToDisc();

        const startSh: StartShFile = StartShFile.create(STARTSH_PATH);
        if (activeProfile == null) {
            return;
        }
        startSh.refresh(activeProfile, STARTSH_PATH);
    }

    private refresh(DEFAULT_CONFIG_PATH: string, STARTSH_PATH: string): void {
        let config: ConfigFile = ConfigFile.create(DEFAULT_CONFIG_PATH);
        let activeProfile: Profile | null = config.getActive();
        if (activeProfile == null) {
            return;
        }
        const startSh: StartShFile = StartShFile.create(STARTSH_PATH);
        startSh.refresh(activeProfile, STARTSH_PATH);
    }

    private enableProfile(profileName: string, DEFAULT_CONFIG_PATH: string, STARTSH_PATH: string): void {

        let config: ConfigFile = ConfigFile.create(DEFAULT_CONFIG_PATH);
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

        config.writeToDisc();
        if (activeProfile == null){
            return;
        }
        const startSh: StartShFile = StartShFile.create(STARTSH_PATH);
        startSh.refresh(activeProfile, STARTSH_PATH);
    }

    private help(): void {
        console.log('HELP-blabla');
    }
}