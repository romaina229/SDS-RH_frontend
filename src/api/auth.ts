import axios from './axios';

interface RegisterData {
    [key: string]: any;
}

interface LoginData {
    [key: string]: any;
}

interface ChangePasswordData {
    [key: string]: any;
}

interface UserResponse {
    [key: string]: any;
}

export const auth = {
    register: (data: RegisterData) => axios.post('/register', data),
    login: (data: LoginData) => axios.post('/login', data),
    logout: () => axios.post('/logout'),
    user: () => axios.get<UserResponse>('/user'),
    changePassword: (data: ChangePasswordData) => axios.post('/change-password', data),
    forgotPassword: (email: string) => axios.post('/forgot-password', { email }),
    resetPassword: (data: Record<string, string>) => axios.post('/reset-password', data),
};