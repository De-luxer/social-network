import * as axios from 'axios';

const instans = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    headers: {
        "API-KEY": "b744c9ff-7235-479c-92d1-21792cf96f7c"
    }
});

export const profileAPI = {
    getProfile (userId) {
        return instans.get(`profile/${userId}`);
    },
    getStatus(userId) {
        return instans.get(`profile/status/${userId}`);
    },
    updateStatus(status) {
        return instans.put(`profile/status`, {status: status});
    }
}

export const userAPI = {
    getUsers (currentPage = 1, pageSize = 2) {
        return instans.get(`users?page=${currentPage}&count=${pageSize}`)
            .then(response => { 
                return response.data;
            });
    },
    follow(userId) {
        return instans.post(`follow/${userId}`);
    },
    unfollow(userId) {
        return instans.delete(`follow/${userId}`);
    },
    getProfile (userId) {
        console.warn("You use old method");
        return profileAPI.getProfile(userId);
    }
}

export const authAPI = {
    me () {
        return instans.get(`auth/me`);
    },
    login (email, password, rememberMe = false) {
        return instans.post(`auth/login`, {email, password, rememberMe});
    },
    logout () {
        return instans.delete(`auth/login`);
    },
}