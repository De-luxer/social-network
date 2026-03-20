import React from 'react';
import { connect } from 'react-redux';
import Profile from './Profile';
import { getUsersProfile, getStatus, actions, ProfileErroreType } from '../../redux/profile-reducer';
import { updateStatus, savePhoto, saveProfile } from '../../redux/auth-reducer'
import { Navigate, useLocation, useNavigate, useParams, } from 'react-router-dom';
import { compose } from 'redux';
import { AppStateType } from '../../redux/redux-store';
import { ProfileType } from '../../types/types';

type MapStatePropsType = ReturnType<typeof mapStateToProps>

type MapDispatchPropsType = {
    getUsersProfile: (userId: number) => void
    getStatus: (userId: number) => void
    updateStatus: (status: string) => void
    savePhoto: (file: File) => void
    saveProfile: (profile: ProfileType) => Promise<any>
    setUserProfile: (profile: ProfileType | null) => void
    setStatus: (status: string) => void
    setProfileErrore: (error: ProfileErroreType) => void
}

type OwnPropsType = {
    router: any
}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType;

class ProfileContainer extends React.Component<PropsType> {
    refreshProfile() {
        let userId;
        if (this.props.router.params.userId) {
            userId = this.props.router.params.userId;
            this.props.getUsersProfile(userId);
            this.props.getStatus(userId);
        } else if (this.props.authorizedUserId) {
            this.props.setProfileErrore({isErrore: false, erroreMessage: ""});
            this.props.setUserProfile(this.props.authProfile);
            this.props.setStatus(this.props.authStatus);
        }
    }

    componentDidMount() {
        this.refreshProfile();
    }

    componentDidUpdate(prevProps: PropsType, prevState: PropsType) {
        if (this.props.router.params.userId !== prevProps.router.params.userId) {
            this.refreshProfile();
        }
        if (this.props.authProfile !== prevProps.authProfile) {
            this.refreshProfile();
        }
        if (this.props.authStatus !== prevProps.authStatus) {
            this.refreshProfile();
        }
    }

    render() {
        if (!this.props.isAuth && !this.props.router.params.userId) {
            return <Navigate to={'/login'} />
        } else if (this.props.isAuth && this.props.authorizedUserId === Number(this.props.router.params.userId)) {
            console.log("SUUUUUUDA")
            return (
                <Profile {...this.props} profile={this.props.profile} status={this.props.status} updateStatus={this.props.updateStatus} isOwner={true} savePhoto={this.props.savePhoto} saveProfile={this.props.saveProfile} profileErrore={this.props.profileErrore} />
            )
        } else {
            console.log("NEEEEEEEEEEEEEEEEEET")
            return (
                <Profile {...this.props} profile={this.props.profile} status={this.props.status} updateStatus={this.props.updateStatus} isOwner={!this.props.router.params.userId} savePhoto={this.props.savePhoto} saveProfile={this.props.saveProfile} profileErrore={this.props.profileErrore} />
            );
        }
    }
}

let mapStateToProps = (state: AppStateType) => {
    return ({
        profile: state.profilePage.profile,
        status: state.profilePage.status,
        authorizedUserId: state.auth.id,
        isAuth: state.auth.isAuth,
        authProfile: state.auth.profile,
        authStatus: state.auth.status,
        profileErrore: state.profilePage.profileErrore
    })
};

function withRouter(Component: any) {
    function ComponentWithRouterProp(props: any) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }
    return ComponentWithRouterProp;
}

export default compose(
    connect(mapStateToProps, {getUsersProfile, getStatus, updateStatus, savePhoto, saveProfile, setUserProfile: actions.setUserProfile, setStatus: actions.setStatus, setProfileErrore: actions.setProfileErrore}),
    withRouter,
)(ProfileContainer);