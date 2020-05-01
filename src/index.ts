#!/usr/bin/env ts-node
import * as expandHomeDir from "expand-home-dir";
import {Menu} from "./Menu";

require("dotenv").config();

const BASHRC_PATH: string = expandHomeDir(`~/.bashrc`);
const BASE_PATH: string = expandHomeDir('~/.nbasz');
const DEFAULT_CONFIG_PATH: string = `${BASE_PATH}/config.json`;
const STARTSH_PATH: string = `${BASE_PATH}/start.sh`;

async function main() {
    Menu.create(BASHRC_PATH, STARTSH_PATH, DEFAULT_CONFIG_PATH);
}

main();
