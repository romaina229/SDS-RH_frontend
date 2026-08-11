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
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';
import logo from '/logo.svg';

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
                { name: 'Mon espace', href: '/portal', icon: UsersIcon },
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
                    name: 'Départements',
                    href: '/departments',
                    icon: UserGroupIcon,
                    permission: 'view_departments',
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
                }
            ],
        },
        {
            label: 'Temps & Paie',
            items: [
                {
                    name: 'Présences',
                    href: '/attendance',
                    icon: ClockIcon,
                    permission: 'view_employees',
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
            ],
        },
    ];

    return (
        <>
            {/* Overlay pour mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggle}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-screen bg-primary-700 text-white transition-all duration-300 z-50 flex flex-col ${
                    isOpen ? 'w-60' : 'w-20'
                }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-primary-600">
                    <div className="flex items-center">
                        {isOpen ? (
                            <img
                                src={logo}
                                alt="SDS-RH"
                                className="h-45 w-45"
                            />
                        ) : (
                            <span className="text-xl font-bold text-primary-400">
                                S
                            </span>
                        )}
                    </div>

                    <button
                        onClick={toggle}
                        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary-700 transition-colors text-primary-300"
                    >
                        {isOpen ? (
                            <ChevronLeftIcon className="h-5 w-5" />
                        ) : (
                            <ChevronRightIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" style={{scrollbarWidth: 'none', msOverflowStyle: 'none',}} >
                    {sections.map((section, idx) => {
                        const visibleItems = section.items.filter(
                            (item) =>
                                !item.permission ||
                                hasPermission(item.permission)
                        );

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={idx}>
                                {isOpen && section.label && (
                                    <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider px-3 mb-2">
                                        {section.label}
                                    </p>
                                )}

                                <div className="space-y-1">
                                    {visibleItems.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            to={item.href}
                                            onClick={() => {
                                                if (
                                                    window.innerWidth < 1024
                                                ) {
                                                    toggle();
                                                }
                                            }}
                                            className={({ isActive }) =>
                                                `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-primary-700/70 text-white shadow-lg shadow-primary-700/20'
                                                        : 'text-primary-200 hover:bg-primary-700/40 hover:text-white'
                                                } ${
                                                    !isOpen
                                                        ? 'justify-center'
                                                        : ''
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <item.icon
                                                        className={`h-5 w-5 flex-shrink-0 ${
                                                            isActive
                                                                ? 'text-primary-300'
                                                                : ''
                                                        }`}
                                                    />

                                                    {isOpen && (
                                                        <span className="ml-3 text-sm font-medium truncate">
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

                {/* Footer */}
                <div className="border-t border-primary-700/50 p-4">
                    {isOpen ? (
                        <div className="text-center text-xs text-primary-400">
                            <p>v1.5.3</p>
                            <p className="mt-1">
                                © {new Date().getFullYear()} SDS-RH
                            </p>
                        </div>
                    ) : (
                        <div className="text-center text-xs text-primary-500">
                            v1.5
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;