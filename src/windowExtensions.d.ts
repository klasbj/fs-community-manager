import type { ConfigurationManager } from "./configurationManager";
import type { IpcRenderer } from "electron";

declare global {
    interface Window {
        configurationManager: ConfigurationManager;
        ipcRenderer: IpcRenderer;
    }
}
