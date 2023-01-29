import cont from '../Dialogs.module.css';
import { NavLink } from 'react-router-dom';

const User = (props) => {
    return (
        <NavLink to={"/dialogs/" + props.id} className={cont.item + ' ' + cont.user + ' ' + cont.actives}>
            <img className={cont.avatar_img} src={props.avatar} alt="avatar user" />
            <h6>{props.name}</h6>
        </NavLink>
    );
}

export default User;