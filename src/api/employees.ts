import axios from './axios';

interface ListParams {
    [key: string]: any;
}

interface EmployeeData {
    [key: string]: any;
}


export const employees = {
    list: (params: ListParams) => axios.get('/employees', { params }),
    create: (data: EmployeeData) => axios.post('/employees', data),
    show: (id: string | number) => axios.get(`/employees/${id}`),
    update: (id: string | number, data: EmployeeData) => axios.put(`/employees/${id}`, data),
    delete: (id: string | number) => axios.delete(`/employees/${id}`),
    stats: () => axios.get('/employees/stats'),
};