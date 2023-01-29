import React, { Suspense } from 'react';
import './App.css';
import { Routes, Route, useLocation, useNavigate, useParams, HashRouter, } from 'react-router-dom';
import HeaderContainer from './components/Header/HeaderContainer';
import Nav from './components/Nav/Nav';
import ProfileContainer from './components/Profile/ProfileContainer';
import Undefined from './components/404/Undefined';
import Login from './components/Login/Login'
import { connect, Provider } from 'react-redux';
import { initializeApp } from './redux/app-reducer';
import { compose } from 'redux';
import Preloader from './components/common/Preloader/Preloader';
import store from './redux/redux-store';

const DialogsContainer = React.lazy(() => import('./components/Dialogs/DialogsContainer'));
const UsersContainer = React.lazy(() => import('./components/Users/UsersContainer'));

class App extends React.Component {
    componentDidMount() {
        this.props.initializeApp();
    }

    render() {
        if (!this.props.initialized) {
            return <Preloader />
        } else {
            return (
                <div className="app-wrapper">
                    <HeaderContainer />
                    <Nav />
                    <div className="app-wrapper-content">
                        <Routes>
                            <Route path="/" element={<Undefined />}/>
                            <Route path="/social-network" element={<Undefined />}/>
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<ProfileContainer />} >
                                    <Route path=":userId" element={<ProfileContainer />} />
                                </Route>
                        </Routes>
                        <Suspense fallback={<h1>Loading...</h1>}>
                            <Routes>
                                <Route path="/dialogs/*" element={<DialogsContainer />} />
                                <Route path="/users/*" element={<UsersContainer />} />
                            </Routes>
                        </Suspense>
                    </div>
                </div>
            );
        }
    }
}

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

//export default connect(null, {getUserData})(App);

let mapStateToProps = (state) => ({
    initialized: state.app.initialized
});

let AppContainer = compose(
    withRouter,
    connect(mapStateToProps, {initializeApp})
)(App);

const MainApp = (props) => {
    return <HashRouter>
        <Provider store={store}>
            <AppContainer />
        </Provider>
    </HashRouter>
}

export default MainApp;