import React from "react";
import cont from "./Users.module.css";
import "../../App.css";
import { NavLink } from "react-router-dom";
import { UsersType } from "../../types/types";
import Avatar from "../common/Avatar/Avatar";

type PropsType = {
    user: UsersType
    followingInProgress?: Array<number>
    isFriendPage?: boolean
    isAuth?: boolean

    follow?: (userId: number) => void
    unfollow?: (userId: number) => void
}

let User = React.memo(React.forwardRef<HTMLDivElement, PropsType>(({user, ...props}, ref) => {
    return (
        <div className={cont.container_item} ref={ref}>
            <div className={cont.img_container}>
                <NavLink to={"/profile/" + user.id}>
                    <img className={cont.img} src={user.photos.small != null ? user.photos.small : Avatar} alt="avatar" />
                </NavLink>
            </div>
            <div className={cont.info}>
                <div className={cont.info_name_status}>
                    <NavLink to={"/profile/" + user.id} className={cont.user_name_link}>
                        <h2>{user.name}</h2>
                    </NavLink>
                    <p title={user.status}>{user.status}</p>
                </div>
            </div>
            <div className={cont.following_change}>
                {props.isAuth && !props.isFriendPage ? (user.followed ? <button disabled={props.followingInProgress?.some(id => id === user.id)} onClick={() => {props.unfollow?.(user.id)}} className="starting_btn_styles">Unfollow</button> : <button disabled={props.followingInProgress?.some(id => id === user.id)} onClick={() => {props.follow?.(user.id)}} className="starting_btn_styles">Follow</button>) : null}

                {props.isFriendPage ? <button disabled={props.followingInProgress?.some(id => id === user.id)} onClick={() => {props.unfollow?.(user.id)}} className="starting_btn_styles">Unfollow</button> : null}
            </div>
        </div>
    )
})
)

export default User;