import React from 'react';
import cont from '../../Profile.module.css';

type PropsType = {
    id: number
    avatar: string
    message: string
    likes: number
    coments: number
}

const Post: React.FC<PropsType> = (props) => {
    return (
        <div className={cont.posts_item}>
            <div className={cont.posts_item_cont}>
                <img src={props.avatar} alt="user avatar" />
                <p>{props.message}</p>
            </div>
            <div className={cont.posts_item_btn}>
                <p>Like:{props.likes}</p>
                <p>Comments:{props.coments}</p>
            </div>
        </div>
    );
}

export default Post;