import axios from './axios';
import type { ContractAmendment } from '../types';

export const contractAmendments = {
    index: (contractId: number) => axios.get(`/contracts/${contractId}/amendments`),
    store: (contractId: number, data: Partial<ContractAmendment>) =>
        axios.post(`/contracts/${contractId}/amendments`, data),
    delete: (amendmentId: number) => axios.delete(`/amendments/${amendmentId}`),
};