import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
    HomeIcon,
    UserCircleIcon,
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
    BellIcon,
    TrophyIcon,
    DocumentCurrencyYenIcon,
    IdentificationIcon,
    ArrowRightOnRectangleIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

import logo from '/logo.svg';

interface SidebarProps {
    isOpen: boolean;
    toggle: () => void;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ForwardRefExoticComponent<
        React.SVGProps<SVGSVGElement> &
        React.RefAttributes<SVGSVGElement>
    >;
    permission?: string;
}

interface NavigationSection {
    label: string;
    items: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
    const { hasPermission, isSuperAdmin } = useAuth();

    const sections: NavigationSection[] = [
        {
            label: 'Général',
            items: [
                {
                    name: 'Tableau de bord',
                    href: '/dashboard',
                    icon: HomeIcon,
                },

                ...(isSuperAdmin
                    ? [
                          {
                              name: 'Administration',
                              href: '/admin',
                              icon: BuildingOffice2Icon,
                          },
                      ]
                    : []),
            ],
        },

        {
            label: 'Mon espace',
            items: [
                {
                    name: 'Mon profil',
                    href: '/profile',
                    icon: UserCircleIcon,
                },
                {
                    name: 'Mon espace',
                    href: '/portal',
                    icon: UsersIcon,
                },
            ],
        },

        {
            label: 'Personnel',
            items: [
                {
                    name: 'Employés',
                    href: '/employees',
                    icon: UsersIcon,
                    permission: 'view_employees',
                },
                {
                    name: 'Sorties employés',
                    href: '/employees/exits',
                    icon: ArrowRightOnRectangleIcon,
                    permission: 'view_employees',
                },
                {
                    name: 'Départements',
                    href: '/departments',
                    icon: UserGroupIcon,
                    permission: 'view_departments',
                },
                {
                    name: 'Postes',
                    href: '/positions',
                    icon: IdentificationIcon,
                    permission: 'view_positions',
                },
                {
                    name: 'Organigramme',
                    href: '/organigram',
                    icon: DocumentCurrencyYenIcon,
                    permission: 'view_departments',
                },
                {
                    name: 'Contrats',
                    href: '/contracts',
                    icon: DocumentTextIcon,
                    permission: 'view_contracts',
                },
                {
                    name: 'Performances',
                    href: '/performances',
                    icon: TrophyIcon,
                    permission: 'view_performances',
                },
            ],
        },

        {
            label: 'Temps & Paie',
            items: [
                {
                    name: 'Présences',
                    href: '/attendance',
                    icon: ClockIcon,
                    permission: 'view_attendance',
                },
                {
                    name: 'Heures supplémentaires',
                    href: '/overtime',
                    icon: ClockIcon,
                    permission: 'view_attendance',
                },
                {
                    name: 'Congés',
                    href: '/leaves',
                    icon: CalendarIcon,
                    permission: 'view_leaves',
                },
                {
                    name: 'Paie',
                    href: '/payroll',
                    icon: CurrencyDollarIcon,
                    permission: 'view_payrolls',
                },
            ],
        },

        {
            label: 'Développement',
            items: [
                {
                    name: 'Formations',
                    href: '/trainings',
                    icon: AcademicCapIcon,
                    permission: 'view_trainings',
                },
                {
                    name: 'Recrutement',
                    href: '/recruitments',
                    icon: BriefcaseIcon,
                    permission: 'view_recruitments',
                },
            ],
        },

        {
            label: 'Documents & Rapports',
            items: [
                {
                    name: 'Documents',
                    href: '/documents',
                    icon: FolderIcon,
                    permission: 'view_documents',
                },
                {
                    name: 'Rapports',
                    href: '/reports',
                    icon: ChartBarIcon,
                    permission: 'view_reports',
                },
            ],
        },

        {
            label: 'Système',
            items: [
                {
                    name: 'Utilisateurs',
                    href: '/users',
                    icon: UsersIcon,
                    permission: 'view_users',
                },
                {
                    name: 'Rôles & permissions',
                    href: '/roles',
                    icon: ShieldCheckIcon,
                    permission: 'view_roles',
                },
                {
                    name: 'Notifications',
                    href: '/notifications',
                    icon: BellIcon,
                },
                {
                    name: 'Paramètres',
                    href: '/settings',
                    icon: CogIcon,
                    permission: 'view_settings',
                },
                {
                    name: 'Mon abonnement',
                    href: '/subscription',
                    icon: CreditCardIcon,
                    permission: 'view_settings',
                },
            ],
        },
    ];

    return (
        <>
            {/* ============================================================
                OVERLAY MOBILE
            ============================================================= */}
            {isOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        backdrop-blur-[2px]
                        lg:hidden
                    "
                    onClick={toggle}
                    aria-hidden="true"
                />
            )}

