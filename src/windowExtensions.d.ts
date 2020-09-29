import type { ConfigurationManager } from "./configurationManager";
import type { IpcRenderer } from "electron";
import { ArchiveManager } from "./archiveManager";

declare global {
    interface Window {
        configurationManager: ConfigurationManager;
        ipcRenderer: IpcRenderer;
        archiveManager: ArchiveManager;
    }
}
