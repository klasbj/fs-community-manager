import React, { useState } from "react";

export const Settings: React.FC = () => {
    const [config, setLocalConfig] = useState(window.configurationManager.getConfiguration);
    const setConfig = <K extends keyof typeof config>(k: K, v: typeof config[K]): void => {
        window.configurationManager.setConfiguration({ [k]: v });
        setLocalConfig({ ...config, [k]: v });
    };

    return (
        <div>
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
