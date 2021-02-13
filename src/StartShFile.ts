import {FilePath} from "./FilePath";
import {FilePathIsNotValidException} from "./exceptions/FilePathIsNotValidException";
import {Profile} from "./Profile";
import {File} from "./File";

export class StartShFile extends File {
    constructor(path: string) {
        try {
            super(path);
        } catch (e) {
            if (e instanceof FilePathIsNotValidException) {
                this.filePath.touch();
            }
        }
    }


    refresh(profile: Profile): void {
        if (profile == null) {
            console.warn(`No active profile selected.`);
            return;
        }
        const startupsFilePath: string | null = profile.startupFile;
        const startupCommandsFilePath: string | null = profile.startupCommandsFile;
        const aliasesFilePath: string | null = profile.aliasesFile;
        const pathsFilePath: string | null = profile.pathsFile;
        const extensions: string[] = profile.extensions
            .map(extension => {
                const filePath: FilePath = FilePath.create(extension);
                if (!filePath.isValid()) {
                    throw new FilePathIsNotValidException(extension);
                }
                return extension;
            });


        const startupPaths: string[] = Profile.getStartupPaths(startupsFilePath, extensions);
        const startupCommands: string[] = Profile.getStartupCommands(startupCommandsFilePath, extensions);
        const aliases: Map<string, string> = Profile.getAliases(aliasesFilePath, extensions);
        const paths: string[] = Profile.getPaths(pathsFilePath, extensions);

        let ps1: string | null = profile.ps1;

        this.update(startupPaths, aliases, paths, startupCommands, ps1);
    }

    update(startups: string[], aliases: Map<string, string>, paths: string[], startupCommands: string[], ps1: string | null): void {
        if (!this.exists()) {
            this.touch();
        }
        let output: string = `#!/bin/bash\n`;
        if (startups.length > 0) {
            output += `\n\n`;
            output += `#Startups\n`;
            for (let startup of startups) {
                output += `source ${startup};\n`;
            }
        }

        if (aliases.size > 0) {
            output += `\n\n`;
            output += `#Aliases\n`;
            aliases.forEach((value, key) => {
                output += `alias ${key}=\"${value}\";\n`;
            });
        }


        if (paths.length > 0) {
            output += `\n\n`;
            output += `#Path\n`;
            for (let path of paths) {
                output += `PATH=$PATH:${path}\n`;
            }
        }

        if (startupCommands.length > 0) {
            output += `\n\n`;
            output += `#Commands\n`;
            for (let command of startupCommands) {
                output += `${command}\n`;
            }
        }

        if (ps1 != null) {
            output += `\n\n`;
            output += `#Prompt\n`;
            output += `export PS1=\"${ps1}\"`;
        }
        output += `\n`;


        this.write(output);
    }
}
