import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { portal } from '../../api/portal';
import toast from 'react-hot-toast';
import {
    PlusIcon,
    DocumentIcon,
    TrashIcon,
    ArrowDownTrayIcon as DownloadIcon,
    FolderIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface PortalDocument {
    id: number;
    name: string;
    type: string;
    file_size: number;
    expiry_date?: string | null;
    is_expiring_soon?: boolean;
    is_expired?: boolean;
    created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
    contract: 'Contrat',
    diploma: 'Diplôme',
    id_card: "Pièce d'identité",
    pay_slip: 'Bulletin de paie',
    certificate: 'Certificat',
    cv: 'CV',
    photo: 'Photo',
    medical: 'Médical',
    other: 'Autre',
};

const TYPE_COLORS: Record<string, string> = {
    contract: 'text-blue-500',
    diploma: 'text-green-500',
    id_card: 'text-yellow-500',
    pay_slip: 'text-purple-500',
    certificate: 'text-indigo-500',
    cv: 'text-pink-500',
    medical: 'text-red-500',
};

const MyDocuments: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [documents, setDocuments] = useState<PortalDocument[]>([]);
    const [showUpload, setShowUpload] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadData, setUploadData] = useState({
        name: '',
        type: 'other',
        expiry_date: '',
        document: null as File | null,
    });

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async (): Promise<void> => {
        try {
            const response = await portal.documents({ per_page: 100 });
            setDocuments(response.data.data);
        } catch (error) {
            toast.error('Erreur lors du chargement de vos documents');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadData((prev) => ({
            ...prev,
            document: file,
            name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
        }));
    };

    const resetUploadForm = (): void => {
        setUploadData({ name: '', type: 'other', expiry_date: '', document: null });
        setShowUpload(false);
    };

    const handleUpload = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!uploadData.document || !uploadData.name) {
            toast.error('Veuillez choisir un fichier et renseigner un nom');
            return;
        }

        const formData = new FormData();
        formData.append('name', uploadData.name);
        formData.append('type', uploadData.type);
        formData.append('document', uploadData.document);
        if (uploadData.expiry_date) {
            formData.append('expiry_date', uploadData.expiry_date);
        }

        setUploading(true);
        try {
            await portal.uploadDocument(formData);
            toast.success('Document ajouté avec succès');
            resetUploadForm();
            fetchDocuments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de l'ajout du document");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (doc: PortalDocument): Promise<void> => {
        try {
            const response = await portal.downloadDocument(doc.id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error('Erreur lors du téléchargement');
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
        try {
            await portal.deleteDocument(id);
            toast.success('Document supprimé');
            fetchDocuments();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    const expiringSoon = documents.filter((d) => d.is_expiring_soon && !d.is_expired);
    const expired = documents.filter((d) => d.is_expired);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mes documents</h1>
                    <p className="text-gray-500 mt-1">Votre dossier documentaire personnel (CV, diplômes, pièce d'identité...)</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Ajouter un document
                </button>
            </div>

            {(expired.length > 0 || expiringSoon.length > 0) && (
                <div className="rounded-lg border border-warning-200 bg-warning-50 p-4 flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-warning-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-warning-800">
                        {expired.length > 0 && (
                            <p><b>{expired.length}</b> document(s) expiré(s) — pensez à les renouveler.</p>
                        )}
                        {expiringSoon.length > 0 && (
                            <p><b>{expiringSoon.length}</b> document(s) arrivent à expiration dans les 30 prochains jours.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Formulaire d'ajout */}
            {showUpload && (
                <Card>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Ajouter un document</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                                <input
                                    type="text"
                                    required
                                    value={uploadData.name}
                                    onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type *</label>
                                <select
                                    required
                                    value={uploadData.type}
                                    onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="cv">CV</option>
                                    <option value="diploma">Diplôme</option>
                                    <option value="id_card">Pièce d'identité</option>
                                    <option value="certificate">Certificat</option>
                                    <option value="medical">Médical</option>
                                    <option value="photo">Photo</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date d'expiration (optionnel)</label>
                                <input
                                    type="date"
                                    value={uploadData.expiry_date}
                                    onChange={(e) => setUploadData({ ...uploadData, expiry_date: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fichier *</label>
                                <input
                                    type="file"
                                    required
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                                <p className="text-xs text-gray-400 mt-1">PDF, image ou document Office — 10 Mo max</p>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetUploadForm}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50"
                            >
                                {uploading ? 'Envoi...' : 'Ajouter'}
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
                                <DocumentIcon className={`h-6 w-6 ${TYPE_COLORS[doc.type] || 'text-gray-500'}`} />
                                <div>
                                    <p className="font-medium text-gray-900">{doc.name}</p>
                                    <p className="text-sm text-gray-500">{TYPE_LABELS[doc.type] || doc.type}</p>
                                    <p className="text-xs text-gray-400">{(doc.file_size / 1024).toFixed(1)} KB</p>
                                    {doc.expiry_date && (
                                        <span
                                            className={`mt-1 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                                doc.is_expired
                                                    ? 'bg-red-100 text-red-800'
                                                    : doc.is_expiring_soon
                                                    ? 'bg-warning-100 text-warning-800'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {doc.is_expired ? 'Expiré le ' : "Expire le "}
                                            {new Date(doc.expiry_date).toLocaleDateString('fr-FR')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleDownload(doc)}
                                    className="p-1 text-blue-600 hover:text-blue-900"
                                    title="Télécharger"
                                >
                                    <DownloadIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-1 text-danger-600 hover:text-danger-900"
                                    title="Supprimer"
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
                    <p className="mt-2 text-gray-500">Aucun document pour le moment</p>
                    <button
                        onClick={() => setShowUpload(true)}
                        className="mt-4 text-primary-600 hover:text-primary-700"
                    >
                        + Ajouter mon premier document
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyDocuments;
