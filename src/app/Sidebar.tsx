import React from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as GearIcon } from "bootstrap-icons/icons/gear.svg";
import { ReactComponent as CollectionIcon } from "bootstrap-icons/icons/collection.svg";
import "./Sidebar.css";

export const Sidebar: React.FC = () => {
    return (
        <div className="Sidebar">
            <nav>
                <NavLink exact to="/">
                    <CollectionIcon />
                    <span>Packages</span>
                </NavLink>
                <NavLink to="/settings">
                    <GearIcon />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </div>
    );
};
