import React from 'react';
import { useAuth } from '../../context/AuthContext';

const OrganizationBanner: React.FC = () => {
    const { tenant } = useAuth();

    if (!tenant) {
        return null;
    }

    const initials = (tenant.name || '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('');

    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white px-6 py-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center overflow-hidden">
                    {tenant.logo ? (
                        <img src={tenant.logo} alt={tenant.name} className="h-full w-full object-contain" />
                    ) : (
                        <span className="font-bold text-lg">{initials}</span>
                    )}
                </div>
                <div className="min-w-0">
                    <h2 className="text-lg font-bold leading-tight truncate">{tenant.name}</h2>
                    {(tenant.address || tenant.email) && (
                        <p className="text-sm text-primary-100/80 truncate">
                            {tenant.address || tenant.email}
                        </p>
                    )}
                </div>
            </div>
            <div className="hidden sm:block text-right shrink-0 pl-4">
                {/*<p className="text-xs text-primary-100/70 capitalize">{today}</p>*/}
                {tenant.subscription_plan && (
                    <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide bg-white/15 border border-white/20 rounded-full px-2 py-0.5">
                        Formule {tenant.subscription_plan}
                    </span>
                )}
            </div>
        </div>
    );
};

export default OrganizationBanner;