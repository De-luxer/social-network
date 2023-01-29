import React from 'react';
import cont from './Users.module.css';
import Paginator from '../common/Paginator/Paginator';
import User from './User';

let Users = (props) => {
    return (
        <div>
            <h4>Users</h4>
            <div className={cont.container}>
                {/* <div className={cont.pagination}>
                    {pages.map( p => {
                        return <span onClick={() => { props.onPageChanged(p); }} className={`${props.currentPage === p && cont.pagination_item_active} ${cont.pagination_item}`} >{p}</span>
                    })}
                </div> */}
                <Paginator currentPage={props.currentPage} onPageChanged={props.onPageChanged} totalUsersCount={props.totalUsersCount} pageSize={props.pageSize} />
                {
                    props.users.map(u => <User user={u} key={u.id} followingInProgress={props.followingInProgress} follow={props.follow} unfollow={props.unfollow} />)
                    /*
                    <div className={cont.container_item} key={u.id}>
                        <div className={cont.img_container}>
                            <NavLink to={"/profile/" + u.id}>
                                <img className={cont.img} src={u.photos.small != null ? u.photos.small : userPhoto} alt="avatar" />
                            </NavLink>
                            {u.followed ? <button disabled={props.followingInProgress.some(id => id === u.id)} onClick={() => {props.unfollow(u.id)}}>Unfollow</button> 
                                : <button disabled={props.followingInProgress.some(id => id === u.id)} onClick={() => {props.follow(u.id)}}>Follow</button>
                            }
                        </div>
                        <div className={cont.info}>
                            <div className={cont.info_name_status}>
                                <h2>{u.name}</h2>
                                <p>{u.status}</p>
                            </div>
                            <div className={cont.info_location}>
                                <h3>{'u.location.country'}, {'u.location.city'}</h3>
                            </div>
                        </div>
                    </div>)
                    */
                }
            </div>
        </div>
    )
}

export default Users;