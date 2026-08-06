import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HomeIcon,
    UsersIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CalendarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    ChartBarIcon,
    CogIcon,
    FolderIcon,
    BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import logo from '../../../public/logo.svg';

interface SidebarProps {
    isOpen: boolean;
    toggle: () => void;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    permission?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
    const { hasPermission, isSuperAdmin } = useAuth();

    const navigation: NavigationItem[] = [
        { name: 'Tableau de bord', href: '/dashboard', icon: HomeIcon },
        ...(isSuperAdmin
            ? [{ name: 'AdminDashboard', href: '/admin/admindashboard', icon: BuildingOffice2Icon }]
            : []),
        { name: 'Employés', href: '/employees', icon: UsersIcon, permission: 'view_employees' },
        { name: 'Départements', href: '/departments', icon: UserGroupIcon, permission: 'view_departments' },
        { name: 'Contrats', href: '/contracts', icon: DocumentTextIcon, permission: 'view_contracts' },
        { name: 'Congés', href: '/leaves', icon: CalendarIcon, permission: 'view_leaves' },
        { name: 'Présences', href: '/attendance', icon: ClockIcon, permission: 'view_employees' },
        { name: 'Paie', href: '/payroll', icon: CurrencyDollarIcon, permission: 'view_payrolls' },
        { name: 'Formations', href: '/trainings', icon: AcademicCapIcon, permission: 'view_trainings' },
        { name: 'Recrutement', href: '/recruitments', icon: BriefcaseIcon, permission: 'view_recruitments' },
        { name: 'Documents', href: '/documents', icon: FolderIcon, permission: 'view_documents' },
        { name: 'Rapports', href: '/reports', icon: ChartBarIcon, permission: 'view_reports' },
        { name: 'Paramètres', href: '/settings', icon: CogIcon, permission: 'view_settings' },
    ];

    return (
        <aside className={`fixed top-0 left-0 h-screen bg-primary-700 text-white transition-all duration-300 z-50 ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'} ${isOpen ? 'lg:w-64' : 'lg:w-20'}`}>
            <div className="flex items-center justify-center h-16 border-b border-primary-600">
                {isOpen ? (
                    <img src={logo} alt="SDS-RH" className="h-45 w-45" />
                ) : (
                    <span className="text-xl font-bold">S</span>
                )}
            </div>

            <nav className="mt-4 px-2">
                {navigation.map((item) => {
                    if (item.permission && !hasPermission(item.permission)) {
                        return null;
                    }

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            onClick={toggle}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-primary-600 text-white'
                                        : 'text-primary-200 hover:bg-primary-600 hover:text-white'
                                } ${!isOpen && 'justify-center'}`
                            }
                        >
                            <item.icon className={`h-6 w-6 ${!isOpen && 'mx-auto'}`} />
                            {isOpen && <span className="ml-3">{item.name}</span>}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;