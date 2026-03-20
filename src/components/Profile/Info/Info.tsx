import React, { ChangeEvent, useState } from 'react';
import Preloader from '../../common/Preloader/Preloader';
import cont from '../Profile.module.css';
import ProfileStatusWithHooks from './ProfileStatusWithHooks';
import ProfileDataFormRedux from './ProfileDataForm';
import { ProfileType } from '../../../types/types';
import Avatar from '../../common/Avatar/Avatar';
import { ProfileErroreType } from '../../../redux/profile-reducer';

type PropsType = {
    profile: ProfileType | null
    status: string
    isOwner: boolean
    profileErrore: ProfileErroreType

    updateStatus: (status: string) => void
    savePhoto: (file: File) => void
    saveProfile: (profile: ProfileType) => Promise<any>
}

const Info: React.FC<PropsType> = (props) => {
    let [editMode, setEditMode] = useState(false);



    const onMainPhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length){
            props.savePhoto(e.target.files[0]);
        }
    }

    const activateEditMode = () => {
        setEditMode(true);
    }

    const deactivateEditMode = () => {
        setEditMode(false);
    }

    const onSubmit = (formData: any) => {
        //props.login(formData.email, formData.password, formData.rememberMe);
        props.saveProfile(formData).then(() => {setEditMode(false)});
        
    }

    if (props.profileErrore.isErrore){
        return <div className={cont.profile_info}>
            <h1 className={cont.errore_message}>{props.profileErrore.erroreMessage}</h1>
        </div>
    } else if (!props.profile){
        return <Preloader />
    } else {
        return (
            <div className={cont.profile_info}>
                <img className={cont.profile_info_img} src={!props.profile.photos.large ? Avatar : props.profile.photos.large} alt="avatar" />
                {props.isOwner ? <input type={'file'} onChange={onMainPhotoSelected} /> : null}
                <div className={cont.info_description}>
                    <h4 className={cont.profile_name}>{props.profile.fullName}</h4>
                    <ProfileStatusWithHooks status={props.status} updateStatus={props.updateStatus} isOwner={props.isOwner} />
                    {editMode ? <ProfileDataFormRedux initialValues={props.profile} profile={props.profile} onSubmit={onSubmit} deactivateEditMode={deactivateEditMode} /> : <ProfileData profile={props.profile}  isOwner={props.isOwner} activateEditMode={activateEditMode} />}
                </div>
            </div>
        );
    }


}

type ProfileDataType = {
    profile: ProfileType
    isOwner: boolean
    activateEditMode: () => void
}

const ProfileData: React.FC<ProfileDataType> = (props) => {
    return <div className={cont.profile_description}>
        {props.isOwner ? <button onClick={props.activateEditMode}>Edit</button> : null}
        {props.profile.aboutMe != null ? <p>About me: {props.profile.aboutMe}</p> : null}
        {props.profile.lookingForAJob ? <p>Looking for a job: yes</p> : <p>Looking for a job: no</p>}
        {props.profile.lookingForAJob ? <p>Working status: {props.profile.lookingForAJobDescription}</p> : null}
        <div>Contacts:
            <ul className={cont.contacts_list}>
                <li>Facebook: {props.profile.contacts.facebook ? props.profile.contacts.facebook : '-'}</li>
                <li>Website: {props.profile.contacts.website ? props.profile.contacts.website : '-'}</li>
                <li>VK: {props.profile.contacts.vk ? props.profile.contacts.vk : '-'}</li>
                <li>Twitter: {props.profile.contacts.twitter ? props.profile.contacts.twitter : '-'}</li>
                <li>Instagram: {props.profile.contacts.instagram ? props.profile.contacts.instagram : '-'}</li>
                <li>Youtube: {props.profile.contacts.youtube ? props.profile.contacts.youtube : '-'}</li>
                <li>Github: {props.profile.contacts.github ? props.profile.contacts.github : '-'}</li>
                <li>MainLink: {props.profile.contacts.mainLink ? props.profile.contacts.mainLink : '-'}</li>
            </ul>
        </div>
    </div>
}

export default Info;