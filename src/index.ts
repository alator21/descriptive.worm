#!/usr/bin/env ts-node
import {Menu} from "./Menu";
const expandHomeDir = require('expand-home-dir');

require("dotenv").config();

const BASHRC_PATH: string = `~/.bashrc`;
const BASE_PATH: string = '~/.nbasz';
const DEFAULT_CONFIG_PATH: string = `${BASE_PATH}/config.json`;
const STARTSH_PATH: string = `${BASE_PATH}/start.sh`;

async function main() {
    process.chdir(expandHomeDir(BASE_PATH))
    Menu.create(BASHRC_PATH, STARTSH_PATH, DEFAULT_CONFIG_PATH);
}

main();
