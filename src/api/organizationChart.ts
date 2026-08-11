import axios from './axios';
import type { OrganizationNode } from '../types';

export const organizationChart = {
    index: (params?: any) => axios.get('/organigram', { params }),
    tree: () => axios.get('/organigram/tree'),
    create: (data: Partial<OrganizationNode>) => axios.post('/organigram', data),
    show: (id: number) => axios.get(`/organigram/${id}`),
    update: (id: number, data: Partial<OrganizationNode>) => axios.put(`/organigram/${id}`, data),
    delete: (id: number) => axios.delete(`/organigram/${id}`),
    reorder: (nodes: any[]) => axios.post('/organigram/reorder', { nodes }),
    importDepartments: () => axios.post('/organigram/import-departments'),
};