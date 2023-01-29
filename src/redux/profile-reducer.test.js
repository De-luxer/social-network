import React from "react";
import profileReducer, { addPostActionCreator, deletePost } from "./profile-reducer";

let state = {
    postsData: [
        { id: 1, message: 'Hi, how are you?', likes: 10, coments: 3, avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg' },
        { id: 2, message: 'Very nice', likes: 10, coments: 3, avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg' },
        { id: 3, message: 'It\'s good', likes: 10, coments: 3, avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg' }
    ],
};

it('length of posts should be incremented', () => {
    // 1. Test data
    let action = addPostActionCreator("kapec");
    // 2. Action
    let newState = profileReducer(state, action);

    // 3. Expectation (ожидание)
    expect(newState.postsData.length).toBe(4);
});

it('message of new post should be correct', () => {
    // 1. Test data
    let action = addPostActionCreator("Novoe");
    // 2. Action
    let newState = profileReducer(state, action);

    // 3. Expectation (ожидание)
    expect(newState.postsData[3].message).toBe("Novoe");
});

it('after deleting length of message should be decrement', () => {
    // 1. Test data
    let action = deletePost(1);
    // 2. Action
    let newState = profileReducer(state, action);

    // 3. Expectation (ожидание)
    expect(newState.postsData.length).toBe(2);
});