import React, { useCallback, useEffect, useRef } from "react"
import cont from './../Users/Users.module.css';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { deleteFriend, getFriends } from "../../redux/friends-reducer";
import { AppStateType } from "../../redux/redux-store";
import { FilterType } from "../../redux/users-reducer";
import Preloader from "../common/Preloader/Preloader";
import User from "../Users/User";
import FriendsSearchForm from "./FriendsSearchForm";
import PreloaderThreeDots from "../common/Preloader/PreloaderThreeDots";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const Friends = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams(location.search);
    const observer = useRef<IntersectionObserver | null>(null);

    const friends = useSelector((state: AppStateType) => state.friendsPage.friends);
    const currentPage = useSelector((state: AppStateType) => state.friendsPage.currentPage);
    const pageSize = useSelector((state: AppStateType) => state.friendsPage.pageSize);
    const totalFriendsCount = useSelector((state: AppStateType) => state.friendsPage.totalFriendsCount);
    const filter = useSelector((state: AppStateType) => state.friendsPage.filter);
    const isFetching = useSelector((state: AppStateType) => state.friendsPage.isFetching);
    const followingInProgress = useSelector((state: AppStateType) => state.friendsPage.followingInProgress);
    const loadType = useRef("circle");
    let parsedParams = Object.fromEntries([...searchParams]);
    let pagesCount = Math.ceil(totalFriendsCount / pageSize);

    const onFilterChanged = useCallback((filter: FilterType) => {
        loadType.current = "circle";
        dispatch(getFriends(1, pageSize, filter, true));
    }, [dispatch, pageSize]);

    const lastFriendElementRef = useCallback((node: any) => {
        if (isFetching) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && friends.length < totalFriendsCount && currentPage < pagesCount) {
                loadType.current = "dots";
                dispatch(getFriends(currentPage + 1, pageSize, filter));
            }
        });
        if (node) observer.current.observe(node);
    }, [isFetching, currentPage, friends.length, totalFriendsCount]
    );

    const unfollowConst = useCallback((userId: number) => {
        dispatch(deleteFriend(userId));
    }, [dispatch]);

    useEffect(() => {
        if(friends.length === 0) {
            let actualFilter = filter;
            if(parsedParams.term){
                actualFilter = {...actualFilter, term: parsedParams.term as string};
            }
            dispatch(getFriends(currentPage, pageSize, actualFilter));
        }
    }, []);

    useEffect(() => {
        let urlQueryString = (filter.term === '' ? '' : `&term=${filter.term}`);
        history({
            pathname: '/friends',
            search: urlQueryString
        });
    }, [filter]);

    useEffect(() => {
        if (friends.length === 0 || parsedParams.term === filter.term) return;

        let actualFilter = filter;
        if (!parsedParams.term) {
            actualFilter = {...actualFilter, term: "" as string};
        } else {
            actualFilter = {...actualFilter, term: parsedParams.term as string};
        }
        dispatch(getFriends(1, pageSize, actualFilter, true));
    }, [location.search]);

    if (totalFriendsCount <= 0 && filter.term === "") {
        return (
            <div className={cont.friends_null}>
                <h4>Friends</h4>
                {isFetching && loadType.current === "circle" ? <Preloader /> : <div>
                    <h5>Looks like you don't have any friends :(</h5>
                    <p>But don’t be discouraged because you can always <NavLink to="/users">find</NavLink> them!</p>
                </div>}
            </div>
        )
    } else if (totalFriendsCount <= 0 && filter.term !== "") {
        return (
            <div>
                <h4>Friends</h4>
                <FriendsSearchForm currentPage={currentPage} isFetching={isFetching} onFilterChanged={onFilterChanged} />
                {isFetching ? <Preloader /> : <p>We couldn't find any results matching your search criteria. Try <button type='button' className={cont.resetErrorFilter} onClick={() => { onFilterChanged({ term: "", friend: true }); }}>resetting the filter.</button></p>}
            </div>
        )
    }

    return (
        <div className={cont.body}>
            <h4>Friends - {totalFriendsCount} --- {friends.length}</h4>
            <FriendsSearchForm currentPage={currentPage} isFetching={isFetching} onFilterChanged={onFilterChanged} />
            {isFetching && loadType.current === "circle" ? <Preloader /> : <div className={cont.container}>
                <TransitionGroup component={null}>
                    {friends.map((f) => {
                        return (
                            <CSSTransition key={f.id} timeout={300} classNames={{enter: cont.enter, enterActive: cont.enter_active, exit: cont.leave, exitActive: cont.leave_active}}>
                                <div ref={(el) => {if (f.id === friends[friends.length - 1]?.id && el) lastFriendElementRef(el)}}>
                                    <User user={f} isFriendPage={true} unfollow={unfollowConst} followingInProgress={followingInProgress}/>
                                </div>
                            </CSSTransition>
                        );
                    })}
                </TransitionGroup>
            </div>}
            {isFetching && loadType.current === "dots" ? <PreloaderThreeDots isCenter={true} /> : null}
        </div>
    )
}

export default Friends;