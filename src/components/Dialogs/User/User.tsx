import React from 'react';
import cont from '../Dialogs.module.css';
import { NavLink } from 'react-router-dom';

type PropsType = {
    avatar: string
    name: string
    id: number
}

const User: React.FC<PropsType> = (props) => {
    return (
        <NavLink to={"/dialogs/" + props.id} className={({ isActive }) => `${cont.item} ${cont.user} ${isActive ? cont.actives : ''}`}>
            <img className={cont.avatar_img} src={props.avatar} alt="avatar user" />
            <h6>{props.name}</h6>
        </NavLink>
    );
}

export default User;