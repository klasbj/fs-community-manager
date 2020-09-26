/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const App: React.FC = () => {
    const [config, setLocalConfig] = useState(window.configurationManager.getConfiguration);
    const setConfig = <K extends keyof typeof config>(k: K, v: typeof config[K]): void => {
        window.configurationManager.setConfiguration({ [k]: v });
        setLocalConfig({ ...config, [k]: v });
    };

    return (
        <div>
            <p>Helo</p>
            <div>
                <label htmlFor="fsCommunityManagerPackagesDirectory">fs-community-manager packages directory</label>
                <input
                    id={"fsCommunityManagerPackagesDirectory"}
                    type="text"
                    value={config.fsCommunitManagerPackagesDirectory ?? ""}
                    onChange={(e) => setConfig("fsCommunitManagerPackagesDirectory", e.target.value)}
                />
                <button
                    onClick={(_) =>
                        window.ipcRenderer.invoke("choose-folder").then((x: string[]) => {
                            console.log(x);
                            x.length > 0 && setConfig("fsCommunitManagerPackagesDirectory", x[0]);
                        })
                    }
                >
                    Browse
                </button>
            </div>
            <div>
                <label htmlFor="msfsPackagesDirectory">MS FS packages directory</label>
                <input
                    id={"msfsPackagesDirectory"}
                    type="text"
                    value={config.msfsPackagesDirectory ?? ""}
                    onChange={(e) => setConfig("msfsPackagesDirectory", e.target.value)}
                />
                <button
                    onClick={(_) =>
                        window.ipcRenderer
                            .invoke("choose-folder")
                            .then((x: string[]) => x.length > 0 && setConfig("msfsPackagesDirectory", x[0]))
                    }
                >
                    Browse
                </button>
            </div>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

console.log('👋 This message is being logged by "renderer.js", included via webpack');
