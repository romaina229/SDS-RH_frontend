//import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';

// Pages d'authentification
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Pages principales
import Dashboard from '../pages/dashboard/Dashboard';
import Employees from '../pages/employees/Employees';
import EmployeeCreate from '../pages/employees/EmployeeCreate';
import EmployeeEdit from '../pages/employees/EmployeeEdit';
import EmployeeShow from '../pages/employees/EmployeeShow';
import Departments from '../pages/departments/Departments';
import Contracts from '../pages/contracts/Contracts';
import Leaves from '../pages/leaves/Leaves';
import LeaveCreate from '../pages/leaves/LeaveCreate';
import Attendance from '../pages/attendance/Attendance';
import QRClock from '../pages/attendance/QRClock';
import Documents from '../pages/documents/Documents';
import Payrolls from '../pages/payroll/Payrolls';
import Recruitments from '../pages/recruitments/Recruitments';
import Trainings from '../pages/trainings/Trainings';
import Reports from '../pages/reports/Reports';
import Settings from '../pages/settings/Settings';
import Profile from '../pages/settings/Profile';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Routes protégées */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Employés */}
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/employees/create" element={<EmployeeCreate />} />
                        <Route path="/employees/:id" element={<EmployeeShow />} />
                        <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

                        {/* Départements */}
                        <Route path="/departments" element={<Departments />} />

                        {/* Contrats */}
                        <Route path="/contracts" element={<Contracts />} />

                        {/* Congés */}
                        <Route path="/leaves" element={<Leaves />} />
                        <Route path="/leaves/create" element={<LeaveCreate />} />

                        {/* Présences */}
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/attendance/qr" element={<QRClock />} />

                        {/* Documents */}
                        <Route path="/documents" element={<Documents />} />

                        {/* Paie */}
                        <Route path="/payroll" element={<Payrolls />} />

                        {/* Recrutement */}
                        <Route path="/recruitments" element={<Recruitments />} />

                        {/* Formations */}
                        <Route path="/trainings" element={<Trainings />} />

                        {/* Rapports */}
                        <Route path="/reports" element={<Reports />} />

                        {/* Paramètres */}
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />

                        {/* Redirection par défaut */}
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRoutes;