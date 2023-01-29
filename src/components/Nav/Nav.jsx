import './Nav.css';
import { NavLink } from 'react-router-dom';

const Nav = () => {
    return (
        <nav className="nav">
            <ul>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><NavLink to="/dialogs">Messages</NavLink></li>
                <li><NavLink to="/users">Users</NavLink></li>
                <li><NavLink to="*">News</NavLink></li>
                <li><NavLink to="*">Music</NavLink></li>
                <li><NavLink to="*">Settings</NavLink></li>
            </ul>
        </nav>
    );
}

export default Nav;