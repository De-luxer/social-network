import React from "react";
import preloader from "../../../assets/images/Three-dots.svg";
import cont from "./Common.module.css"

let PreloaderThreeDots: React.FC<{isCenter?: boolean}> = ({isCenter}) => {
    return <img className={isCenter ? cont.preloader_center : null} src={preloader} alt="preloader three dots" />
}

export default PreloaderThreeDots;