            {/* ============================================================
                SIDEBAR
            ============================================================= */}
            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    flex-col
                    bg-primary-800
                    text-white
                    shadow-2xl
                    transition-all
                    duration-300
                    ease-in-out

                    /*
                     * MOBILE
                     * Fermé = complètement hors écran
                     * Ouvert = largeur 280px
                     */
                    ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}

                    /*
                     * DESKTOP
                     * Toujours visible
                     * Ouvert = 240px
                     * Fermé = 80px
                     */
                    lg:translate-x-0
                    ${isOpen ? 'lg:w-60' : 'lg:w-20'}
                `}
            >
                {/* ========================================================
                    HEADER SIDEBAR
                ========================================================= */}
                <div
                    className="
                        flex
                        h-16
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-primary-700
                        px-4
                    "
                >
                    {/* Logo */}
                    <div className="flex min-w-0 items-center">

                        {isOpen ? (
                            <img
                                src={logo}
                                alt="SDS-RH"
                                className="
                                    h-10
                                    w-auto
                                    max-w-[170px]
                                    object-contain
                                "
                            />
                        ) : (
                            <span
                                className="
                                    hidden
                                    text-xl
                                    font-bold
                                    text-primary-300
                                    lg:block
                                "
                            >
                                S
                            </span>
                        )}

                    </div>

                    {/* Bouton desktop */}
                    <button
                        onClick={toggle}
                        aria-label={
                            isOpen
                                ? 'Réduire le menu'
                                : 'Développer le menu'
                        }
                        className="
                            hidden
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-primary-300
                            transition-colors
                            hover:bg-primary-700
                            hover:text-white
                            lg:flex
                        "
                    >
                        {isOpen ? (
                            <ChevronLeftIcon className="h-5 w-5" />
                        ) : (
                            <ChevronRightIcon className="h-5 w-5" />
                        )}
                    </button>

                    {/* Bouton fermeture MOBILE */}
                    <button
                        onClick={toggle}
                        aria-label="Fermer le menu"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            text-primary-200
                            transition-colors
                            hover:bg-primary-700
                            hover:text-white
                            lg:hidden
                        "
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* ========================================================
                    NAVIGATION
                ========================================================= */}
                <nav
                    className="
                        flex-1
                        overflow-y-auto
                        px-3
                        py-4
                        space-y-6
                    "
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {sections.map((section, idx) => {
                        const visibleItems = section.items.filter(
                            (item) =>
                                !item.permission ||
                                hasPermission(item.permission)
                        );

                        if (visibleItems.length === 0) {
                            return null;
                        }

                        return (
                            <div key={idx}>

                                {/* Titre de section */}
                                {isOpen && section.label && (
                                    <p
                                        className="
                                            mb-2
                                            px-3
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-primary-400
                                        "
                                    >
                                        {section.label}
                                    </p>
                                )}

                                {/* Items */}
                                <div className="space-y-1">
                                    {visibleItems.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            to={item.href}
                                            onClick={() => {
                                                /*
                                                 * Sur mobile uniquement :
                                                 * fermeture automatique après
                                                 * sélection d'un menu.
                                                 */
                                                if (
                                                    window.innerWidth < 1024
                                                ) {
                                                    toggle();
                                                }
                                            }}
                                            className={({ isActive }) =>
                                                `
                                                group
                                                flex
                                                items-center
                                                rounded-xl
                                                px-3
                                                py-2.5
                                                transition-all
                                                duration-200

                                                ${
                                                    isActive
                                                        ? `
                                                            bg-white/10
                                                            text-white
                                                            shadow-sm
                                                            ring-1
                                                            ring-white/5
                                                          `
                                                        : `
                                                            text-primary-200
                                                            hover:bg-white/5
                                                            hover:text-white
                                                          `
                                                }

                                                ${
                                                    !isOpen
                                                        ? 'justify-center'
                                                        : ''
                                                }
                                                `
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <item.icon
                                                        className={`
                                                            h-5
                                                            w-5
                                                            shrink-0
                                                            transition-transform
                                                            duration-200
                                                            group-hover:scale-105

                                                            ${
                                                                isActive
                                                                    ? 'text-primary-300'
                                                                    : 'text-primary-200'
                                                            }
                                                        `}
                                                    />

                                                    {isOpen && (
                                                        <span
                                                            className="
                                                                ml-3
                                                                truncate
                                                                text-sm
                                                                font-medium
                                                            "
                                                        >
                                                            {item.name}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* ========================================================
                    FOOTER
                ========================================================= */}
                <div
                    className="
                        shrink-0
                        border-t
                        border-primary-700/50
                        p-4
                    "
                >
                    {isOpen ? (
                        <div className="text-center text-[10px] text-primary-400">
                            <p>v1.5.3</p>

                            <p className="mt-1">
                                © {new Date().getFullYear()} SDS-RH
                            </p>
                        </div>
                    ) : (
                        <div className="text-center text-[10px] text-primary-500">
                            v1.5
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;