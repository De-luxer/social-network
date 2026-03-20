import React, { Suspense } from 'react';
import './App.css';
import { Routes, Route, useLocation, useNavigate, useParams, HashRouter, Navigate} from 'react-router-dom';
import store, { AppStateType } from './redux/redux-store';
import { compose } from 'redux';
import { connect, Provider } from 'react-redux';
import { initializeApp } from './redux/app-reducer';
import ProfileContainer from './components/Profile/ProfileContainer';
import Undefined404 from './components/404/Undefined';
import Login from './components/Login/Login'
import UsersPage from './components/Users/UsersPage';
import Preloader from './components/common/Preloader/Preloader';
import Notifications from './components/Notifications/Notifications';
import MainLayout from './layouts/MainLayout/MainLayout';
import AuthLayout from './layouts/AuthLayout/AuthLayout';
import fontAndikaURL from './assets/fonts/Andika-Regular.ttf'

const ChatPage = React.lazy(() => import('./pages/Chat/ChatPage'));
const FriendsPage = React.lazy(() => import('./components/Friends/FriendsPage'));

type StatePropsType = ReturnType<typeof mapStateToProps>;

type DispatchPropsType = {
    initializeApp: () => void
}

type OwnPropsType = {
    router: any
}

class App extends React.Component<StatePropsType & DispatchPropsType & OwnPropsType> {
    catchAllUnhandeledErrors = (promiseRejectionEvent: PromiseRejectionEvent) => {
        // alert("Some error occured");
        console.log("Some error occured");
        console.error(promiseRejectionEvent);
    }
    componentDidMount() {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "font";
        link.href = fontAndikaURL;
        link.type = "font/ttf";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
        this.props.initializeApp();
        window.addEventListener("unhandledrejection", this.catchAllUnhandeledErrors);
    }
    componentWillUnmount() {
        window.removeEventListener("unhandledrejection", this.catchAllUnhandeledErrors);
    }

    render() {
        return (
            <div className="app_root">
                <Notifications />
                {!this.props.initialized ?  <Preloader isFullScren={true} /> : (
                    <>
                        <Routes>
                            <Route element={<AuthLayout />}>
                                <Route path="/login" element={<Login />} />
                            </Route>
                            <Route element={<MainLayout />}>
                                <Route path="/" element={this.props.isAuth ? <Navigate to="/profile" /> : <Navigate to="/login" />} />
                                <Route path="/profile/:userId?" element={<ProfileContainer />} />
                                {/* <Route path="/dialogs/*" element={this.props.isAuth ? <DialogsContainer /> : <Navigate to="/login" />} /> */}
                                <Route path="/chat" element={this.props.isAuth ? <ChatPage /> : <Navigate to="/login" />} />
                                <Route path="/users/*" element={<UsersPage pageTitle="Самураи" />} />
                                <Route path="/friends/*" element={this.props.isAuth ? <FriendsPage /> : <Navigate to="/login" />} />
                                <Route path="*" element={<Undefined404 />} />
                            </Route>
                        </Routes>
                    </>
                )}
            </div>
        )
    }
}

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

let mapStateToProps = (state: AppStateType) => ({
    initialized: state.app.initialized,
    isAuth: state.auth.isAuth
});

let AppContainer = compose<React.ComponentType>(
    withRouter,
    connect(mapStateToProps, {initializeApp})
)(App);

const MainApp: React.FC = (props) => {
    return <HashRouter>
        <Provider store={store}>
            <AppContainer />
        </Provider>
    </HashRouter>
}

export default MainApp;