import axios from 'axios';
import { ChatMessageType, PhotosType, ProfileType, StatusType, UsersType } from '../types/types';

const instans = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    headers: {
        "API-KEY": "37361371-ad89-4c44-8c5e-fec1cca3d006"
    }
});

type SavePhotoType = {
    photos: PhotosType
}
export const profileAPI = {
    getProfile (userId: number) {
        return instans.get<ProfileType>(`profile/${userId}`).then(res => res.data);
    },
    getStatus(userId: number) {
        return instans.get<string>(`profile/status/${userId}`).then(res => res.data);
    },
    updateStatus(status: string) {
        return instans.put<ResponseType>(`profile/status`, {status: status}).then(res => res.data);
    },
    savePhoto(photoFile: File) {
        const formData = new FormData();
        formData.append('image', photoFile)
        return instans.put<ResponseType<SavePhotoType>>(`/profile/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => res.data);
    },
    saveProfile(profile: ProfileType) {
        return instans.put<ResponseType>(`profile`, profile).then(res => res.data);
    }
}

type GetItemsType = {
    items: Array<UsersType>
    totalCount: number
    error: string | null
}
export const userAPI = {
    getUsers (currentPage = 1, pageSize = 2, term: string = '', friend: null | boolean = null) {
        return instans.get<GetItemsType>(`users?page=${currentPage}&count=${pageSize}&term=${term}` + (friend === null ? '' : `&friend=${friend}`))
            .then(response => {
                return response.data;
            });
    },
    follow(userId: number) {
        return instans.post<ResponseType>(`follow/${userId}`).then(res => res.data);
    },
    unfollow(userId: number) {
        return instans.delete<ResponseType>(`follow/${userId}`).then(res => res.data);
    },
    getProfile (userId: number) {
        console.warn("You use old method");
        return profileAPI.getProfile(userId);
    }
}

type ResponseType<D = {}, RC = ResultCodesEnum> = {
    data: D
    resultCode: RC
    messages: Array<string>
}
export enum ResultCodesEnum {
    Succes = 0,
    Error = 1,
}
export enum ResultCodeForCatcha {
    CaptchaIsRequired = 10
}
type MeResponseTypes = {
    id: number,
    email: string,
    login: string
}
type LoginResponseTypes = {
    userId: number
}
export const authAPI = {
    me () {
        return instans.get<ResponseType<MeResponseTypes>>(`auth/me`).then(res => res.data);
    },
    login (email: string, password: string, rememberMe = false, captcha: null | string = null) {
        return instans.post<ResponseType<LoginResponseTypes, ResultCodesEnum | ResultCodeForCatcha>>(`auth/login`, {email, password, rememberMe, captcha}).then(res => res.data);
    },
    logout () {
        return instans.delete(`auth/login`);
    },
}

type GetCaptchaUrlType = {
    url: string
}
export const securityAPI = {
    getCaptchaUrl () {
        return instans.get<GetCaptchaUrlType>(`security/get-captcha-url`).then(res => res.data);
    }
}


type MessageReceivedSubscriberType = (messages: ChatMessageType[]) => void;
type StatusChangedSubscriberType = (status: StatusType) => void;

let subscribers = {
    'message-received': [] as MessageReceivedSubscriberType[],
    'status-changed': [] as StatusChangedSubscriberType[]
}

let ws: WebSocket | null = null;
type EventsNamesType = 'message-received' | 'status-changed';

const closeHandler = () => {
    notifySubscribersAboutStatus('pending');
    console.log('CHANEL CLOSED');
    setTimeout(createChanel, 3000);
}

const messageHandler = (e: MessageEvent) => {
    const newMessages = JSON.parse(e.data);
    subscribers['message-received'].forEach(s => s(newMessages));
}

const openHandler = () => {
    notifySubscribersAboutStatus('ready');
}

const errorHandler = () => {
    notifySubscribersAboutStatus('error');
    console.error('REFRASH PAGE');
}

const cleanUp = () => {
    ws?.removeEventListener('close', closeHandler);
    ws?.removeEventListener('message', messageHandler);
    ws?.removeEventListener('open', openHandler);
    ws?.removeEventListener('error', errorHandler);
}

const notifySubscribersAboutStatus = (status: StatusType) => {
    subscribers['status-changed'].forEach(s => s(status));
}

function createChanel() {
    cleanUp();
    ws?.close();
    ws = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');
    notifySubscribersAboutStatus('pending');
    ws.addEventListener('close', closeHandler);
    ws.addEventListener('message', messageHandler);
    ws.addEventListener('open', openHandler);
    ws.addEventListener('error', errorHandler);
}

export const ChatAPI = {
    start() {
        createChanel();
    },
    stop() {
        subscribers['message-received'] = [];
        subscribers['status-changed'] = [];
        cleanUp();
        ws?.close();
    },
    subscribe(eventName: EventsNamesType, callback: MessageReceivedSubscriberType | StatusChangedSubscriberType) {
        // @ts-ignore
        subscribers[eventName].push(callback);
        return () => {
            // @ts-ignore
            subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
        }
    },
    unsubscribe(eventName: EventsNamesType, callback: MessageReceivedSubscriberType | StatusChangedSubscriberType) {
        // @ts-ignore
        subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
    },
    sendMessage(message: string) {
        ws?.send(message);
    }
}