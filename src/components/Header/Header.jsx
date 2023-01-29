import React from 'react';
import cont from './Header.module.css';
import { NavLink } from 'react-router-dom';

const Header = (props) => {
    return (
        <header className={cont.header}>
            <img className={cont.header_logo} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuqSUWGefeLef35q2txrO4W5gaQgjIrJoVvw&usqp=CAU" alt="logo" />
            <div className={cont.login_block}>
                {props.isAuth ? props.login : <NavLink to={'/login'}>Login</NavLink>}<br/>
                {props.isAuth ? <button onClick={props.logout}>Logout</button> : null}
            </div>
        </header>
    );
}

export default Header;