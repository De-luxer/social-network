import React from 'react';
import preloader from '../../../assets/images/Eclipse-0.9s-200px.svg';
import cont from "./Common.module.css"

type PropsType = {
    isFullScren?: boolean,
    isCircleCenter?: boolean
}

let Preloader: React.FC<PropsType> = (props) => {
    return <div className={`${props.isFullScren ? cont.preloader_wrapper_center : ""} ${props.isCircleCenter ? cont.circle_center : ""}`}>
        <img src={preloader} alt="preloader" />
    </div>
}

export default Preloader;