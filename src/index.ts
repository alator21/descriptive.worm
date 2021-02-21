import {ProfileCreateCommand} from "./commands/ProfileCreateCommand";
import * as inquirer from 'inquirer';
import {StartShFile} from "./file/StartShFile";
import {BASE_PATH, DEFAULT_CONFIG_PATH, STARTSH_PATH} from "./tokens";
import {ConfigFile} from "./file/ConfigFile";
import {Profile} from "./Profile";
import {ProfileDeleteCommand} from "./commands/ProfileDeleteCommand";
import {Exception} from "./exceptions/Exception";
import {ListProfilesCommand} from "./commands/ListProfilesCommand";
import {InitCommand} from "./commands/InitCommand";
import {SystemFolder} from "./folder/SystemFolder";
import {DisplayType} from "./commands/DisplayType";
import {ProfileEnableCommand} from "./commands/ProfileEnableCommand";

const {Command} = require('commander');


let basePath = new SystemFolder(BASE_PATH);
basePath.cdTo();


const program = new Command();

program.version('0.0.1');

program
	.option('-r, --refresh', 'refresh configuration')
	.action((options: any) => {
		if (options['refresh'] === true) {
			refreshStartSh();
		}
	});


program
	.command('init')
	.description('creates the start file and sources it in bashrc')
	.action(() => {
		const initCommand: InitCommand = new InitCommand();
		try {
			initCommand.execute();
		} catch (e) {
			if (e instanceof Exception) {
				console.log(e.toString());
				return;
			}
			console.log(e);
		}
	});

program
	.command('list')
	.description('lists profiles')
	.option('-s, --simple')
	.action((options: any) => {
		let displayType: DisplayType = DisplayType.FULL;
		if (options.simple) {
			displayType = DisplayType.SIMPLE;
		}
		const listProfilesCommand: ListProfilesCommand = new ListProfilesCommand(displayType);
		try {
			listProfilesCommand.execute();
		} catch (e) {
			if (e instanceof Exception) {
				console.log(e.toString());
				return;
			}
			console.log(e);
		}
	});

program
	.command('actual')
	.description('prints the actual configuration(start.sh file)')
	.action(() => {
		const startSh: StartShFile = new StartShFile(STARTSH_PATH);
		startSh.print();
	});

const profileCommand = program
	.command('profile');


profileCommand
	.command('create [name]')
	.description('create a new empty profile')
	.action(async (name: any) => {
		if (name == null) {
			const answers = await inquirer
				.prompt([
					{'type': 'input', 'name': 'name', 'message': 'Type the profile name'},
				])
			name = answers.name;
		}

		const profileCreateCommand: ProfileCreateCommand = new ProfileCreateCommand(name);
		try {
			profileCreateCommand.execute();
			refreshStartSh();
		} catch (e) {
			if (e instanceof Exception) {
				console.log(e.toString());
				return;
			}
			console.log(e);
		}
	});


profileCommand
	.command('delete [name]')
	.description('delete a profile')
	.action(async (name: any, options: any) => {
		if (name == null) {
			const config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
			const profileNames = Array.from(config.profiles.values()).map(r => r.name);
			const activeProfileName: string | null = (config.getActive()?.name) || null;
			const answers = await inquirer
				.prompt([
					{
						name: "name",
						type: "list",
						message: "Select the profile:",
						choices: [...profileNames],
						default: activeProfileName,
						loop:true
					}
				])
			name = answers.name;
		}

		const profileDeleteCommand: ProfileDeleteCommand = new ProfileDeleteCommand(name);
		try {
			profileDeleteCommand.execute();
			refreshStartSh();
		} catch (e) {
			if (e instanceof Exception) {
				console.log(e.toString());
				return;
			}
			console.log(e);
		}
	});

profileCommand
	.command('enable [name]')
	.description('enable a profile')
	.action(async (name: any, options: any) => {
		if (name == null) {
			const config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);
			const profileNames = Array.from(config.profiles.values()).map(r => r.name);
			const activeProfileName: string | null = (config.getActive()?.name) || null;
			const answers = await inquirer
				.prompt([
					{
						name: "name",
						type: "list",
						message: "Select the profile:",
						choices: [...profileNames],
						default: activeProfileName,
						loop:true
					}
				])
			name = answers.name;
		}
		const profileEnableCommand: ProfileEnableCommand = new ProfileEnableCommand(name);
		try {
			profileEnableCommand.execute();
			refreshStartSh();
		} catch (e) {
			if (e instanceof Exception) {
				console.log(e.toString());
				return;
			}
			console.log(e);
		}
	});

program.parse(process.argv);


function refreshStartSh() {
	const config: ConfigFile = new ConfigFile(DEFAULT_CONFIG_PATH);

	const activeProfile: Profile | null = config.getActive();
	if (activeProfile == null) {
		return;
	}
	const startSh: StartShFile = new StartShFile(STARTSH_PATH);
	startSh.refresh(activeProfile);
}
