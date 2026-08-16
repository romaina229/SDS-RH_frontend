import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import type { Attendance as AttendanceType, Department } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { CalendarIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TodayResponse {
    stats: {
        total: number;
        present: number;
        absent: number;
        late: number;
        half_day: number;
        holiday: number;
        leave: number;
    };
    attendances: AttendanceType[];
}

const STATUS_LABELS: Record<string, string> = {
    present: 'Présent',
    absent: 'Absent',
    late: 'Retard',
    half_day: 'Demi-journée',
    holiday: 'Férié',
    leave: 'Congé',
};

const STATUS_STYLES: Record<string, string> = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-yellow-100 text-yellow-800',
    half_day: 'bg-blue-100 text-blue-800',
    holiday: 'bg-purple-100 text-purple-800',
    leave: 'bg-gray-100 text-gray-800',
};

const Attendance: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [departmentId, setDepartmentId] = useState<string>('');

    const departmentsQuery = useQuery({
        queryKey: ['departments', 'list'],
        queryFn: async () => (await axios.get<Department[]>('/departments')).data,
        staleTime: 5 * 60 * 1000,
    });

    const attendanceQuery = useQuery({
        queryKey: ['attendances', 'today', date, departmentId],
        queryFn: async () =>
            (await axios.get<TodayResponse>('/attendances/today', {
                params: { date, ...(departmentId ? { department_id: departmentId } : {}) },
            })).data,
        placeholderData: (previous) => previous,
    });

    const invalidateToday = (): Promise<void> =>
        queryClient.invalidateQueries({ queryKey: ['attendances', 'today'] });

    const clockInMutation = useMutation({
        mutationFn: async () => {
            if (!user?.employee?.id) throw new Error('Utilisateur non authentifié');
            return axios.post('/attendances/clock-in', {
                employee_id: user.employee.id,
                method: 'manual',
            });
        },
        onSuccess: async () => {
            toast.success('Pointage entrée enregistré');
            await invalidateToday();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Erreur lors du pointage');
        },
    });

    const clockOutMutation = useMutation({
        mutationFn: async () => {
            if (!user?.employee?.id) throw new Error('Utilisateur non authentifié');
            return axios.post('/attendances/clock-out', {
                employee_id: user.employee.id,
            });
        },
        onSuccess: async () => {
            toast.success('Pointage sortie enregistré');
            await invalidateToday();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || 'Erreur lors du pointage');
        },
    });

    if (attendanceQuery.isLoading) {
        return <Loading fullScreen />;
    }

    const stats = attendanceQuery.data?.stats ?? {
        total: 0, present: 0, absent: 0, late: 0, half_day: 0, holiday: 0, leave: 0,
    };
    const attendances = attendanceQuery.data?.attendances ?? [];
    const departments = departmentsQuery.data ?? [];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Présences</h1>
                    <p className="text-gray-500 mt-1">Gestion des pointages et présences</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        <option value="">Tous les départements</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => clockInMutation.mutate()}
                        disabled={clockInMutation.isPending}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium disabled:opacity-50"
                    >
                        {clockInMutation.isPending ? 'Pointage...' : 'Pointer entrée'}
                    </button>
                    <button
                        type="button"
                        onClick={() => clockOutMutation.mutate()}
                        disabled={clockOutMutation.isPending}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium disabled:opacity-50"
                    >
                        {clockOutMutation.isPending ? 'Pointage...' : 'Pointer sortie'}
                    </button>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <UserGroupIcon className="h-8 w-8 text-gray-400" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Présents</p>
                            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        </div>
                        <ClockIcon className="h-8 w-8 text-green-400" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Absents</p>
                            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                        </div>
                        <ClockIcon className="h-8 w-8 text-red-400" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Retards</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                        </div>
                        <ClockIcon className="h-8 w-8 text-yellow-400" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Demi-journée</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.half_day}</p>
                        </div>
                        <CalendarIcon className="h-8 w-8 text-blue-400" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Fériés</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.holiday}</p>
                        </div>
                        <CalendarIcon className="h-8 w-8 text-purple-400" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Congés</p>
                            <p className="text-2xl font-bold text-gray-600">{stats.leave}</p>
                        </div>
                        <CalendarIcon className="h-8 w-8 text-gray-400" />
                    </div>
                </Card>
            </div>

            {/* Liste des présences */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employé
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Entrée
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sortie
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Heures
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Heures sup.
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attendances.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Aucun pointage pour cette date
                                    </td>
                                </tr>
                            )}
                            {attendances.map((attendance) => (
                                <tr key={attendance.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {attendance.employee?.user?.first_name} {attendance.employee?.user?.last_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {attendance.clock_in || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {attendance.clock_out || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {attendance.total_hours ? `${attendance.total_hours}h` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {attendance.overtime_hours ? `${attendance.overtime_hours}h` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_STYLES[attendance.status] || 'bg-gray-100 text-gray-800'}`}>
                                            {STATUS_LABELS[attendance.status] || attendance.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Attendance;
