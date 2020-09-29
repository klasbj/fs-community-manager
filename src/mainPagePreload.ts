import { ConfigurationManager } from "./configurationManager";
import { ipcRenderer } from "electron";
import { ArchiveManager } from "./archiveManager";

window.configurationManager = new ConfigurationManager();
window.configurationManager.loadConfiguration();

window.archiveManager = new ArchiveManager();

window.ipcRenderer = ipcRenderer;
