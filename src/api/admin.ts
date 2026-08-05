import axios from './axios';

interface ListParams {
    [key: string]: any;
}

interface TenantData {
    [key: string]: any;
}

export const admin = {
    stats: () => axios.get('/admin/stats'),
    tenants: {
        list: (params?: ListParams) => axios.get('/admin/tenants', { params }),
        search: (q: string) => axios.get('/admin/tenants/search', { params: { q } }),
        show: (id: string | number) => axios.get(`/admin/tenants/${id}`),
        create: (data: TenantData) => axios.post('/admin/tenants', data),
        update: (id: string | number, data: TenantData) => axios.put(`/admin/tenants/${id}`, data),
        delete: (id: string | number) => axios.delete(`/admin/tenants/${id}`),
        activate: (id: string | number) => axios.post(`/admin/tenants/${id}/activate`),
        deactivate: (id: string | number) => axios.post(`/admin/tenants/${id}/deactivate`),
        updateSubscription: (id: string | number, data: TenantData) => axios.put(`/admin/tenants/${id}/subscription`, data),
        stats: (id: string | number) => axios.get(`/admin/tenants/${id}/stats`),
        export: () => axios.get('/admin/tenants/export', { responseType: 'blob' }),
    },
};