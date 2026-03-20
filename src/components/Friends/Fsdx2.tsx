import React, { useCallback, useEffect, useMemo, useRef } from "react"
import cont from './../Users/Users.module.css';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { action, deleteFriend, getFriends } from "../../redux/friends-reducer";
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
    const observer = useRef<IntersectionObserver | null>(null);

    const friends = useSelector((state: AppStateType) => state.friendsPage.friends);
    const currentPage = useSelector((state: AppStateType) => state.friendsPage.currentPage);
    const pageSize = useSelector((state: AppStateType) => state.friendsPage.pageSize);
    const totalFriendsCount = useSelector((state: AppStateType) => state.friendsPage.totalFriendsCount);
    const filter = useSelector((state: AppStateType) => state.friendsPage.filter);
    const isFetching = useSelector((state: AppStateType) => state.friendsPage.isFetching);
    const followingInProgress = useSelector((state: AppStateType) => state.friendsPage.followingInProgress);
    const loadType = useRef("circle");
    const isSyncedRef = useRef(false);
    let pagesCount = Math.ceil(totalFriendsCount / pageSize);

    // Получаем query из URL
    const query = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return {
            term: params.get("term") || "",
        };
    }, [location.search]);

    // Синхронизируем URL -> Redux filter при монтировании
    useEffect(() => {
        if (!isSyncedRef.current && query.term === "" && filter.term !== "") {
            if (query.term !== filter.term) {
                dispatch(action.setFilter({ term: filter.term, friend: true }));
            } else {
                isSyncedRef.current = true;
            }
        } else {
            if (query.term !== filter.term) {
                dispatch(action.setFilter({ term: query.term, friend: true }));
            } else {
                isSyncedRef.current = true;
            }
        }
    }, [query.term, filter.term, dispatch]);

    // Загружаем друзей при изменении filter
    useEffect(() => {
        if (!isSyncedRef.current) return;
        dispatch(getFriends(1, pageSize, filter, true));
    }, [filter, pageSize, dispatch]);

    // Слушаем Redux filter и обновляем URL
    useEffect(() => {
        if (query.term === filter.term) return;
        const params = new URLSearchParams();
        if (filter.term) {
            params.set("term", filter.term);
        }
        history({ pathname: "/friends", search: params.toString() });
    }, [filter.term, history]);

    // Callback формы поиска
    const onFilterChanged = useCallback((newFilter: FilterType) => {
        if (newFilter.term === filter.term) return;
        loadType.current = "circle";
        dispatch(action.setFilter(newFilter));
    }, [dispatch, filter.term]);

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
                            <CSSTransition key={f.id} timeout={300} classNames={{ enter: cont.enter, enterActive: cont.enter_active, exit: cont.leave, exitActive: cont.leave_active }}>
                                <div ref={(el) => { if (f.id === friends[friends.length - 1]?.id && el) lastFriendElementRef(el) }}>
                                    <User user={f} isFriendPage={true} unfollow={unfollowConst} followingInProgress={followingInProgress} />
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