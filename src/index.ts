import {ProfileCreateCommand} from "./commands/ProfileCreateCommand";
import * as inquirer from 'inquirer';
import {StartShFile} from "./file/StartShFile";
import {BASE_PATH, LOG_LEVEL} from "./tokens";
import {ConfigFile} from "./file/ConfigFile";
import {ProfileDeleteCommand} from "./commands/ProfileDeleteCommand";
import {Exception} from "./exceptions/Exception";
import {ListProfilesCommand} from "./commands/ListProfilesCommand";
import {InitCommand} from "./commands/InitCommand";
import {SystemFolder} from "./folder/SystemFolder";
import {DisplayType} from "./commands/DisplayType";
import {ProfileEnableCommand} from "./commands/ProfileEnableCommand";
import {getConfigFile, getStartShFile, refreshStartSh} from "./utils";
import log from 'loglevel';

const {Command} = require('commander');


log.setLevel(log.levels[LOG_LEVEL]);
log.debug('Starting...');
log.debug(process.env);
let basePath = new SystemFolder(BASE_PATH);
basePath.cdTo();


const program = new Command();

program.version('0.0.2');

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
				log.error(e.toString());
				return;
			}
			log.error(e);
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
				log.error(e.toString());
				return;
			}
			log.error(e);
		}
	});

program
	.command('actual')
	.description('prints the actual configuration(start.sh file)')
	.action(() => {
		const startSh: StartShFile = getStartShFile();
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
				log.error(e.toString());
				return;
			}
			log.error(e);
		}
	});


profileCommand
	.command('delete [name]')
	.description('delete a profile')
	.action(async (name: any, options: any) => {
		if (name == null) {
			const config: ConfigFile = getConfigFile();
			const profileNames = Array.from(config.profiles().values()).map(r => r.name);
			const activeProfileName: string | null = (config.getActive()?.name) || null;
			const answers = await inquirer
				.prompt([
					{
						name: "name",
						type: "list",
						message: "Select the profile:",
						choices: [...profileNames],
						default: activeProfileName,
						loop: true
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
				log.error(e.toString());
				return;
			}
			log.error(e);
		}
	});

profileCommand
	.command('enable [name]')
	.description('enable a profile')
	.action(async (name: any, options: any) => {
		if (name == null) {
			const config: ConfigFile = getConfigFile();
			const profileNames = Array.from(config.profiles().values()).map(r => r.name);
			const activeProfileName: string | null = (config.getActive()?.name) || null;
			const answers = await inquirer
				.prompt([
					{
						name: "name",
						type: "list",
						message: "Select the profile:",
						choices: [...profileNames],
						default: activeProfileName,
						loop: true
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
				log.error(e.toString());
				return;
			}
			log.error(e);
		}
	});

program.parse(process.argv);
log.debug('END');
