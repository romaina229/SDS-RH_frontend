import axios from './axios';

interface ListParams {
    [key: string]: any;
}

interface CreateUserData {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: string;
    password?: string;
    password_confirmation?: string;
}

interface UpdateUserData {
    first_name?: string;
    last_name?: string;
    phone?: string;
    status?: 'active' | 'inactive';
    role?: string;
}

export const administration = {
    users: {
        list: (params?: ListParams) => axios.get('/users', { params }),
        create: (data: CreateUserData) => axios.post('/users', data),
        invite: (data: Omit<CreateUserData, 'password' | 'password_confirmation'>) =>
            axios.post('/users/invite', data),
        update: (id: number, data: UpdateUserData) => axios.put(`/users/${id}`, data),
        delete: (id: number) => axios.delete(`/users/${id}`),
        resendInvitation: (id: number) => axios.post(`/users/${id}/resend-invitation`),
    },
    roles: {
        list: () => axios.get('/roles'),
        create: (data: { name: string; permissions: string[] }) => axios.post('/roles', data),
        update: (id: number, data: { name?: string; permissions?: string[] }) =>
            axios.put(`/roles/${id}`, data),
        delete: (id: number) => axios.delete(`/roles/${id}`),
        permissions: () => axios.get('/permissions'),
    },
};
