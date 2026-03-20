import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { userAPI } from "../api/api";
import { UsersType } from "../types/types";
import { AppDispatch, AppStateType, InferActionsTypes } from "./redux-store";
import { FilterType } from "./users-reducer";
import {actions as appActions} from "./app-reducer";
import { v1 } from "uuid";
import { updateObjectInArray } from "../utils/object-helpers";

let initialState = {
    friends: [] as Array<UsersType>,
    pageSize: 10 as number,
    totalFriendsCount: 0 as number,
    currentPage: 1 as number,
    isFetching: true as boolean,
    filter: {term: "" as string, friend: true as null | boolean},
    followingInProgress: [] as Array<number>,
};

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof action>;
type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>;

const friendsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case "friends/SET_FRIENDS": {
            return {...state, friends: action.replase ? action.users : [...state.friends, ...action.users]}
            //return {...state, friends: action.users}
        }
        case "friends/SET_CURENT_PAGE": {
            return {...state, currentPage: action.currentPage}
        }
        case "friends/SET_TOTAL_FRIENDS_COUNT": {
            return {...state, totalFriendsCount: action.count}
        }
        case "friends/SET_FILTER": {
            return {...state, filter: action.payload}
        }
        case "friends/TOGGLE_IS_FETCHING": {
            return {...state, isFetching: action.isFetching}
        }
        case "friends/UNFOLLOW": {
            return {
                ...state,
                friends: updateObjectInArray(state.friends, action.userId, "id", {followed: false})
            }
        }
        case "friends/TOGGLE_IS_FOLLOWING_PROGRESS": {
            return {
                ...state, followingInProgress: action.isFetching ? [...state.followingInProgress, action.userId] 
                : state.followingInProgress.filter(id => id != action.userId)
            }
        }
        case "friends/DELETE_UNFOLLOW_FRIEND": {
            return {...state, friends: state.friends.filter(f => f.id !== action.id)};
        }
        case "friends/DECREASE_TOTAL_FRIENDS_COUNT": {
            return {...state, totalFriendsCount: state.totalFriendsCount - 1}
        }
        default:
            return state;
    }
}

export const action = {
    setFriends: (users: Array<UsersType>, replase: boolean = false) => ({type: "friends/SET_FRIENDS", users, replase} as const),
    setCurrentPage: (currentPage: number) => ({type: "friends/SET_CURENT_PAGE", currentPage} as const),
    setTotalFriendsCount: (totalFriendsCount: number) => ({type: "friends/SET_TOTAL_FRIENDS_COUNT", count: totalFriendsCount} as const),
    toggleIsFetching: (isFetching: boolean) => ({type: "friends/TOGGLE_IS_FETCHING", isFetching} as const),
    setFilter: (filter: FilterType) => ({type: "friends/SET_FILTER", payload: filter} as const),
    unfollowSuccessFriends: (userId: number) => ({type: "friends/UNFOLLOW", userId} as const),
    toggleFollowingProgressFriends: (isFetching: boolean, userId: number) => ({type: "friends/TOGGLE_IS_FOLLOWING_PROGRESS", isFetching, userId} as const),
    deleteUnfollowFriend: (id: number) => ({type: "friends/DELETE_UNFOLLOW_FRIEND", id} as const),
    decreaseTotalFriendsCount: () => ({type: "friends/DECREASE_TOTAL_FRIENDS_COUNT"} as const)
}

export const getFriends = (currentPage: number, pageSize: number, filter: FilterType, replase: boolean = false): ThunkType => {
    return async (dispatch: AppDispatch) => {
        dispatch(action.toggleIsFetching(true));
        dispatch(action.setCurrentPage(currentPage));
        dispatch(action.setFilter(filter));
        let data = await userAPI.getUsers(currentPage, pageSize, filter.term, filter.friend);
        if(!data.error) {
            dispatch(action.toggleIsFetching(false));
            dispatch(action.setFriends(data.items, replase));
            dispatch(action.setTotalFriendsCount(data.totalCount));
        } else {
            dispatch(appActions.addGlobalMessage({id: v1(), message: `Error getting friends: ${data.error}`, type: "error"}));
            dispatch(action.toggleIsFetching(false));
        }
    }
}

export const deleteFriend = (userId: number) => async (dispatch: Dispatch<any>, getState: () => AppStateType) => {
    dispatch(action.toggleFollowingProgressFriends(true, userId));
    const friends1 = getState().friendsPage.friends;
    const totalCountBeforeDelete = friends1.length;
    let responseUnfollow = await userAPI.unfollow(userId);

    if (responseUnfollow.resultCode === 0) {
        dispatch(action.deleteUnfollowFriend(userId));
        dispatch(action.decreaseTotalFriendsCount());
        const stateAfterUnfollow = getState().friendsPage;
        const totalCountAfterDelete = stateAfterUnfollow.friends.length;
    
        if ((totalCountAfterDelete < totalCountBeforeDelete && stateAfterUnfollow.currentPage < stateAfterUnfollow.totalFriendsCount / stateAfterUnfollow.pageSize) || stateAfterUnfollow.totalFriendsCount > stateAfterUnfollow.friends.length) {
            const response = await userAPI.getUsers(stateAfterUnfollow.currentPage, stateAfterUnfollow.pageSize, stateAfterUnfollow.filter.term, stateAfterUnfollow.filter.friend);
            const lastUser = [response.items[response.items.length - 1]];
            if (lastUser) {
                dispatch(action.setFriends(lastUser, false));
            }
        }
    } else {
        dispatch(appActions.addGlobalMessage({id: v1(), message: `Unfollow error: ${responseUnfollow.messages[0]}`, type: "error"}));
    }
    dispatch(action.toggleFollowingProgressFriends(false, userId));
};

export default friendsReducer;