import React, { Suspense } from "react";
import cont from "./MainLayout.module.css";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className={cont.app_wrapper}>
            <div className={cont.app_container}>
                <div className={cont.header_container}>
                    <Header />
                </div>
                <div className={cont.navbar_content_container}>
                    <Nav />
                    <div className={cont.app_wrapper_content}>
                        <Suspense fallback={<h1>Loading...</h1>}>
                            <Outlet />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;