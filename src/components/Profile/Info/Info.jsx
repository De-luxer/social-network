import React from 'react';
import Preloader from '../../common/Preloader/Preloader';
import cont from '../Profile.module.css';
import avatarPhoto from '../../../assets/images/user-img.png';
import ProfileStatusWithHooks from './ProfileStatusWithHooks';

const Info = (props) => {
    if (!props.profile){
        return <Preloader />
    }

    return (
        <div className={cont.profile_info}>
            <img className={cont.profile_info_img} src={!props.profile.photos.large ? avatarPhoto : props.profile.photos.large} alt="avatar" />
            <div className={cont.profile_info_description}>
                <h4 className={cont.profile_name}>{props.profile.fullName}</h4>
                <div className={cont.profile_description}>
                    <ProfileStatusWithHooks status={props.status} updateStatus={props.updateStatus} />
                    {props.profile.aboutMe != null ? <p>About me: {props.profile.aboutMe}</p> 
                    : '' }
                    <div>Contacts: 
                        <ul className={cont.contacts_list}>
                            <li>Facebook: {props.profile.contacts.facebook != null ? props.profile.contacts.facebook : '-'}</li>
                            <li>Website: {props.profile.contacts.website != null ? props.profile.contacts.website : '-'}</li>
                            <li>VK: {props.profile.contacts.vk != null ? props.profile.contacts.vk : '-'}</li>
                            <li>Twitter: {props.profile.contacts.twitter != null ? props.profile.contacts.twitter : '-'}</li>
                            <li>Instagram: {props.profile.contacts.instagram != null ? props.profile.contacts.instagram : '-'}</li>
                            <li>Youtube: {props.profile.contacts.youtube != null ? props.profile.contacts.youtube : '-'}</li>
                            <li>Github: {props.profile.contacts.github != null ? props.profile.contacts.github : '-'}</li>
                            <li>MainLink: {props.profile.contacts.mainLink != null ? props.profile.contacts.mainLink : '-'}</li>
                        </ul>
                    </div>
                    {props.profile.lookingForAJobDescription != null ? <p>Working status: {props.profile.lookingForAJobDescription}</p> 
                    : '' }
                </div>
            </div>
        </div>
    );
}

export default Info;