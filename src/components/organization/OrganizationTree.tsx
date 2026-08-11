import React, { useState, useEffect } from 'react';
import type { OrganizationNode } from '../../types';
import axios from '../../api/axios';
import { organizationChart } from '../../api/organizationChart';
import toast from 'react-hot-toast';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
    UserIcon,
    ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

interface OrganizationTreeProps {
   //onSelectNode?: (node: OrganizationNode) => void;
}

const OrganizationTree: React.FC<OrganizationTreeProps> = () => {
    const [nodes, setNodes] = useState<OrganizationNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingNode, setEditingNode] = useState<OrganizationNode | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        node_type: 'department',
        employee_id: '',
        parent_id: '',
    });
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        fetchTree();
        fetchEmployees();
    }, []);

    const fetchTree = async () => {
        try {
            const response = await organizationChart.tree();
            setNodes(response.data);
            // Expand first level by default
            const firstLevelIds = new Set<number>();
            response.data.forEach((node: OrganizationNode) => {
                firstLevelIds.add(node.id);
            });
            setExpandedNodes(firstLevelIds);
        } catch (error) {
            toast.error('Erreur lors du chargement de l\'organigramme');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/employees', { params: { per_page: 100 } });
            setEmployees(response.data.data);
        } catch (error) {
            console.error('Erreur chargement employés', error);
        }
    };

    const toggleNode = (nodeId: number) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const data: Partial<OrganizationNode> = {
                ...formData,
                // ensure node_type matches the OrganizationNode union type
                node_type: formData.node_type as OrganizationNode['node_type'],
                employee_id: formData.employee_id !== '' ? Number(formData.employee_id) : undefined,
                parent_id: formData.parent_id !== '' ? Number(formData.parent_id) : undefined,
            };

            if (editingNode) {
                await organizationChart.update(editingNode.id, data);
                toast.success('Nœud mis à jour avec succès');
            } else {
                await organizationChart.create(data);
                toast.success('Nœud créé avec succès');
            }
            resetForm();
            fetchTree();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (node: OrganizationNode) => {
        if (node.children && node.children.length > 0) {
            toast.error('Impossible de supprimer ce nœud car il a des enfants');
            return;
        }
        if (!confirm(`Supprimer "${node.title}" ?`)) return;
        try {
            await organizationChart.delete(node.id);
            toast.success('Nœud supprimé');
            fetchTree();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const resetForm = () => {
        setFormData({ title: '', node_type: 'department', employee_id: '', parent_id: '' });
        setEditingNode(null);
        setShowForm(false);
    };

    const editNode = (node: OrganizationNode) => {
        setEditingNode(node);
        setFormData({
            title: node.title,
            node_type: node.node_type,
            employee_id: String(node.employee_id || ''),
            parent_id: String(node.parent_id || ''),
        });
        setShowForm(true);
    };

    const getNodeIcon = (type: string) => {
        switch (type) {
            case 'department': return BuildingOfficeIcon;
            case 'position': return BriefcaseIcon;
            case 'employee': return UserIcon;
            default: return BuildingOfficeIcon;
        }
    };

    const getNodeColor = (type: string) => {
        switch (type) {
            case 'department': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'position': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'employee': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const renderNode = (node: OrganizationNode, level: number = 0) => {
        const Icon = getNodeIcon(node.node_type);
        const colorClass = getNodeColor(node.node_type);
        const isExpanded = expandedNodes.has(node.id);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id} className="relative">
                <div 
                    className={`flex items-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors ${level > 0 ? 'ml-8' : ''}`}
                    style={{ marginLeft: level * 20 }}
                >
                    <button
                        onClick={() => hasChildren && toggleNode(node.id)}
                        className="mr-2 text-gray-400 hover:text-gray-600"
                    >
                        {hasChildren ? (
                            isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />
                        ) : (
                            <span className="w-4 h-4 inline-block" />
                        )}
                    </button>

                    <div className={`flex items-center space-x-3 px-3 py-1.5 rounded-lg border ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{node.title}</span>
                        {node.employee && (
                            <span className="text-xs text-gray-500">
                                ({node.employee.user?.first_name} {node.employee.user?.last_name})
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-1 ml-3">
                        <button
                            onClick={() => {
                                setFormData({ ...formData, parent_id: String(node.id) });
                                setShowForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Ajouter un enfant"
                        >
                            <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => editNode(node)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Modifier"
                        >
                            <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => handleDelete(node)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Supprimer"
                        >
                            <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {isExpanded && hasChildren && (
                    <div className="border-l-2 border-gray-200 ml-4">
                        {node.children!.map((child) => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className='text-3xl font-bold text-gray-900'>Organigramme</h1>
                    <p className='text-gray-500 mt-5'>
                        Structure hiérarchique de l'organisation
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setFormData({ title: '', node_type: 'department', employee_id: '', parent_id: '' });
                            setEditingNode(null);
                            setShowForm(true);
                        }}
                        className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Ajouter
                    </button>
                    <button
                        onClick={fetchTree}
                        className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                        <ArrowsUpDownIcon className="h-4 w-4 mr-2" />
                        Rafraîchir
                    </button>
                </div>
            </div>

            {/* Formulaire */}
            {showForm && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Titre *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Ex: Direction Technique"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type *</label>
                                <select
                                    value={formData.node_type}
                                    onChange={(e) => setFormData({ ...formData, node_type: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    required
                                >
                                    <option value="department">Département</option>
                                    <option value="position">Poste</option>
                                    <option value="employee">Employé</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Employé associé</label>
                                <select
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">Aucun</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.user?.first_name} {emp.user?.last_name} ({emp.employee_number})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Parent</label>
                                <select
                                    value={formData.parent_id}
                                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">Racine</option>
                                    {nodes.map((node) => (
                                        <option key={node.id} value={node.id}>
                                            {'- '.repeat(node.level + 1)}{node.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                            >
                                {editingNode ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Arbre */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                {nodes.length === 0 ? (
                    <div className="text-center py-12">
                        <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="mt-2 text-gray-500">Aucun nœud dans l'organigramme</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 text-primary-600 hover:text-primary-700"
                        >
                            + Ajouter le premier nœud
                        </button>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {nodes.map((node) => renderNode(node, 0))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizationTree;