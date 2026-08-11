import React, { useState, memo } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = memo(() => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
            
            {!sidebarOpen && (
                <button
                    aria-label="Ouvrir le menu"
                    onClick={() => setSidebarOpen(true)}
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                />
            )}

            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} />
                
                <main className="p-6">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
});

Layout.displayName = 'Layout';

export default Layout;