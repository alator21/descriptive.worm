import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const myEnv = dotenv.config({
	path: `${__dirname}/../.env`,
});
dotenvExpand.expand(myEnv);
export const BASHRC_PATH: string = process.env['BASHRC_PATH'] || '~/.bashrc';
export const FISHRC_PATH: string = process.env['FISHRC_PATH'] || '~/.config/fish/config.fish';
export const BASE_PATH: string = process.env['BASE_PATH'] || '~/.dworm';
export const CONFIG_PATH: string = process.env['CONFIG_PATH'] || `${BASE_PATH}/config.json`;
export const PROFILES_PATH: string = process.env['PROFILES_PATH'] || `${BASE_PATH}/profiles`;
export const STARTSH_PATH: string = process.env['STARTSH_PATH'] || `${BASE_PATH}/start.sh`;

export const PROFILE_PATHS_NAME: string = process.env['PROFILE_PATHS_NAME'] || `paths`;
export const PROFILE_ALIASES_NAME: string = process.env['PROFILE_ALIASES_NAME'] || `aliases`;
export const PROFILE_STARTUPS_NAME: string = process.env['PROFILE_STARTUPS_NAME'] || `startup`;
export const PROFILE_STARTUP_COMMANDS_NAME: string = process.env['PROFILE_STARTUP_COMMANDS_NAME'] || `startup-commands`;

export const LOG_LEVEL: LogLevel = process.env['LOG_LEVEL'] as LogLevel || 'INFO'


export type LogLevel = 'INFO' | 'DEBUG';
