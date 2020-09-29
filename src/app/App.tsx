import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { FirstBootSettings } from "./FirstBootSettings";
import { Settings } from "./Settings";
import { Sidebar } from "./Sidebar";
import "../theme.css";
import "./App.css";
import { PackagesPane } from "./PackagesPane";

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
        <div className="AppContainer dark-theme">
            <Sidebar />
            <div className="Main">
                <Switch>
                    <Route path="/settings">
                        <p>{status}</p>
                        <Settings />
                    </Route>
                    <Route path="/">
                        <PackagesPane />
                    </Route>
                </Switch>
            </div>
        </div>
    );
};
