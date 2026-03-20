import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import cont from './Users.module.css';
import Paginator from '../common/Paginator/Paginator';
import User from './User';
import UsersSearchForm from '../Users/UsersSearchForm';
import { FilterType, follow, getUsers, unfollow } from '../../redux/users-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentPage, getFilter, getFollowingInProgress, getIsFetching, getPageSize, getTotalUsersCount, requestUsers } from '../../redux/users-selectors';
import { useLocation, useNavigate } from 'react-router-dom';
import Preloader from '../common/Preloader/Preloader';
import { selectorIsAuth } from '../../redux/auth-selectors';

type PropsType = {
    pageTitle: string
}

type OptionsParams = {
    newFilter?: FilterType,
    newPage?: number
}

let Users: React.FC<PropsType> = (props) => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const location = useLocation();

    const users = useSelector(requestUsers);
    const totalUsersCount = useSelector(getTotalUsersCount);
    const currentPage = useSelector(getCurrentPage);
    const pageSize = useSelector(getPageSize);
    const filter = useSelector(getFilter);
    const followingInProgress = useSelector(getFollowingInProgress);
    const isFetching = useSelector(getIsFetching);
    const isAuth = useSelector(selectorIsAuth);
    const errorResetFormRef = useRef<(() => void) | null>(null);
    const isSkipFilterUpdateRef = useRef(false);
    const isFirstRenderRef = useRef(true);
    let pagesCount = Math.ceil(totalUsersCount / pageSize);

    const queryURL = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const friendValue = params.get('friend');
        const friend = friendValue === "true" ? true : friendValue === 'false' ? false : null;
        const page = ((n => (isNaN(n) || n < 1 ? 1 : Math.floor(n)))(Number(params.get("page"))));

        return {
            term: params.get('term') || '',
            friend,
            page,
        };
    }, [location.search]);

    const filterControlUpdate = (isURLChanged: boolean, options?: OptionsParams) => {
        const params = new URLSearchParams();
        const { newFilter, newPage } = options ?? {};
        if (isURLChanged) {
            if (!isSkipFilterUpdateRef.current) {
                if ((filter.term !== "" && queryURL.term === "" || filter.friend !== null && queryURL.friend === null || currentPage !== 1 && queryURL.page === 1) && isFirstRenderRef.current) {
                    params.set('term', filter.term);
                    if (filter.friend !== null) params.set('friend', String(filter.friend));
                    if (currentPage !== 1) params.set("page", String(currentPage))
                    history({ pathname: '/users', search: params.toString() });
                } else if (filter.term === queryURL.term && filter.friend === queryURL.friend && currentPage === queryURL.page && (filter.term !== "" || filter.friend !== null || currentPage !== 1) && isFirstRenderRef.current) {
                    isFirstRenderRef.current = false;
                } else {
                    if (filter.term !== queryURL.term || filter.friend !== queryURL.friend || currentPage !== queryURL.page || users.length <= 0) {
                        //isFirstRenderRef.current = false;
                        dispatch(getUsers(queryURL.page, pageSize, {term: queryURL.term, friend: queryURL.friend}));
                    }
                    isFirstRenderRef.current = false;
                }
            }
            isSkipFilterUpdateRef.current = false;
        } else {
            if (newFilter) {
                if ((newFilter.term !== queryURL.term || newFilter.friend !== queryURL.friend || currentPage !== 1) || users.length <= 0) {
                    isFirstRenderRef.current = false;
                    dispatch(getUsers(1, pageSize, newFilter));
                    if (newFilter.term) {
                        params.set('term', newFilter.term);
                    }
                    if (newFilter.friend !== null) {
                        params.set('friend', String(newFilter.friend));
                    }
                    history({ pathname: '/users', search: params.toString() });
                }
            }
            if (newPage) {
                if (newPage !== queryURL.page || users.length <= 0) {
                    isFirstRenderRef.current = false;
                    let urlQueryString = (filter.term === '' ? '' : `&term=${filter.term}`) + (filter.friend === null ? '' : `&friend=${filter.friend}`) + (newPage === 1 ? '' : `&page=${newPage}`);
                    dispatch(getUsers(newPage, pageSize, filter));
                    history({ pathname: '/users', search: urlQueryString });
                }
            }
        }
    };

    const onPageChanged = useCallback((pageNumber: number) => {
        isSkipFilterUpdateRef.current = true;
        filterControlUpdate(false, {newPage: pageNumber});
    }, [pagesCount, queryURL.page]);

    const onFilterChanged = useCallback((newFilter: FilterType) => {
        if (newFilter.term == filter.term && newFilter.friend == filter.friend && currentPage === 1) return;
        isSkipFilterUpdateRef.current = true;
        filterControlUpdate(false, {newFilter});
    }, [filter, queryURL, users.length]);

    const followConst = useCallback((userId: number) => {
        dispatch(follow(userId));
    }, [dispatch]);

    const unfollowConst = useCallback((userId: number) => {
        dispatch(unfollow(userId));
    }, [dispatch]);

    const onErrorResetFilters = () => {
        onFilterChanged({term: "", friend: null})
        if (errorResetFormRef.current) {
            errorResetFormRef.current();
        }
    };

    useEffect(() => {
        filterControlUpdate(true);
        if (isFirstRenderRef.current) {
            isSkipFilterUpdateRef.current = true;
            isFirstRenderRef.current = false;
        }
    }, [queryURL.term, queryURL.friend, queryURL.page]);

    if (currentPage <= 0 || currentPage > pagesCount) {
        return (
            <div>
                <h4>{props.pageTitle}</h4>
                <UsersSearchForm onResetForm={(resetForm) => (errorResetFormRef.current = resetForm)} currentPage={currentPage} isFetching={isFetching} onFilterChanged={onFilterChanged} onPageChanged={onPageChanged} isAuth={isAuth} />
                {isFetching ? <Preloader /> : <p>Не смогли найти результаты удовлитворящие параметры поиска. Попробуйте <button type='button' className={cont.resetErrorFilter} onClick={onErrorResetFilters}>сбросить фильтр</button></p>}
            </div>
        )
    }
    return (
        <div className={cont.users}>
            <h4>{props.pageTitle}</h4>
            <UsersSearchForm currentPage={currentPage} isFetching={isFetching} onFilterChanged={onFilterChanged} onPageChanged={onPageChanged} isAuth={isAuth} />
            <div className={cont.container}>
                <Paginator currentPage={currentPage} onPageChanged={onPageChanged} totalUsersCount={totalUsersCount} pageSize={pageSize} />
                {isFetching ? <Preloader /> : users.map(u => <User user={u} key={u.id} followingInProgress={followingInProgress} follow={followConst} unfollow={unfollowConst} isAuth={isAuth} />)
                }
            </div>
        </div>
    )
}

export default Users;