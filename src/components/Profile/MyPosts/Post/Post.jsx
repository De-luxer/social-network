import cont from '../../Profile.module.css';

const Post = (props) => {
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