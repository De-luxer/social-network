import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { actions, InitialStateType } from '../../redux/dialogs-reducer';
import { AppStateType } from '../../redux/redux-store';
import Dialogs from './Dialogs';

type MapStatePropsType = {
    dialogsPage: InitialStateType
}

type MapDispatchPropsType = {
    addMessage: (newMessageElement: string) => void
}

type OwnPropsType = {
    newMessageElement: string
}

let mapStateToProps = (state: AppStateType) => {
    return {
        dialogsPage: state.dialogsPage
    }
}

export default compose<React.ComponentType>(
    connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStateType>(mapStateToProps, {addMessage: actions.addMessageActionCreator})
)(Dialogs);