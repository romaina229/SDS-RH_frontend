import React, { useState, memo } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = memo(() => {
    const { user } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = (): void => {
        setSidebarOpen((previous) => !previous);
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                toggle={toggleSidebar}
            />

            {/* Contenu principal */}
            <div
                className={`
                    min-h-screen
                    transition-all
                    duration-300
                    ease-in-out

                    /*
                     * MOBILE
                     * Aucun margin-left.
                     * Le contenu prend toute la largeur.
                     */

                    /*
                     * DESKTOP
                     * Sidebar réduite : 80px
                     */
                    lg:ml-20

                    /*
                     * DESKTOP
                     * Sidebar ouverte : 240px
                     */
                    ${sidebarOpen ? 'lg:ml-60' : ''}
                `}
            >
                <Header
                    toggleSidebar={toggleSidebar}
                    user={user}
                />

                <main
                    className="
                        min-h-[calc(100vh-72px)]
                        p-4
                        sm:p-5
                        lg:p-6
                    "
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
});

Layout.displayName = 'Layout';

export default Layout;