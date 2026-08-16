import axios from './axios';

interface ListParams {
    [key: string]: any;
}

/**
 * Endpoints du portail employé ("Mon espace"). Toutes ces routes sont
 * scopées côté backend sur l'employé du compte connecté : elles ne
 * requièrent aucune permission particulière et sont accessibles à tout
 * utilisateur disposant d'un dossier employé (employee, manager,
 * admin_org...).
 */
export const portal = {
    summary: () => axios.get('/portal/summary'),

    leaves: (params?: ListParams) => axios.get('/portal/leaves', { params }),
    leaveBalance: () => axios.get('/portal/leaves/balance'),

    documents: (params?: ListParams) => axios.get('/portal/documents', { params }),
    uploadDocument: (formData: FormData) =>
        axios.post('/portal/documents', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    downloadDocument: (id: number | string) =>
        axios.get(`/portal/documents/${id}/download`, { responseType: 'blob' }),
    deleteDocument: (id: number | string) => axios.delete(`/portal/documents/${id}`),

    payslips: (params?: ListParams) => axios.get('/portal/payslips', { params }),
    payslip: (id: number | string) => axios.get(`/portal/payslips/${id}`),
    downloadPayslip: (id: number | string) =>
        axios.get(`/portal/payslips/${id}/download`, { responseType: 'blob' }),

    // Module carrière — lecture seule de mon propre parcours.
    history: () => axios.get('/portal/history'),
};

export default portal;