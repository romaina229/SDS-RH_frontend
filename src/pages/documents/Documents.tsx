import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import type { Document } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { downloadBlobResponse } from '../../utils/downloadFile';
import {
    PlusIcon,
    DocumentIcon,
    TrashIcon,
    ArrowDownTrayIcon as DownloadIcon,
    FolderIcon,
} from '@heroicons/react/24/outline';

const Documents: React.FC = () => {
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [showUpload, setShowUpload] = useState<boolean>(false);
    const [uploadData, setUploadData] = useState({
        name: '',
        type: 'other',
        employee_id: '',
        document: null as File | null,
    });

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async (): Promise<void> => {
        try {
            const response = await axios.get('/documents');
            setDocuments(response.data.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des documents');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            setUploadData({
                ...uploadData,
                document: e.target.files[0],
                name: e.target.files[0].name,
            });
        }
    };

    const handleUpload = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!uploadData.document || !uploadData.name) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        const formData = new FormData();
        formData.append('name', uploadData.name);
        formData.append('type', uploadData.type);
        formData.append('document', uploadData.document);
        if (uploadData.employee_id) {
            formData.append('employee_id', uploadData.employee_id);
        }

        try {
            await axios.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Document téléchargé avec succès');
            setShowUpload(false);
            setUploadData({ name: '', type: 'other', employee_id: '', document: null });
            fetchDocuments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du téléchargement');
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
        try {
            await axios.delete(`/documents/${id}`);
            toast.success('Document supprimé');
            fetchDocuments();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleDownload = async (doc: Document): Promise<void> => {
        try {
            const response = await axios.get(`/documents/${doc.id}/download`, {
                responseType: 'blob',
            });
            downloadBlobResponse(response, doc.file_name || doc.name);
        } catch (error) {
            toast.error('Erreur lors du téléchargement');
        }
    };

    const getTypeIcon = (type: string): React.ReactNode => {
        const icons: Record<string, React.ReactNode> = {
            contract: <DocumentIcon className="h-6 w-6 text-blue-500" />,
            diploma: <DocumentIcon className="h-6 w-6 text-green-500" />,
            id_card: <DocumentIcon className="h-6 w-6 text-yellow-500" />,
            pay_slip: <DocumentIcon className="h-6 w-6 text-purple-500" />,
        };
        return icons[type] || <FolderIcon className="h-6 w-6 text-gray-500" />;
    };

    const getTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            contract: 'Contrat',
            diploma: 'Diplôme',
            id_card: 'Pièce d\'identité',
            pay_slip: 'Bulletin de paie',
            certificate: 'Certificat',
            cv: 'CV',
            photo: 'Photo',
            medical: 'Médical',
            other: 'Autre',
        };
        return labels[type] || type;
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                    <p className="text-gray-500 mt-1">Gestion des documents RH</p>
                </div>
                {hasPermission('upload_documents') && (
                    <button
                        onClick={() => setShowUpload(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Télécharger
                    </button>
                )}
            </div>

            {/* Formulaire d'upload */}
            {showUpload && (
                <Card>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Télécharger un document</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                                <input
                                    type="text"
                                    required
                                    value={uploadData.name}
                                    onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type *</label>
                                <select
                                    required
                                    value={uploadData.type}
                                    onChange={(e) => setUploadData({...uploadData, type: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="contract">Contrat</option>
                                    <option value="diploma">Diplôme</option>
                                    <option value="id_card">Pièce d'identité</option>
                                    <option value="pay_slip">Bulletin de paie</option>
                                    <option value="certificate">Certificat</option>
                                    <option value="cv">CV</option>
                                    <option value="photo">Photo</option>
                                    <option value="medical">Médical</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Fichier *</label>
                                <input
                                    type="file"
                                    required
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowUpload(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                            >
                                Télécharger
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Liste des documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                                {getTypeIcon(doc.type)}
                                <div>
                                    <p className="font-medium text-gray-900">{doc.name}</p>
                                    <p className="text-sm text-gray-500">{getTypeLabel(doc.type)}</p>
                                    {doc.employee && (
                                        <p className="text-xs text-gray-400">
                                            {doc.employee.user?.first_name} {doc.employee.user?.last_name}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-400">
                                        {(doc.file_size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleDownload(doc)}
                                    className="p-1 text-blue-600 hover:text-blue-900"
                                >
                                    <DownloadIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-1 text-danger-600 hover:text-danger-900"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {documents.length === 0 && (
                <div className="text-center py-12">
                    <FolderIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="mt-2 text-gray-500">Aucun document</p>
                </div>
            )}
        </div>
    );
};

export default Documents;