import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Bars3Icon,
    BellIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon, 
} from '@heroicons/react/24/outline';
import { type User } from '../../types';
import logo from '../../../public/logo.svg';

interface HeaderProps {
    toggleSidebar: () => void;
    user: User | null;
}

const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    
const Header: React.FC<HeaderProps> = ({ toggleSidebar, user }) => {
    const { logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const { tenant } = useAuth();
    const handleLogout = async (): Promise<void> => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
            <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>

            <div className="flex-1 flex items-center justify-between ml-4">
                <div className="flex items-center space-x-2">
                     <img src={logo} alt="SDS-RH" className="h-60 w-60" />
                    {tenant && (
                        <span className="hidden md:inline text-sm font-semibold text-gray-700 border-l border-gray-200 pl-3 ml-1">
                            {tenant.name}
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-4"> 
                    <div className="hidden sm:block text-right shrink-0 pl-4">
                    <p className="text-sm text-gold-800 capitalize">{today}</p>
                    </div>                   
                    <button
                        onClick={() => navigate('/notifications')}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                    >
                        <BellIcon className="h-6 w-6 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {user?.profile_photo ? (
                                <img
                                    src={user.profile_photo}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-primary-600 font-semibold text-sm">
                                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                                    </span>
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-700 hidden md:block">
                                {user?.first_name} {user?.last_name}
                            </span>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <UserCircleIcon className="h-5 w-5 mr-2" />
                                    Mon profil
                                </button>
                                {isAdmin && (
                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Cog6ToothIcon className="h-5 w-5 mr-2" />
                                        Paramètres
                                    </button>
                                )}
                                <hr className="my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;