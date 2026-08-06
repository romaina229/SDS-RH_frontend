import React from 'react';
import { Link } from 'react-router-dom';
import {
    UsersIcon,
    DocumentTextIcon,
    ClockIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    ShieldCheckIcon,
    FolderIcon,
    ChartBarIcon,
    ArrowRightIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';
import logoicone from '../../../public/logoicone.svg';

const modules = [
    { name: 'Employés', desc: 'Dossier du personnel et organigramme dynamique', icon: UsersIcon },
    { name: 'Contrats', desc: 'CDI, CDD, stage, consultant, avec alertes d\'échéance', icon: DocumentTextIcon },
    { name: 'Présence', desc: 'Badge, QR code ou géolocalisation', icon: ClockIcon },
    { name: 'Congés', desc: 'Workflow de validation et solde automatique', icon: CalendarIcon },
    { name: 'Paie', desc: 'Bulletins générés et masse salariale suivie', icon: CurrencyDollarIcon },
    { name: 'Recrutement', desc: 'Offres, candidatures et entretiens', icon: BriefcaseIcon },
    { name: 'Formation', desc: 'Plan annuel, participants et compétences', icon: AcademicCapIcon },
    { name: 'Performance', desc: 'Objectifs, KPI et évaluations annuelles', icon: ChartBarIcon },
    { name: 'Documents RH', desc: 'Coffre-fort numérique et signature électronique', icon: FolderIcon },
    { name: 'Rapports', desc: 'Exports PDF / Excel et indicateurs consolidés', icon: ShieldCheckIcon },
];

const roles = [
    { name: 'Super Administrateur', org: 'SDS-RH', detail: 'Pilote toutes les organisations clientes : abonnements, statistiques globales, facturation.' },
    { name: 'Administrateur', org: 'de l\'organisation', detail: 'Configure sa structure : employés, départements, congés, paie, rapports.' },
    { name: 'Manager', org: "d'équipe", detail: 'Valide les congés de son équipe, évalue ses collaborateurs directs.' },
    { name: 'Employé', org: 'libre-service', detail: 'Consulte son profil, demande ses congés, télécharge ses bulletins.' },
];

const plans = [
    { name: 'Gratuit', range: "Jusqu'à 5 employés", price: '0', unit: 'FCFA / mois' },
    { name: 'Starter', range: '6 à 20 employés', price: '5 000', unit: 'FCFA / mois' },
    { name: 'Standard', range: '21 à 50 employés', price: '15 000', unit: 'FCFA / mois', featured: true },
    { name: 'Business', range: '51 à 150 employés', price: '35 000', unit: 'FCFA / mois' },
    { name: 'Enterprise', range: 'Plus de 150 employés', price: 'Sur devis', unit: '' },
];

/** Les trois organisations de l'illustration du cahier des charges (§2.2),
 *  reprises comme signature visuelle du cloisonnement multi-tenant. */
const tenants = [
    { name: 'Organisation A', tags: 'Employés · Paie · Présences', tint: 'from-primary-500/25 to-primary-500/5', ring: 'ring-primary-300/40' },
    { name: 'Organisation B', tags: 'Employés · Congés · Recrutement', tint: 'from-secondary-400/30 to-secondary-400/5', ring: 'ring-secondary-300/40' },
    { name: 'ONG C', tags: 'Personnel · Rapports', tint: 'from-gold-400/30 to-gold-400/5', ring: 'ring-gold-300/40' },
];

const Home: React.FC = () => {
    return (
        <div className="bg-white text-primary-950">
            {/* ---------- Nav ---------- */}
            <header className="fixed top-0 inset-x-0 z-40 backdrop-blur bg-white/70 border-b border-primary-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center">
                            <img src={logoicone} alt="SDS-RH" className="h-25 w-25" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-semibold text-lg">SDS-RH</span>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-primary-700">
                        <a href="#modules" className="hover:text-primary-950 transition-colors">Modules</a>
                        <a href="#roles" className="hover:text-primary-950 transition-colors">Rôles</a>
                        <a href="#tarifs" className="hover:text-primary-950 transition-colors">Tarifs</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm font-medium text-primary-700 hover:text-primary-950 transition-colors">
                            Se connecter
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-lg transition-colors"
                        >
                            Créer mon organisation
                        </Link>
                    </div>
                </div>
            </header>

            {/* ---------- Hero ---------- */}
            <section className="relative overflow-hidden bg-nocturne-glow text-white pt-32 pb-28">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                            SaaS RH multi-organisations
                        </span>
                        <h1 className="mt-6 font-display text-4xl sm:text-5xl font-semibold leading-[1.08] tracking-tight">
                            Une organisation.
                            <br />
                            Un espace RH qui lui
                            <br />
                            appartient <span className="text-secondary-300">entièrement</span>.
                        </h1>
                        <p className="mt-6 text-primary-100/80 text-lg max-w-lg">
                            SDS-RH héberge un nombre illimité d'organisations sur une seule plateforme —
                            PME, ONG, institutions publiques — chacune cloisonnée dans son propre espace
                            sécurisé, avec devises, jours fériés et cotisations sociales adaptés à son pays.
                        </p>
                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-primary-950 font-semibold px-5 py-3 rounded-lg transition-colors"
                            >
                                Créer mon organisation
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 px-5 py-3 rounded-lg font-medium transition-colors"
                            >
                                Se connecter
                            </Link>
                        </div>

                        <dl className="mt-14 grid grid-cols-4 gap-6 max-w-lg font-mono">
                            {[
                                ['10', 'modules'],
                                ['4', 'rôles'],
                                ['5', 'formules'],
                                ['3', 'phases'],
                            ].map(([n, l]) => (
                                <div key={l}>
                                    <dt className="text-2xl font-semibold text-white">{n}</dt>
                                    <dd className="text-xs text-primary-200/70 font-sans mt-0.5">{l}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Signature : le cloisonnement multi-tenant, en organisations empilées */}
                    <div className="relative h-[420px] hidden lg:block" aria-hidden="true">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full max-w-sm">
                                {tenants.map((t, i) => (
                                    <div
                                        key={t.name}
                                        className={`absolute w-full rounded-2xl border border-white/15 bg-gradient-to-br ${t.tint} backdrop-blur-md ring-1 ${t.ring} p-5 shadow-2xl transition-transform hover:-translate-y-2`}
                                        style={{
                                            top: `${i * 64}px`,
                                            left: `${i * 18}px`,
                                            zIndex: 10 - i,
                                            transform: `rotate(${(i - 1) * 2.5}deg)`,
                                        }}
                                    >
                                        <p className="font-display font-semibold text-white">{t.name}</p>
                                        <p className="text-xs text-primary-100/70 mt-1 font-mono">{t.tags}</p>
                                        <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full bg-white/50" style={{ width: `${68 - i * 14}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="absolute bottom-0 inset-x-0 text-center text-xs text-primary-200/60">
                            Chaque organisation ne voit que ses propres données.
                        </p>
                    </div>
                </div>
            </section>

            {/* ---------- Modules ---------- */}
            <section id="modules" className="py-24 bg-primary-50/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-xl">
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">Modules fonctionnels</span>
                        <h2 className="mt-3 font-display text-3xl font-semibold text-primary-950">
                            Le cycle de vie RH, de l'embauche à la performance.
                        </h2>
                    </div>
                    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
                        {modules.map((m) => (
                            <div key={m.name} className="group bg-white rounded-xl border border-primary-100 p-5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/60 transition-all">
                                <div className="h-10 w-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-700 group-hover:text-white transition-colors">
                                    <m.icon className="h-5 w-5" />
                                </div>
                                <p className="mt-4 font-display font-semibold text-primary-950">{m.name}</p>
                                <p className="mt-1 text-sm text-primary-700/70 leading-snug">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- Rôles ---------- */}
            <section id="roles" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-xl">
                        <span className="text-xs font-semibold uppercase tracking-widest text-secondary-600">Accès et rôles</span>
                        <h2 className="mt-3 font-display text-3xl font-semibold text-primary-950">
                            Une hiérarchie pensée pour la sécurité des données.
                        </h2>
                    </div>
                    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {roles.map((r, i) => (
                            <div key={r.name} className="rounded-xl border border-primary-100 p-6 relative overflow-hidden">
                                <span className="font-mono text-xs text-primary-300">0{i + 1}</span>
                                <p className="mt-3 font-display font-semibold text-primary-950">{r.name}</p>
                                <p className="text-xs text-secondary-600 font-medium">{r.org}</p>
                                <p className="mt-3 text-sm text-primary-700/70 leading-relaxed">{r.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- Tarifs ---------- */}
            <section id="tarifs" className="py-24 bg-primary-950 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-xl">
                        <span className="text-xs font-semibold uppercase tracking-widest text-gold-300">Tarification</span>
                        <h2 className="mt-3 font-display text-3xl font-semibold">
                            Progressive, alignée sur votre effectif.
                        </h2>
                    </div>
                    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
                        {plans.map((p) => (
                            <div
                                key={p.name}
                                className={`rounded-2xl p-6 border ${
                                    p.featured
                                        ? 'bg-white text-primary-950 border-gold-300 shadow-2xl shadow-gold-900/20 lg:-translate-y-3'
                                        : 'border-white/10 bg-white/5'
                                }`}
                            >
                                <p className="font-display font-semibold">{p.name}</p>
                                <p className={`text-xs mt-1 ${p.featured ? 'text-primary-600' : 'text-primary-200/70'}`}>{p.range}</p>
                                <p className="mt-6 font-mono text-2xl font-semibold">{p.price}</p>
                                {p.unit && <p className={`text-xs font-mono ${p.featured ? 'text-primary-500' : 'text-primary-300/70'}`}>{p.unit}</p>}
                                <Link
                                    to="/register"
                                    className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${
                                        p.featured ? 'text-primary-700' : 'text-gold-300'
                                    }`}
                                >
                                    Commencer <ArrowRightIcon className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-primary-200/80">
                        {['Multi-devises FCFA/EUR/USD', 'Interface bilingue FR/EN', 'Cotisations sociales configurables', 'Signature électronique'].map((f) => (
                            <li key={f} className="flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-secondary-400" /> {f}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ---------- Footer ---------- */}
            <footer className="py-10 border-t border-primary-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-500">
                    <p>© {new Date().getFullYear()} SDS-RH — Shalom Digital Solutions</p>
                    <p>La plateforme africaine de gestion intelligente des ressources humaines</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
