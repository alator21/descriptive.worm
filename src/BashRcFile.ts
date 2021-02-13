import {File} from "./File";

export class BashRcFile extends File {
    constructor(path: string) {
        super(path);
    }

    private sourceStartExists(startShPath: string): boolean {
        const bashRc: string = this.read();
        return bashRc.includes(`source ${startShPath}`);
    }

    appendSourceStart(startShPath: string): void {
        if (this.sourceStartExists(startShPath)) {
            console.warn(`Already initialized.`);
            return;
        }
        this.append(`\nsource ${startShPath}`);
    }

}
