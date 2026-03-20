import React from 'react';
import Info from './Info/Info';
import { ProfileType } from '../../types/types';
import cont from './Profile.module.css'
import { ProfileErroreType } from '../../redux/profile-reducer';

type PropsType = {
    profile: ProfileType | null
    status: string
    isOwner: boolean
    profileErrore: ProfileErroreType

    updateStatus: (status: string) => void
    savePhoto: (file: File) => void
    saveProfile: (profile: ProfileType) => Promise<any>
}

const Profile: React.FC<PropsType> = (props) => {
    return (
        <div className={cont.profile}>
            <Info profile={props.profile} status={props.status} updateStatus={props.updateStatus} isOwner={props.isOwner} savePhoto={props.savePhoto} saveProfile={props.saveProfile} profileErrore={props.profileErrore} />
            {/* <MyPostsContainer newPostText={''}  profileErrore={props.profileErrore}/> */}
        </div>
    );
}

export default Profile;