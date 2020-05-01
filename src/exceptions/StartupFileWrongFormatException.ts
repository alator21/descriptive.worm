import {Exception} from "./Exception";

export class StartupFileWrongFormatException  extends Exception{


    toString() {
        return `StartupFileWrongFormatException`;
    }
}