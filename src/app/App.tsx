import React, { useEffect, useState } from "react";
import { HashRouter as Router } from "react-router-dom";
import { FirstBootSettings } from "./FirstBootSettings";
import { Settings } from "./Settings";

export const App: React.FC = () => {
    return (
        <Router>
            <AppActual />
        </Router>
    );
};

const AppActual: React.FC = () => {
    const [status, setStatus] = useState<"loading" | "firstboot" | "loaded">("loading");
    useEffect(() => {
        window.configurationManager.getConfigurationAsync().then((c) => {
            if (c.fsCommunitManagerPackagesDirectory == null || c.msfsPackagesDirectory == null) {
                setStatus("firstboot");
            } else {
                setStatus("loaded");
            }
        });
    }, []);

    if (status === "firstboot") {
        return (
            <div>
                <FirstBootSettings onClose={() => setStatus("loaded")} />
            </div>
        );
    }

    return (
        <div>
            <p>{status}</p>
            <Settings />
        </div>
    );
};
