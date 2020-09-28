import React from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as FilledGear } from "bootstrap-icons/icons/gear-fill.svg";
import "./Sidebar.css";

export const Sidebar: React.FC = () => {
    return (
        <div className="Sidebar">
            <nav>
                <NavLink exact to="/">
                    <span>Packages</span>
                </NavLink>
                <NavLink to="/settings">
                    <FilledGear />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </div>
    );
};
