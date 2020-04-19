import fs from 'fs';
import path from 'path';

export default class ErrorLogger {
    logPath: string;

    constructor() {
        this.logPath = path.join(__dirname, '..', '..', '..', 'log', 'log.txt');
    }

    public add(er: Error) {
        const date: Date = new Date();
        const log = `${date.toString()} | (${er.name}) ${er.message}\n`;
        fs.appendFile(this.logPath, log, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`${new Date().toString()}: log added.`);
            }
        });
    }

    public clear() {
        fs.writeFile(this.logPath, '', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`${new Date().toString()}: logs cleared.`);
            }
        })
    }
}