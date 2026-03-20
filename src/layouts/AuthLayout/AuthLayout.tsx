import React from "react";
import cont from "./AuthLayout.module.css"
import { Outlet } from "react-router-dom";
import { ReactComponent as FonForForm } from "../../assets/images/FonSakurysvg.svg";
import { ReactComponent as Logo } from "../../assets/images/LogoS.svg";
import { ReactComponent as Sun } from "../../assets/images/Sun.svg";
import { ReactComponent as Moon } from "../../assets/images/Moon.svg";
import AuthHeaderSearchForm from "./AuthHeaderSearchForm";

const AuthLayout = () => {
    return (
        <div className={cont.auth_layout}>
            <div className={cont.auth_container}>
                <div className={cont.auth_fff}>
                    <FonForForm className={cont.fff} preserveAspectRatio="xMidYMid slice" />
                </div>
                <div className={cont.header_container}>
                    <header>
                        <AuthHeaderSearchForm />
                        <div className={cont.theme_switch}>
                            <div className={cont.switch_icon_bck}></div>
                            <Sun className={cont.sun} />
                            <Moon className={cont.moon} />
                        </div>
                    </header>
                </div>
                <div className={cont.auth_content_wrap}>
                    <div className={cont.auth_content}>
                        <div className={cont.auth_logo}>
                            <Logo className={cont.logo} />
                        </div>
                        <Outlet />
                    </div>
                </div>
                <div className={cont.footer_container}>
                    <footer>
                        <div className={cont.copyright}>SamuraiLink © 2025</div>
                        <div className={cont.languages}>
                            <p>English</p>
                            <ul className={cont.languages_list}>
                                <li><a href="#">English</a></li>
                                <li><a href="#">Russian</a></li>
                            </ul>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;