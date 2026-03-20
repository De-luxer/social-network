import React from 'react';
import Users from './Users';

type UsersPagePropsType = {
    pageTitle: string
}

const UsersPage: React.FC<UsersPagePropsType> = (props) => {
    return <>
        <Users pageTitle={props.pageTitle} />
    </>
}

export default UsersPage;