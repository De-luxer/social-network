import React from 'react';
import { connect } from 'react-redux';
import Profile from './Profile';
import { getUsersProfile, getStatus, updateStatus } from '../../redux/profile-reducer';
import { Navigate, useLocation, useNavigate, useParams, } from 'react-router-dom';
import { withAuthRedirect } from '../hoc/withAuthRedirect';
import { compose } from 'redux';

class ProfileContainer extends React.Component {
    componentDidMount() {
        let userId = this.props.router.params.userId;
        if(!userId) {
            userId = this.props.authorizedUserId;
        }
        this.props.getUsersProfile(userId);
        this.props.getStatus(userId);
    }

    render() {
        //console.log("RENDER PROFILE");
        if (!this.props.isAuth && !this.props.router.params.userId) {
            return <Navigate to={'/login'} />
        } else {
            return (
                <Profile {...this.props} profile={this.props.profile} status={this.props.status} updateStatus={this.props.updateStatus} />
            );
        }
    }
}

let mapStateToProps = (state) => {
    //console.log("mapStateToProps PROFILE");
    return ({
        profile: state.profilePage.profile,
        status: state.profilePage.status,
        authorizedUserId: state.auth.id,
        isAuth: state.auth.isAuth
    })
};

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
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
    connect(mapStateToProps, {getUsersProfile, getStatus, updateStatus}),
    withRouter,
    //withAuthRedirect
)(ProfileContainer);