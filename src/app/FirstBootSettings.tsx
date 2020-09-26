import React, { useState } from "react";
import type { Configuration } from "../configurationManager";

export const FirstBootSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [config, setLocalConfig] = useState<Configuration>({});
    const setConfig = <K extends keyof typeof config>(k: K, v: typeof config[K]): void => {
        setLocalConfig({ ...config, [k]: v });
    };

    return (
        <div>
            <p>Welcome. To start you need to set up some base settings.</p>
            <div>
                <label style={{ display: "block" }} htmlFor="msfsPackagesDirectory">
                    MS FS packages directory
                </label>
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
            <div>
                <label style={{ display: "block" }} htmlFor="fsCommunityManagerPackagesDirectory">
                    fs-community-manager packages directory
                </label>
                <input
                    id={"fsCommunityManagerPackagesDirectory"}
                    type="text"
                    value={config.fsCommunitManagerPackagesDirectory ?? ""}
                    onChange={(e) => setConfig("fsCommunitManagerPackagesDirectory", e.target.value)}
                />
                <button
                    onClick={(_) =>
                        window.ipcRenderer
                            .invoke("choose-folder")
                            .then(
                                (x: string[]) => x.length > 0 && setConfig("fsCommunitManagerPackagesDirectory", x[0])
                            )
                    }
                >
                    Browse
                </button>
            </div>
            <div>
                <button
                    onClick={() => {
                        window.configurationManager.setConfiguration(config);
                        onClose();
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );
};
