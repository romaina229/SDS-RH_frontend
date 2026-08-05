import axios from './axios';

export const dashboard = {
    index: () => axios.get('/dashboard'),
};