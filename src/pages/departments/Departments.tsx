import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import type { Department } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

const Departments: React.FC = () => {
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editing, setEditing] = useState<Department | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        manager_id: '',
        parent_department_id: '',
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async (): Promise<void> => {
        try {
            const response = await axios.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des départements');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                manager_id: formData.manager_id || null,
                parent_department_id: formData.parent_department_id || null,
            };

            if (editing) {
                await axios.put(`/departments/${editing.id}`, payload);
                toast.success('Département mis à jour avec succès');
            } else {
                await axios.post('/departments', payload);
                toast.success('Département créé avec succès');
            }
            resetForm();
            fetchDepartments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) return;
        try {
            await axios.delete(`/departments/${id}`);
            toast.success('Département supprimé avec succès');
            fetchDepartments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const resetForm = (): void => {
        setFormData({ name: '', code: '', description: '', manager_id: '', parent_department_id: '' });
        setEditing(null);
        setShowForm(false);
    };

    const editDepartment = (dept: Department): void => {
        setEditing(dept);
        setFormData({
            name: dept.name,
            code: dept.code || '',
            description: dept.description || '',
            manager_id: String(dept.manager_id || ''),
            parent_department_id: String(dept.parent_department_id || ''),
        });
        setShowForm(true);
    };

    const renderDepartmentTree = (depts: Department[], level: number = 0): React.ReactNode => {
        return depts.map((dept) => (
        <div key={dept.id}>
            <div className={`flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded-lg ${level > 0 ? 'ml-8' : ''}`}>
                <div className="flex items-center space-x-3">
                    {level > 0 && <ChevronRightIcon className="h-4 w-4 text-gray-400" />}
                    <div>
                        <span className="font-medium text-gray-900">{dept.name}</span>
                        {dept.code && <span className="ml-2 text-sm text-gray-500">({dept.code})</span>}
                        {dept.description && <p className="text-sm text-gray-500">{dept.description}</p>}
                    </div>
                </div>
                {hasPermission('edit_departments') && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => editDepartment(dept)}
                            className="p-1 text-blue-600 hover:text-blue-900"
                        >
                            <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(dept.id)}
                            className="p-1 text-danger-600 hover:text-danger-900"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
            {dept.children && dept.children.length > 0 && (
                <div className="ml-4 border-l-2 border-gray-200 pl-4">
                    {renderDepartmentTree(dept.children, level + 1)}
                </div>
            )}
        </div>
    ));
};

if (loading) {
    return <Loading fullScreen />;
}

return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Départements</h1>
                <p className="text-gray-500 mt-1">Gestion des départements de l'organisation</p>
                </div>
                {hasPermission('create_departments') && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nouveau département
                    </button>
                )}
            </div>

            {/* Formulaire */}
            {(showForm || editing) && (
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {editing ? 'Modifier le département' : 'Nouveau département'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Code</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows={2}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Département parent</label>
                                <select
                                    value={formData.parent_department_id}
                                    onChange={(e) => setFormData({...formData, parent_department_id: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="">Aucun</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                            >
                                {editing ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Liste des départements */}
            <Card>
                {departments.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {renderDepartmentTree(departments.filter(d => !d.parent_department_id))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">Aucun département créé</p>
                )}
            </Card>
        </div>
    );
};

export default Departments;