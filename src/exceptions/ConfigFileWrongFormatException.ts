import {Exception} from "./Exception";

export class ConfigFileWrongFormatException  extends Exception{


    toString() {
        return `ConfigFileWrongFormatException`;
    }
}