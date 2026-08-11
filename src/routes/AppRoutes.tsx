import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import Layout from '../components/common/Layout'; 

// Page publique
import Home from '../pages/marketing/Home';
import ConditionsDUtilisation from '../pages/confidentielle/CondictionsDUtilisation';
import PolitiqueDeConfidentialite from '../pages/confidentielle/PolitiqueDeConfidentialite';

// Pages d'authentification
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Pages principales
import AdminDashboard from '../pages/admin/AdminDashboard';
import Dashboard from '../pages/dashboard/Dashboard';
import Employees from '../pages/employees/Employees';
import EmployeeCreate from '../pages/employees/EmployeeCreate';
import EmployeeEdit from '../pages/employees/EmployeeEdit';
import EmployeeShow from '../pages/employees/EmployeeShow';
import Departments from '../pages/departments/Departments';
import Contracts from '../pages/contracts/Contracts';
import ContractCreate from '../pages/contracts/ContractCreat';
import ContractEdit from '../pages/contracts/ContractEdit';
import ContractShow from '../pages/contracts/ContractShow';
import Notifications from '../pages/notifications/Notifications';
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
import Organigram from '../pages/organigram/Organigram';
import Performance from '../pages/performance/Performance';

// Portail employé — "Mon espace"
import MyPortal from '../pages/portal/MyPortal';
import MyLeaves from '../pages/portal/MyLeaves';
import MyDocuments from '../pages/portal/MyDocuments';
import MyPayslips from '../pages/portal/MyPayslips';
import MyHistory from '../pages/portal/MyHistory';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Routes publiques - SANS Layout */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/confidentielle/politique-de-confidentialite" element={<PolitiqueDeConfidentialite />} />
                    <Route path="/confidentielle/conditions-d-utilisation" element={<ConditionsDUtilisation />} />

                    {/* Routes protégées - AVEC Layout */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/admin" element={<AdminDashboard />} />

                            {/* Portail employé */}
                            <Route path="/portal" element={<MyPortal />} />
                            <Route path="/portal/leaves" element={<MyLeaves />} />
                            <Route path="/portal/documents" element={<MyDocuments />} />
                            <Route path="/portal/payslips" element={<MyPayslips />} />
                            <Route path="/portal/history" element={<MyHistory />} />

                            {/* Employés */}
                            <Route path="/employees" element={<Employees />} />
                            <Route path="/employees/create" element={<EmployeeCreate />} />
                            <Route path="/employees/:id" element={<EmployeeShow />} />
                            <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

                            {/* Départements */}
                            <Route path="/departments" element={<Departments />} />
                            <Route path="/organigram" element={<Organigram />} />
                            <Route path="/notifications" element={<Notifications />} />

                            {/* Contrats */}
                            <Route path="/contracts" element={<Contracts />} />
                            <Route path="/contracts/create" element={<ContractCreate />} />
                            <Route path="/contracts/:id/edit" element={<ContractEdit />} />
                            <Route path="/contracts/:id" element={<ContractShow />} />

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

                            {/* Performance */}
                            <Route path="/performance" element={<Performance />} />
                            <Route path="/performances" element={<Performance />} />

                            {/* Rapports */}
                            <Route path="/reports" element={<Reports />} />

                            {/* Paramètres */}
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/profile" element={<Profile />} />

                            {/* Redirection par défaut */}
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                        </Route>
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRoutes;