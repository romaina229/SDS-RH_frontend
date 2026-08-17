import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    BuildingOffice2Icon,
    SparklesIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

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

    return (
        <>
            <style>{`
                @keyframes organizationFloat {
                    0%, 100% {
                        transform: translate3d(0, 0, 0) scale(1);
                    }

                    50% {
                        transform: translate3d(12px, -8px, 0) scale(1.08);
                    }
                }

                @keyframes organizationFloatReverse {
                    0%, 100% {
                        transform: translate3d(0, 0, 0) scale(1);
                    }

                    50% {
                        transform: translate3d(-10px, 8px, 0) scale(1.06);
                    }
                }

                @keyframes organizationShine {
                    0% {
                        transform: translateX(-150%) rotate(15deg);
                    }

                    100% {
                        transform: translateX(450%) rotate(15deg);
                    }
                }

                @keyframes organizationPulse {
                    0%, 100% {
                        opacity: 0.5;
                        transform: scale(1);
                    }

                    50% {
                        opacity: 1;
                        transform: scale(1.15);
                    }
                }

                .organization-orb-one {
                    animation: organizationFloat 7s ease-in-out infinite;
                }

                .organization-orb-two {
                    animation: organizationFloatReverse 8s ease-in-out infinite;
                }

                .organization-shine {
                    animation: organizationShine 9s ease-in-out infinite;
                }

                .organization-pulse {
                    animation: organizationPulse 2.5s ease-in-out infinite;
                }
            `}</style>

            <div
                className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-br
                    from-slate-950
                    via-primary-950
                    to-primary-800
                    shadow-lg
                    transition-all
                    duration-500
                    hover:shadow-xl
                "
            >
                {/* Halo lumineux supérieur droit */}
                <div
                    className="
                        organization-orb-one
                        pointer-events-none
                        absolute
                        -right-16
                        -top-20
                        h-56
                        w-56
                        rounded-full
                        bg-primary-400/20
                        blur-3xl
                    "
                />

                {/* Halo lumineux inférieur gauche */}
                <div
                    className="
                        organization-orb-two
                        pointer-events-none
                        absolute
                        -bottom-24
                        left-1/3
                        h-52
                        w-52
                        rounded-full
                        bg-cyan-400/10
                        blur-3xl
                    "
                />

                {/* Petit halo supplémentaire */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        -left-20
                        -top-20
                        h-40
                        w-40
                        rounded-full
                        bg-violet-400/10
                        blur-3xl
                    "
                />

                {/* Effet lumineux qui traverse le bandeau */}
                <div
                    className="
                        organization-shine
                        pointer-events-none
                        absolute
                        inset-y-0
                        -left-1/2
                        w-1/4
                        bg-white/5
                        blur-xl
                    "
                />

                {/* Bordure intérieure */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        rounded-2xl
                        border
                        border-white/10
                    "
                />

                {/* Contenu */}
                <div
                    className="
                        relative
                        flex
                        min-h-[118px]
                        items-center
                        justify-between
                        gap-6
                        px-5
                        py-5
                        sm:px-6
                        lg:px-7
                    "
                >
                    {/* Partie gauche */}
                    <div className="flex min-w-0 items-center gap-4">

                        {/* Logo */}
                        <div
                            className="
                                relative
                                h-14
                                w-14
                                shrink-0
                                rounded-2xl
                                border
                                border-white/20
                                bg-white/10
                                p-1
                                shadow-lg
                                backdrop-blur-md
                                transition-all
                                duration-300
                                group-hover:scale-105
                            "
                        >
                            {/* Petit halo autour du logo */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    rounded-2xl
                                    bg-white/10
                                    blur-md
                                "
                            />

                            <div
                                className="
                                    relative
                                    flex
                                    h-full
                                    w-full
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-xl
                                    bg-white
                                "
                            >
                                {tenant.logo_url ? (
                                    <img
                                        src={tenant.logo_url}
                                        alt={tenant.name}
                                        className="
                                            h-full
                                            w-full
                                            object-contain
                                            p-1.5
                                        "
                                    />
                                ) : (
                                    <span
                                        className="
                                            bg-gradient-to-br
                                            from-primary-700
                                            to-primary-500
                                            bg-clip-text
                                            text-xl
                                            font-extrabold
                                            text-transparent
                                        "
                                    >
                                        {initials}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Informations organisation */}
                        <div className="min-w-0">

                            {/* Petit label */}
                            <div className="mb-1 flex items-center gap-2">
                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-1.5
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
                                        text-primary-200
                                    "
                                >
                                    <BuildingOffice2Icon className="h-3.5 w-3.5" />
                                    Organisation
                                </span>

                                <span className="h-1 w-1 rounded-full bg-white/30" />

                                <span className="text-[10px] text-white/50">
                                    Espace professionnel
                                </span>
                            </div>

                            {/* Nom */}
                            <h2
                                className="
                                    truncate
                                    text-lg
                                    font-bold
                                    leading-tight
                                    text-white
                                    sm:text-xl
                                "
                            >
                                {tenant.name}
                            </h2>

                            {/* Adresse / email */}
                            {(tenant.address || tenant.email) && (
                                <p
                                    className="
                                        mt-1
                                        max-w-[520px]
                                        truncate
                                        text-xs
                                        text-white/60
                                        sm:text-sm
                                    "
                                >
                                    {tenant.address || tenant.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Partie droite */}
                    <div className="hidden shrink-0 items-center gap-3 sm:flex">

                        {/* Statut */}
                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-white/10
                                bg-white/5
                                px-3
                                py-2
                                backdrop-blur-md
                            "
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span
                                    className="
                                        organization-pulse
                                        absolute
                                        inline-flex
                                        h-full
                                        w-full
                                        rounded-full
                                        bg-emerald-400
                                    "
                                />

                                <span
                                    className="
                                        relative
                                        inline-flex
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                        bg-emerald-400
                                    "
                                />
                            </span>

                            <span className="text-xs font-medium text-white/80">
                                Actif
                            </span>
                        </div>

                        {/* Formule */}
                        {tenant.subscription_plan && (
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-white/15
                                    bg-white/10
                                    px-3
                                    py-2
                                    shadow-sm
                                    backdrop-blur-md
                                "
                            >
                                <SparklesIcon className="h-4 w-4 text-amber-300" />

                                <div>
                                    <p className="text-[9px] font-medium uppercase tracking-wider text-white/50">
                                        Formule
                                    </p>

                                    <p className="text-xs font-bold text-white">
                                        {tenant.subscription_plan}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Icône de validation */}
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-emerald-400/20
                                bg-emerald-400/10
                            "
                        >
                            <CheckCircleIcon className="h-5 w-5 text-emerald-300" />
                        </div>
                    </div>
                </div>

                {/* Barre décorative inférieure */}
                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        h-[2px]
                        w-full
                        bg-gradient-to-r
                        from-transparent
                        via-primary-400/60
                        to-transparent
                    "
                />
            </div>
        </>
    );
};

export default OrganizationBanner;