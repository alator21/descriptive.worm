#!/usr/bin/env ts-node
import {Menu} from "./Menu";
import {FolderPath} from "./FolderPath";


require("dotenv").config();

const BASHRC_PATH: string = `~/.bashrc`;
const BASE_PATH: string = '~/.nbasz';
const DEFAULT_CONFIG_PATH: string = `${BASE_PATH}/config.json`;
const DEFAULT_PROFILES_PATH: string = `${BASE_PATH}/profiles`;
const STARTSH_PATH: string = `${BASE_PATH}/start.sh`;

async function main() {
    let folderPath: FolderPath = FolderPath.create(BASE_PATH);
    if (!folderPath.isValid()) {
        folderPath.touch();
    }
    folderPath.cdTo();
    Menu.create(BASHRC_PATH, STARTSH_PATH, DEFAULT_CONFIG_PATH, DEFAULT_PROFILES_PATH);
}

main();
