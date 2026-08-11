import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import type { Attendance as AttendanceType } from '../../types';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { CalendarIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const Attendance: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [attendances, setAttendances] = useState<AttendanceType[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        half_day: 0,
    });
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchAttendance();
    }, [date]);

    const fetchAttendance = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.get('/attendances/today', { params: { date } });
            setAttendances(response.data.attendances);
            setStats(response.data.stats);
        } catch (error) {
            toast.error('Erreur lors du chargement des présences');
        } finally {
            setLoading(false);
        }
    };

    const handleClockIn = async (): Promise<void> => {
        if (!user?.employee?.id) {
            toast.error('Utilisateur non authentifié');
            return;
        }

        try {
            await axios.post('/attendances/clock-in', {
                employee_id: user.employee.id,
                method: 'manual',
            });
            toast.success('Pointage entrée enregistré');
            fetchAttendance();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du pointage');
        }
    };

    const handleClockOut = async (): Promise<void> => {
        if (!user?.employee?.id) {
            toast.error('Utilisateur non authentifié');
            return;
        }

        try {
            await axios.post('/attendances/clock-out', {
                employee_id: user.employee.id,
            });
            toast.success('Pointage sortie enregistré');
            fetchAttendance();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du pointage');
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Présences</h1>
                    <p className="text-gray-500 mt-1">Gestion des pointages et présences</p>
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <button
                        onClick={handleClockIn}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                        Pointer entrée
                    </button>
                    <button
                        onClick={handleClockOut}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                    >
                        Pointer sortie
                    </button>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                                    Statut
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            attendance.status === 'present'
                                                ? 'bg-green-100 text-green-800'
                                                : attendance.status === 'absent'
                                                ? 'bg-red-100 text-red-800'
                                                : attendance.status === 'late'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : attendance.status === 'half_day'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {attendance.status === 'present' ? 'Présent' :
                                                attendance.status === 'absent' ? 'Absent' :
                                                attendance.status === 'late' ? 'Retard' :
                                                attendance.status === 'half_day' ? 'Demi-journée' :
                                                attendance.status === 'holiday' ? 'Férié' : 'Congé'}
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