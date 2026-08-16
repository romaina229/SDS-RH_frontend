import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import {
    Bars3Icon,
    BellIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    ClockIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';

import { type User } from '../../types';
import logo from '../../../public/logo.svg';

interface HeaderProps {
    toggleSidebar: () => void;
    user: User | null;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, user }) => {
    const { logout, isAdmin, tenant } = useAuth();
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    /*
     * Horloge en temps réel
     * Mise à jour toutes les secondes
     */
    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, []);

    /*
     * Date actuelle
     */
    const today = currentTime.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    /*
     * Heure actuelle
     */
    const currentHour = currentTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    /*
     * Initiales de l'utilisateur
     */
    const userInitials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`
        .toUpperCase();

    /*
     * Déconnexion
     */
    const handleLogout = async (): Promise<void> => {
        await logout();
        navigate('/login');
    };

    /*
     * Fermer le menu après navigation
     */
    const handleNavigation = (path: string): void => {
        setShowDropdown(false);
        navigate(path);
    };

    return (
        <>
            <style>{`
                @keyframes headerPulse {
                    0%, 100% {
                        opacity: 0.45;
                        transform: scale(1);
                    }

                    50% {
                        opacity: 1;
                        transform: scale(1.15);
                    }
                }

                @keyframes clockGlow {
                    0%, 100% {
                        box-shadow: 0 0 0 rgba(37, 99, 235, 0);
                    }

                    50% {
                        box-shadow: 0 0 18px rgba(37, 99, 235, 0.12);
                    }
                }

                .header-status-pulse {
                    animation: headerPulse 2.5s ease-in-out infinite;
                }

                .header-clock {
                    animation: clockGlow 3s ease-in-out infinite;
                }
            `}</style>

            <header
                className="
                    relative
                    z-40
                    h-[72px]
                    border-b
                    border-gray-100
                    bg-white/95
                    shadow-sm
                    backdrop-blur-xl
                "
            >
                <div className="flex h-full items-center px-4 sm:px-5 lg:px-6">

                    {/* =====================================================
                        BOUTON SIDEBAR
                    ====================================================== */}
                    <button
                        onClick={toggleSidebar}
                        aria-label="Ouvrir ou fermer le menu"
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-gray-100
                            bg-gray-50
                            text-gray-500
                            transition-all
                            duration-200
                            hover:border-primary-100
                            hover:bg-primary-50
                            hover:text-primary-600
                            active:scale-95
                        "
                    >
                        <Bars3Icon className="h-5 w-5" />
                    </button>

                    {/* =====================================================
                        ZONE PRINCIPALE
                    ====================================================== */}
                    <div className="ml-3 flex min-w-0 flex-1 items-center justify-between gap-4">

                        {/* =================================================
                            LOGO + ORGANISATION
                        ================================================== */}
                        <div className="flex min-w-0 items-center">

                            {/* Logo */}
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-xl
                                    bg-white
                                    p-1
                                    shadow-sm
                                    ring-1
                                    ring-gray-100
                                "
                            >
                                <img
                                    src={logo}
                                    alt="SDS-RH"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            {/* Séparateur */}
                            <div className="mx-3 hidden h-7 w-px bg-gray-200 sm:block" />

                            {/* Organisation */}
                            {tenant && (
                                <div className="hidden min-w-0 sm:block">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                        Espace de travail
                                    </p>

                                    <div className="mt-0.5 flex min-w-0 items-center gap-2">
                                        <h1 className="max-w-[260px] truncate text-sm font-bold text-gray-800">
                                            {tenant.name}
                                        </h1>

                                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5">
                                            <span
                                                className="
                                                    header-status-pulse
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-emerald-500
                                                "
                                            />

                                            <span className="text-[9px] font-semibold text-emerald-600">
                                                Actif
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            PARTIE DROITE
                        ================================================== */}
                        <div className="flex items-center gap-2 sm:gap-3">

                            {/* =================================================
                                DATE + HORLOGE
                            ================================================== */}
                            <div
                                className="
                                    header-clock
                                    hidden
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-primary-100
                                    bg-gradient-to-r
                                    from-primary-50
                                    to-blue-50
                                    px-3
                                    py-2
                                    sm:flex
                                "
                            >
                                {/* Icône horloge */}
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-white
                                        shadow-sm
                                    "
                                >
                                    <ClockIcon className="h-4 w-4 text-primary-600" />
                                </div>

                                <div className="text-right leading-none">

                                    {/* Heure */}
                                    <p
                                        className="
                                            font-mono
                                            text-sm
                                            font-bold
                                            tracking-tight
                                            text-primary-800
                                        "
                                    >
                                        {currentHour}
                                    </p>

                                    {/* Date */}
                                    <p className="mt-1 max-w-[190px] truncate text-[9px] font-medium capitalize text-gray-500">
                                        {today}
                                    </p>

                                </div>
                            </div>

                            {/* =================================================
                                NOTIFICATIONS
                            ================================================== */}
                            <button
                                onClick={() => navigate('/notifications')}
                                aria-label="Notifications"
                                className="
                                    relative
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-gray-100
                                    bg-gray-50
                                    text-gray-500
                                    transition-all
                                    duration-200
                                    hover:border-primary-100
                                    hover:bg-primary-50
                                    hover:text-primary-600
                                    active:scale-95
                                "
                            >
                                <BellIcon className="h-5 w-5" />

                                {/* Badge notification */}
                                <span
                                    className="
                                        absolute
                                        right-1.5
                                        top-1.5
                                        flex
                                        h-2.5
                                        w-2.5
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-2
                                        border-white
                                        bg-red-500
                                    "
                                />
                            </button>

                            {/* =================================================
                                PROFIL
                            ================================================== */}
                            <div className="relative">

                                <button
                                    onClick={() =>
                                        setShowDropdown(!showDropdown)
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-transparent
                                        py-1.5
                                        pl-1.5
                                        pr-2
                                        transition-all
                                        duration-200
                                        hover:border-gray-100
                                        hover:bg-gray-50
                                    "
                                >
                                    {/* Avatar */}
                                    {user?.profile_photo ? (
                                        <img
                                            src={user.profile_photo}
                                            alt="Photo de profil"
                                            className="
                                                h-9
                                                w-9
                                                rounded-xl
                                                object-cover
                                                shadow-sm
                                                ring-2
                                                ring-white
                                            "
                                        />
                                    ) : (
                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-gradient-to-br
                                                from-primary-600
                                                to-blue-500
                                                shadow-sm
                                            "
                                        >
                                            {userInitials ? (
                                                <span className="text-xs font-bold text-white">
                                                    {userInitials}
                                                </span>
                                            ) : (
                                                <UserCircleIcon className="h-6 w-6 text-white" />
                                            )}
                                        </div>
                                    )}

                                    {/* Nom */}
                                    <div className="hidden text-left md:block">
                                        <p className="max-w-[150px] truncate text-xs font-semibold text-gray-700">
                                            {user?.first_name} {user?.last_name}
                                        </p>

                                        <p className="text-[9px] text-gray-400">
                                            Mon compte
                                        </p>
                                    </div>

                                    <ChevronDownIcon
                                        className={`
                                            hidden
                                            h-3.5
                                            w-3.5
                                            text-gray-400
                                            transition-transform
                                            duration-200
                                            md:block
                                            ${showDropdown ? 'rotate-180' : ''}
                                        `}
                                    />
                                </button>

                                {/* =================================================
                                    MENU DÉROULANT
                                ================================================== */}
                                {showDropdown && (
                                    <div
                                        className="
                                            absolute
                                            right-0
                                            mt-2
                                            w-56
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-gray-100
                                            bg-white
                                            p-1.5
                                            shadow-xl
                                            ring-1
                                            ring-black/5
                                        "
                                    >
                                        {/* En-tête utilisateur */}
                                        <div
                                            className="
                                                mb-1
                                                rounded-xl
                                                bg-gray-50
                                                px-3
                                                py-2.5
                                            "
                                        >
                                            <p className="truncate text-xs font-bold text-gray-800">
                                                {user?.first_name}{' '}
                                                {user?.last_name}
                                            </p>

                                            <p className="mt-0.5 truncate text-[10px] text-gray-400">
                                                {user?.email || 'Compte utilisateur'}
                                            </p>
                                        </div>

                                        {/* Profil */}
                                        <button
                                            onClick={() =>
                                                handleNavigation('/profile')
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                rounded-xl
                                                px-3
                                                py-2.5
                                                text-left
                                                text-xs
                                                font-medium
                                                text-gray-700
                                                transition-colors
                                                hover:bg-primary-50
                                                hover:text-primary-700
                                            "
                                        >
                                            <UserCircleIcon className="mr-2.5 h-4.5 w-4.5" />
                                            Mon profil
                                        </button>

                                        {/* Paramètres */}
                                        {isAdmin && (
                                            <button
                                                onClick={() =>
                                                    handleNavigation(
                                                        '/settings'
                                                    )
                                                }
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    rounded-xl
                                                    px-3
                                                    py-2.5
                                                    text-left
                                                    text-xs
                                                    font-medium
                                                    text-gray-700
                                                    transition-colors
                                                    hover:bg-primary-50
                                                    hover:text-primary-700
                                                "
                                            >
                                                <Cog6ToothIcon className="mr-2.5 h-4.5 w-4.5" />
                                                Paramètres
                                            </button>
                                        )}

                                        <div className="my-1 border-t border-gray-100" />

                                        {/* Déconnexion */}
                                        <button
                                            onClick={handleLogout}
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                rounded-xl
                                                px-3
                                                py-2.5
                                                text-left
                                                text-xs
                                                font-medium
                                                text-red-600
                                                transition-colors
                                                hover:bg-red-50
                                            "
                                        >
                                            <ArrowRightOnRectangleIcon className="mr-2.5 h-4.5 w-4.5" />
                                            Déconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ligne décorative inférieure */}
                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        h-px
                        w-full
                        bg-gradient-to-r
                        from-transparent
                        via-primary-200
                        to-transparent
                    "
                />
            </header>
        </>
    );
};

export default Header;