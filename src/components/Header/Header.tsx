import React from 'react';
import cont from './Header.module.css';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectorIsAuth, selectorAuthUserLogin, selectorAuthUserSmallAvatar } from '../../redux/auth-selectors';
import { logout } from '../../redux/auth-reducer';
import Avatar from '../common/Avatar/Avatar';
import { actions as appActions } from '../../redux/app-reducer';
import { startMessagesListening } from '../../redux/chat-reducer';
import {v1} from "uuid";
import { ReactComponent as Logo } from '../../assets/images/LogoS.svg'

const Header: React.FC = () => {
    const isAuth = useSelector(selectorIsAuth);
    const login = useSelector(selectorAuthUserLogin);
    const userAvatar = useSelector(selectorAuthUserSmallAvatar);

    const dispatch = useDispatch();

    const logoutCallback = () => {
        dispatch(logout());
    }

    const testMessages = () => {
        dispatch(appActions.addGlobalMessage({id: v1(), message :"GgggggggGGGGGGGGGGGGGGGhhhhhhhhh gGGGGGGGGGG GGGGg gfdg          dfggdfg gdfg df fsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfsddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd1", type: "error"}))
    }

    const connectRestart = () => {
        dispatch(startMessagesListening())
    }

    return (
        <header className={cont.header}>
            <Logo className={cont.header_logo} />
            <div className={cont.login_block}>
                {isAuth ? <div className={cont.header_container_menu}>
                    <img src={userAvatar ? userAvatar : Avatar} alt="user avatar" className={cont.avatar} />
                    <div className={cont.header_menu}>
                        <NavLink to={"/profile"}>{login}</NavLink> <br />
                        <button onClick={testMessages} type="button">Test error</button>
                        <button onClick={connectRestart} type="button">Connect Restart</button>
                        <button onClick={logoutCallback}>Logout</button>
                    </div>
                </div> : <NavLink to={'/login'}>Login</NavLink>}
            </div>
        </header>
    );
}

export default Header;