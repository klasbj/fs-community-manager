import { promises as fs } from "fs";
import path from "path";

export interface Configuration {
    msfsPackagesDirectory?: string;
    fsCommunitManagerPackagesDirectory?: string;
}

export class ConfigurationManager {
    private configFile: string;
    private instance: Configuration;

    constructor() {
        this.instance = {};
        this.configFile = path.join(
            process.env.LOCALAPPDATA ?? process.env.XDG_CONFIG_HOME ?? process.env.HOME + "/.config",
            "fs-community-manager",
            "config.json"
        );
    }

    public loadConfiguration = async (): Promise<void> => {
        try {
            const configData = await fs.readFile(this.configFile, "utf-8");
            this.instance = JSON.parse(configData);
        } catch (e) {
            console.log("Could not read file", e);
        }
    };

    public setConfiguration = async (update: Partial<Configuration>): Promise<void> => {
        this.instance = { ...this.instance, ...update };
        try {
            await fs.mkdir(path.dirname(this.configFile), { recursive: true });
            await fs.writeFile(this.configFile, JSON.stringify(this.instance, null, 2), "utf-8");
        } catch (e) {
            console.log("Could not save config file", e);
        }
    };

    public getConfiguration = (): Configuration => this.instance;
}