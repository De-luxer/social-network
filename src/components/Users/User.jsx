import React from 'react';
import cont from './Users.module.css';
import userPhoto from '../../assets/images/user-img.png';
import { NavLink } from 'react-router-dom';

let User = ({user, ...props}) => {
    return (
        <div className={cont.container_item}>
            <div className={cont.img_container}>
                <NavLink to={"/profile/" + user.id}>
                    <img className={cont.img} src={user.photos.small != null ? user.photos.small : userPhoto} alt="avatar" />
                </NavLink>
                {user.followed ? <button disabled={props.followingInProgress.some(id => id === user.id)} onClick={() => { props.unfollow(user.id) }}>Unfollow</button>
                    : <button disabled={props.followingInProgress.some(id => id === user.id)} onClick={() => { props.follow(user.id) }}>Follow</button>
                }
            </div>
            <div className={cont.info}>
                <div className={cont.info_name_status}>
                    <h2>{user.name}</h2>
                    <p>{user.status}</p>
                </div>
                <div className={cont.info_location}>
                    <h3>{'u.location.country'}, {'u.location.city'}</h3>
                </div>
            </div>
        </div>
    )
}

export default User;