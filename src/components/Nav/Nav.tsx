import React from "react";
import cont from "./Nav.module.css";
import { NavLink } from "react-router-dom";

const Nav = () => {
    return (
        <nav className={cont.nav}>
            <ul>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><NavLink to="/chat">Chat</NavLink></li>
                <li><NavLink to="/friends">Friends</NavLink></li>
                <li><NavLink to="/users">Users</NavLink></li>
            </ul>
        </nav>
    );
}

export default Nav;