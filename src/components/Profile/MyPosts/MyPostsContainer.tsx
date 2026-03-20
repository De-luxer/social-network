import React from 'react';
import { connect } from 'react-redux';
import { actions, ProfileErroreType } from '../../../redux/profile-reducer';
import { AppStateType } from '../../../redux/redux-store';
import { PostsDataType } from '../../../types/types';
import MyPosts from './MyPosts';

type MapStatePropsType = {
    postsData: Array<PostsDataType>,
}

type MapDispatchPropsType = {
    addPost: (newPostText: string) => void
}

type OwnPropsType = {
    newPostText: string
    profileErrore: ProfileErroreType
}

let mapStateToProps = (state: AppStateType) => {
    return {
        postsData: state.profilePage.postsData
    }
}

const MyPostsContainer = connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStateType>(mapStateToProps, {addPost: actions.addPostActionCreator})(MyPosts);

export default MyPostsContainer;