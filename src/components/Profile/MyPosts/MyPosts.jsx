import cont from '../Profile.module.css';
import Post from '../MyPosts/Post/Post.jsx';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { maxLengthCreator, required } from '../../../utils/validators/validators';
import { Textarea } from '../../common/FormsControls/FormsControls';


const MyPosts = React.memo(props => {
    console.log("Render Yo");
    let ProfilePosts = [...props.postsData].reverse().map(p => <Post key={p.id} id={p.id} message={p.message} likes={p.likes} coments={p.coments} avatar={p.avatar} /> );

    let AddNewPost = (values) => {
        props.addPost(values.newPostText);
    }

    return (
        <div className={cont.post}>
            <div>
                <h4>My Posts</h4>
                <AddPostFormRedux onSubmit={AddNewPost} />
            </div>
            <div className={cont.posts}>
                {ProfilePosts}
            </div>
        </div>
    );
});

const maxLength30 = maxLengthCreator(30);

const AddPostForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <Field className={cont.input_post} placeholder='Your news' component={Textarea} name={'newPostText'} validate={[required, maxLength30]} /><br />
            {/* <textarea onChange={onPostChange} ref={newPostElement} className={cont.input_post} placeholder="Your news" value={props.newPostText}></textarea><br /> */}
            <button className={cont.post_btn}>Add post</button>
        </form>
    );
}

const AddPostFormRedux = reduxForm({
    form: 'profileAddPostForm'
})(AddPostForm)

export default MyPosts;