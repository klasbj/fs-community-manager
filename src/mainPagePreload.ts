import { ConfigurationManager } from "./configurationManager";
import { ipcRenderer } from "electron";

window.configurationManager = new ConfigurationManager();
window.configurationManager.loadConfiguration();

window.ipcRenderer = ipcRenderer;
