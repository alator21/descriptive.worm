import {SystemFile} from "./SystemFile";
import {table} from "table";
import {Profile} from "../profile/Profile";
import {ShellType} from "./ShellType";
import {ConfigFileWrongFormatException} from "../exceptions/ConfigFileWrongFormatException";
import log from "loglevel";

const chalk = require('chalk');

export abstract class ConfigFile extends SystemFile {
	protected constructor(path: string, touch?: boolean) {
		super(path);
		if (touch) {
			this.touch();
		}
	}

	static determineShellType(path: string): ShellType {
		try {
			const config: SystemFile = new SystemFile(path);
			const configFile: string = config.read();
			const json = JSON.parse(configFile);
			const shellType: keyof typeof ShellType = json['_shellType'];
			return ShellType[shellType];
		} catch (exception) {
			if (exception instanceof SyntaxError) {
				throw new ConfigFileWrongFormatException();
			}
			throw exception;
		}
	}

	abstract profiles(): Map<string/*profileId*/, Profile>;


	protected static printTable(data: any, options: any): void {
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
		log.info(tableText);
	}

	getActive(): Profile | null {
		for (let profile of this.profiles().values()) {
			if (profile.isActive) {
				return profile;
			}
		}
		return null;
	}

	protected abstract addActualProfile(profile: Profile): void;

	addProfile(profile: Profile): void {
		const p = this.profiles().get(profile.id);
		if (p != null) {
			return;
		}
		if (profile.isActive) {
			for (let prof of this.profiles().values()) {
				if (prof.isActive) {
					prof.disable();
					break;
				}
			}
		}
		this.addActualProfile(profile);
	}

	touch(): void {
		super.touch();
		super.writeSync('{\n\n}');
	}

	write(): void {
		let output: string = JSON.stringify(Array.from(this.profiles().values()), null, 2);
		super.writeSync(output);
	}

	abstract printProfilesFull(): void;

	printProfilesSimple(): void {
		const output: any[] = [];
		for (let profile of this.profiles().values()) {
			output.push({
				'name': chalk.yellow(profile.name),
				'active': chalk.cyan(profile.isActive)
			});
		}
		ConfigFile.printTable(output, {
			headerStyleFn: (header: any) => chalk.bold(chalk.red(header))
		});
	}
}
