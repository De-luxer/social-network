import cont from '../Profile.module.css';
import Post from './Post/Post';
import React from 'react';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { maxLengthCreator, required } from '../../../utils/validators/validators';
import { Textarea } from '../../common/FormsControls/FormsControls';
import { PostsDataType } from '../../../types/types';
import { ProfileErroreType } from '../../../redux/profile-reducer';

type AddPostFormValuesType = {
    newPostText: string
}

type PropsType = {
    postsData: Array<PostsDataType>,
    addPost: (newPostText: string) => void
    profileErrore?: ProfileErroreType
}

const MyPosts: React.FC<AddPostFormValuesType & PropsType> = React.memo(props => {
    let ProfilePosts = [...props.postsData].reverse().map(p => <Post key={p.id} id={p.id} message={p.message} likes={p.likes} coments={p.coments} avatar={p.avatar} /> );

    let AddNewPost = (values: AddPostFormValuesType) => {
        props.addPost(values.newPostText);
    }
    if (props.profileErrore?.isErrore) {
        return null
    } else {
        return (
            <div className={cont.post}>
                <div>
                    <h4>My Posts</h4>
                    <AddPostFormRedux onSubmit={AddNewPost} postsData={[]} addPost={props.addPost} />
                </div>
                <div className={cont.posts}>
                    {ProfilePosts}
                </div>
            </div>
        );
    }
});

const maxLength30 = maxLengthCreator(30);

const AddPostForm: React.FC<InjectedFormProps<AddPostFormValuesType, PropsType> & PropsType> = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <Field className={cont.input_post} placeholder='Your news' component={Textarea} name={'newPostText'} validate={[required, maxLength30]} /><br />
            {/* <textarea onChange={onPostChange} ref={newPostElement} className={cont.input_post} placeholder="Your news" value={props.newPostText}></textarea><br /> */}
            <button className={cont.post_btn}>Add post</button>
        </form>
    );
}

const AddPostFormRedux = reduxForm<AddPostFormValuesType, PropsType>({
    form: 'profileAddPostForm'
})(AddPostForm)

export default MyPosts;