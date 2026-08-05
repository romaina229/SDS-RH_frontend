import axios from './axios';

interface ListParams {
    [key: string]: any;
}

interface GoalData {
    [key: string]: any;
}

interface ReviewData {
    [key: string]: any;
}

export const performance = {
    goals: {
        list: (params?: ListParams) => axios.get('/performance/goals', { params }),
        create: (data: GoalData) => axios.post('/performance/goals', data),
        update: (id: string | number, data: GoalData) => axios.put(`/performance/goals/${id}`, data),
        delete: (id: string | number) => axios.delete(`/performance/goals/${id}`),
    },
    reviews: {
        list: (params?: ListParams) => axios.get('/performance/reviews', { params }),
        create: (data: ReviewData) => axios.post('/performance/reviews', data),
        update: (id: string | number, data: ReviewData) => axios.put(`/performance/reviews/${id}`, data),
        delete: (id: string | number) => axios.delete(`/performance/reviews/${id}`),
    },
    stats: () => axios.get('/performance/stats'),
};