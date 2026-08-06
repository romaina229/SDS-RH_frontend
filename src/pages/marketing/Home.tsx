import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    UsersIcon,
    DocumentTextIcon,
    ClockIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    LockClosedIcon,
    FolderIcon,
    ChartBarIcon,
    ArrowRightIcon,
    CheckIcon,
    GlobeAltIcon,
    BuildingOffice2Icon,
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import logoicone from '../../../public/logoicone.svg';

type Language = 'fr' | 'en';
type Cycle = 'monthly' | 'annual';
type Currency = 'XOF' | 'EUR' | 'USD';

type Module = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    fr: [string, string];
    en: [string, string];
};

type Differentiator = {
    icon: React.ReactNode;
    fr: [string, string];
    en: [string, string];
};

type Plan = {
    key: string;
    min: number;
    max: number;
    priceXOF: number | null;
    fr: { name: string; feat: string[] };
    en: { name: string; feat: string[] };
};

const I18N = {
    fr: {
        nav_modules: 'Modules',
        nav_diff: 'Différenciation',
        nav_pricing: 'Tarifs',
        nav_payment: 'Paiement',
        nav_login: 'Se connecter',
        nav_trial: 'Essai gratuit',
        hero_eyebrow: 'SaaS RH multi-tenant · Fait pour l’Afrique',
        hero_title: 'La gestion RH, pensée pour chaque organisation africaine.',
        hero_lead:
            'Une seule plateforme, des espaces totalement isolés. PME, ONG, écoles, hôpitaux et institutions publiques pilotent leurs équipes en toute sécurité — multi-devises, multi-pays, bilingue.',
        hero_cta1: 'Créer mon espace gratuit',
        hero_cta2: 'Voir les tarifs',
        stat_modules: 'modules métiers',
        stat_roles: "niveaux d'accès",
        stat_offers: 'formules tarifaires',
        stat_currency: 'devises supportées',
        orbit_caption: 'espaces isolés · données cloisonnées',
        trust1: 'Inspiré des standards Odoo RH · OrangeHRM · BambooHR',
        trust2: 'Paiements FedaPay · Kkiapay · Stripe · PayPal',
        trust3: 'FCFA · EUR · USD',
        mod_eyebrow: 'Couverture fonctionnelle',
        mod_title: 'Dix modules pour tout le cycle de vie RH',
        mod_lead:
            "De l'embauche à la performance, chaque organisation active les modules dont elle a besoin.",
        diff_eyebrow: 'Pensé pour l’Afrique',
        diff_title: 'Ce qui différencie SDS-RH',
        diff_lead:
            "Des fonctionnalités locales et de l'intelligence artificielle appliquée aux ressources humaines.",
        price_eyebrow: 'Tarification progressive',
        price_title: 'Un prix qui suit la taille de votre organisation',
        price_lead:
            'Déplacez le curseur pour indiquer votre effectif : nous mettons en avant la formule adaptée.',
        price_slider_label: 'Effectif de votre organisation',
        price_slider_unit: 'employés',
        price_monthly: 'Mensuel',
        price_annual: 'Annuel −17%',
        pay_eyebrow: 'Paiement local et international',
        pay_title: "Payez comme vous en avez l'habitude",
        pay_lead:
            'Mobile money, carte bancaire ou virement — choisissez le moyen de paiement adapté à votre pays.',
        pay_transfer: 'Virement bancaire',
        pay_note:
            "Paiements chiffrés de bout en bout. La facturation démarre au début de chaque période ; l'offre Gratuite ne nécessite aucun moyen de paiement.",
        cta_title: 'Prêt à digitaliser vos ressources humaines ?',
        cta_lead:
            'Créez votre espace en moins de 5 minutes. Aucune carte requise pour la formule Gratuite.',
        cta_button: 'Commencer maintenant',
        footer_tagline: 'La plateforme africaine de gestion intelligente des ressources humaines.',
        footer_product: 'Produit',
        footer_company: 'Entreprise',
        footer_legal: 'Légal',
        footer_about: 'À propos',
        footer_security: 'Sécurité & confidentialité',
        footer_contact: 'Contact',
        footer_cgu: 'Conditions générales',
        footer_privacy: 'Politique de confidentialité',
        footer_copy: '© 2026 SDS-RH. Tous droits réservés.',
        footer_made: 'Conçu pour les organisations africaines de toute taille.',
        recommended: 'Recommandé pour vous',
        quote: 'Sur devis',
        freeprice: 'Gratuit',
        perMonth: '/ mois',
        perYear: '/ an',
        from: 'Plus de',
        empUnit: 'employés',
        choose: 'Choisir',
        save: 'Économisez 2 mois offerts',
    },
    en: {
        nav_modules: 'Modules',
        nav_diff: 'Why us',
        nav_pricing: 'Pricing',
        nav_payment: 'Payment',
        nav_login: 'Log in',
        nav_trial: 'Free trial',
        hero_eyebrow: 'Multi-tenant HR SaaS · Built for Africa',
        hero_title: 'HR management, built for every African organization.',
        hero_lead:
            'One platform, fully isolated workspaces. SMEs, NGOs, schools, hospitals and public institutions manage their teams securely — multi-currency, multi-country, bilingual.',
        hero_cta1: 'Create my free workspace',
        hero_cta2: 'See pricing',
        stat_modules: 'business modules',
        stat_roles: 'access levels',
        stat_offers: 'pricing plans',
        stat_currency: 'supported currencies',
        orbit_caption: 'isolated workspaces · partitioned data',
        trust1: 'Inspired by Odoo HR · OrangeHRM · BambooHR standards',
        trust2: 'Payments via FedaPay · Kkiapay · Stripe · PayPal',
        trust3: 'XOF · EUR · USD',
        mod_eyebrow: 'Functional coverage',
        mod_title: 'Ten modules for the entire HR lifecycle',
        mod_lead: 'From hiring to performance, each organization enables the modules it needs.',
        diff_eyebrow: 'Built for Africa',
        diff_title: 'What sets SDS-RH apart',
        diff_lead: 'Local features and artificial intelligence applied to human resources.',
        price_eyebrow: 'Progressive pricing',
        price_title: 'A price that scales with your organization',
        price_lead: 'Move the slider to enter your headcount — we highlight the plan that fits.',
        price_slider_label: "Your organization's headcount",
        price_slider_unit: 'employees',
        price_monthly: 'Monthly',
        price_annual: 'Annual −17%',
        pay_eyebrow: 'Local and international payment',
        pay_title: "Pay the way you're used to",
        pay_lead: 'Mobile money, card or bank transfer — pick the payment method that suits your country.',
        pay_transfer: 'Bank transfer',
        pay_note:
            'End-to-end encrypted payments. Billing starts at the beginning of each period; the Free plan requires no payment method.',
        cta_title: 'Ready to digitize your HR?',
        cta_lead: 'Set up your workspace in under 5 minutes. No card required for the Free plan.',
        cta_button: 'Get started now',
        footer_tagline: 'The African platform for intelligent HR management.',
        footer_product: 'Product',
        footer_company: 'Company',
        footer_legal: 'Legal',
        footer_about: 'About',
        footer_security: 'Security & privacy',
        footer_contact: 'Contact',
        footer_cgu: 'Terms of service',
        footer_privacy: 'Privacy policy',
        footer_copy: '© 2026 SDS-RH. All rights reserved.',
        footer_made: 'Built for African organizations of every size.',
        recommended: 'Recommended for you',
        quote: 'Custom quote',
        freeprice: 'Free',
        perMonth: '/ month',
        perYear: '/ year',
        from: 'More than',
        empUnit: 'employees',
        choose: 'Choose',
        save: 'Save — 2 months free',
    },
} as const;

const modules: Module[] = [
    { icon: UsersIcon, fr: ['Employés', 'Dossier du personnel, organigramme dynamique.'], en: ['Employees', 'Personnel records, dynamic org chart.'] },
    { icon: DocumentTextIcon, fr: ['Contrats', "CDI, CDD, stage, alertes d'échéance."], en: ['Contracts', 'Permanent, fixed-term, internship, expiry alerts.'] },
    { icon: ClockIcon, fr: ['Présence', 'Badge, QR code, géolocalisation.'], en: ['Attendance', 'Badge, QR code, geolocation.'] },
    { icon: CalendarIcon, fr: ['Congés', 'Workflow de validation et solde automatique.'], en: ['Leave', 'Approval workflow and automatic balance.'] },
    { icon: CurrencyDollarIcon, fr: ['Paie', 'Bulletins PDF, primes, heures supp.'], en: ['Payroll', 'PDF payslips, bonuses, overtime.'] },
    { icon: BriefcaseIcon, fr: ['Recrutement', "Offres d'emploi et suivi des candidatures."], en: ['Recruitment', 'Job postings and applicant tracking.'] },
    { icon: AcademicCapIcon, fr: ['Formation', 'Plan annuel, suivi des compétences.'], en: ['Training', 'Annual plan, skills tracking.'] },
    { icon: ChartBarIcon, fr: ['Performance', 'Objectifs, KPI, évaluations annuelles.'], en: ['Performance', 'Goals, KPIs, annual reviews.'] },
    { icon: FolderIcon, fr: ['Documents RH', 'Coffre-fort numérique, signature électronique.'], en: ['HR Documents', 'Digital vault, e-signature.'] },
    { icon: ShieldCheckIcon, fr: ['Rapports', 'Export PDF / Excel, indicateurs consolidés.'], en: ['Reports', 'PDF / Excel export, consolidated KPIs.'] },
];

const differentiators: Differentiator[] = [
    { icon: <GlobeAltIcon className="h-5 w-5" />, fr: ['Multi-devises natif', 'Facturation et paie en FCFA, EUR ou USD selon votre pays.'], en: ['Native multi-currency', 'Billing and payroll in XOF, EUR or USD based on your country.'] },
    { icon: <BuildingOffice2Icon className="h-5 w-5" />, fr: ['Cotisations par pays', 'Calcul des charges sociales configurable selon la législation locale.'], en: ['Country-specific contributions', 'Social charges configurable per local regulation.'] },
    { icon: <CalendarIcon className="h-5 w-5" />, fr: ['Jours fériés localisés', "Calendriers automatiquement adaptés au pays de l'organisation."], en: ['Localized public holidays', "Calendars automatically adapted to your organization's country."] },
    { icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />, fr: ['Interface bilingue', 'Basculez entre français et anglais en un clic.'], en: ['Bilingual interface', 'Switch between French and English in one click.'] },
    { icon: <SparklesIcon className="h-5 w-5" />, fr: ['Assistant IA RH', "Rédige des offres d'emploi, des évaluations et analyse vos indicateurs."], en: ['HR AI assistant', 'Drafts job posts, reviews, and analyzes your KPIs.'] },
    { icon: <LockClosedIcon className="h-5 w-5" />, fr: ['Isolation stricte des données', 'Chaque organisation évolue dans un espace totalement cloisonné.'], en: ['Strict data isolation', 'Every organization operates in a fully partitioned workspace.'] },
];

const plans: Plan[] = [
    { key: 'free', min: 1, max: 5, priceXOF: 0, fr: { name: 'Gratuit', feat: ["Jusqu'à 5 employés", '1 administrateur', 'Modules Employés, Congés, Présence', 'Support communautaire'] }, en: { name: 'Free', feat: ['Up to 5 employees', '1 administrator', 'Employees, Leave, Attendance modules', 'Community support'] } },
    { key: 'starter', min: 6, max: 20, priceXOF: 5000, fr: { name: 'Starter', feat: ['6 à 20 employés', '+ Module Paie', '+ Documents RH', 'Export PDF', 'Support par email'] }, en: { name: 'Starter', feat: ['6 to 20 employees', '+ Payroll module', '+ HR Documents', 'PDF export', 'Email support'] } },
    { key: 'standard', min: 21, max: 50, priceXOF: 15000, fr: { name: 'Standard', feat: ['21 à 50 employés', '+ Recrutement & Formation', 'Rapports avancés', 'Multi-devises', 'Support prioritaire'] }, en: { name: 'Standard', feat: ['21 to 50 employees', '+ Recruitment & Training', 'Advanced reports', 'Multi-currency', 'Priority support'] } },
    { key: 'business', min: 51, max: 150, priceXOF: 35000, fr: { name: 'Business', feat: ['51 à 150 employés', '+ Performance & IA RH', 'Signature électronique', 'API ouverte', 'Support dédié'] }, en: { name: 'Business', feat: ['51 to 150 employees', '+ Performance & HR AI', 'E-signature', 'Open API', 'Dedicated support'] } },
    { key: 'enterprise', min: 151, max: 999999, priceXOF: null, fr: { name: 'Enterprise', feat: ['Plus de 150 employés', 'Serveur privé disponible', 'SMS & WhatsApp', 'Accompagnement dédié', 'SLA sur mesure'] }, en: { name: 'Enterprise', feat: ['More than 150 employees', 'Private server available', 'SMS & WhatsApp', 'Dedicated onboarding', 'Custom SLA'] } },
];

const rates: Record<Currency, number> = { XOF: 1, EUR: 1 / 655.957, USD: 1 / 580 };
const symbols: Record<Currency, string> = { XOF: 'FCFA', EUR: '€', USD: '$' };

const tenants = [
    { name: 'PME', tags: 'Employés · Paie · Présences', className: 'bg-[#5B4FE8]/90' },
    { name: 'ONG', tags: 'Employés · Congés · Recrutement', className: 'bg-[#4A3FD6]/90' },
    { name: 'École', tags: 'Personnel · Formation · Rapports', className: 'bg-[#17A6C8]/90' },
    { name: 'Hôpital', tags: 'Employés · Présence · Performance', className: 'bg-[#17C8A6]/90 text-[#08322A]' },
];

const Home: React.FC = () => {
    const [lang, setLang] = useState<Language>('fr');
    const [cycle, setCycle] = useState<Cycle>('monthly');
    const [currency, setCurrency] = useState<Currency>('XOF');
    const [employees, setEmployees] = useState(25);
    const t = I18N[lang];

    const formatPrice = (amountXOF: number) => {
        const converted = amountXOF * rates[currency];
        const rounded = currency === 'XOF' ? Math.round(converted / 100) * 100 : Math.round(converted * 100) / 100;
        return `${rounded.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} ${symbols[currency]}`;
    };

    const renderedPlans = useMemo(() => {
        return plans.map((plan) => {
            const data = plan[lang];
            const recommended = employees >= plan.min && employees <= plan.max;
            const range = plan.priceXOF === null
                ? `${t.from} 150 ${t.empUnit}`
                : `${plan.min}–${plan.max} ${t.empUnit}`;

            let price: React.ReactNode;
            if (plan.priceXOF === null) {
                price = <div className="text-2xl font-semibold">{t.quote}</div>;
            } else if (plan.priceXOF === 0) {
                price = <div className="text-2xl font-semibold">{t.freeprice}</div>;
            } else {
                const shown = cycle === 'monthly' ? plan.priceXOF : plan.priceXOF * 10;
                price = (
                    <>
                        <div className="text-2xl font-semibold">
                            {formatPrice(shown)} <span className="text-xs font-normal opacity-70">{cycle === 'monthly' ? t.perMonth : t.perYear}</span>
                        </div>
                        {cycle === 'annual' && <div className="mt-1 text-xs font-semibold text-[#0EA98C]">{t.save}</div>}
                    </>
                );
            }

            const query = new URLSearchParams({ plan: plan.key, cycle, currency }).toString();

            return { ...plan, data, recommended, range, price, query };
        });
    }, [employees, cycle, currency, lang, t]);

    return (
        <div className="min-h-screen bg-[#F7F6FB] text-[#14132B] antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#191A3D]/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1180px] items-center justify-between px-7 py-4">
                    <Link to="/" className="flex items-center gap-2.5">
                        <img src={logoicone} alt="SDS-RH" className="h-9 w-9" />
                        <span className="font-display text-[19px] font-bold text-white">SDS<span className="text-[#17C8A6]">·</span>RH</span>
                    </Link>

                    <nav className="hidden items-center gap-8 lg:flex">
                        <a href="#modules" className="text-sm font-medium text-[#DAD8F5] hover:text-white">{t.nav_modules}</a>
                        <a href="#differences" className="text-sm font-medium text-[#DAD8F5] hover:text-white">{t.nav_diff}</a>
                        <a href="#tarifs" className="text-sm font-medium text-[#DAD8F5] hover:text-white">{t.nav_pricing}</a>
                        <a href="#paiement" className="text-sm font-medium text-[#DAD8F5] hover:text-white">{t.nav_payment}</a>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden rounded-full border border-white/15 bg-white/10 p-0.5 sm:flex">
                            <button onClick={() => setLang('fr')} className={`rounded-full px-3 py-1.5 font-mono text-xs font-semibold ${lang === 'fr' ? 'bg-[#17C8A6] text-[#08322A]' : 'text-[#B9B6E3]'}`}>FR</button>
                            <button onClick={() => setLang('en')} className={`rounded-full px-3 py-1.5 font-mono text-xs font-semibold ${lang === 'en' ? 'bg-[#17C8A6] text-[#08322A]' : 'text-[#B9B6E3]'}`}>EN</button>
                        </div>
                        <Link to="/login" className="hidden rounded-full border border-white/35 px-4 py-2 text-sm font-semibold text-white hover:border-white sm:inline-flex">{t.nav_login}</Link>
                        <Link to="/register" className="inline-flex rounded-full bg-[#5B4FE8] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5B4FE8]/30 hover:bg-[#4C40D6]">{t.nav_trial}</Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden bg-[radial-gradient(120%_140%_at_15%_0%,#232357_0%,#191A3D_45%,#101124_100%)] py-20 text-white lg:py-24">
                <div className="mx-auto grid max-w-[1180px] items-center gap-14 px-7 lg:grid-cols-[1.05fr_.95fr]">
                    <div>
                        <span className="mb-5 inline-flex rounded-full border border-[#17C8A6]/35 bg-[#17C8A6]/10 px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[#17C8A6]">{t.hero_eyebrow}</span>
                        <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[54px]">{lang === 'fr' ? <>La gestion RH, <span className="bg-gradient-to-r from-[#17C8A6] to-[#8B7FFF] bg-clip-text text-transparent">pensée pour chaque organisation africaine.</span></> : <>HR management, <span className="bg-gradient-to-r from-[#17C8A6] to-[#8B7FFF] bg-clip-text text-transparent">built for every African organization.</span></>}</h1>
                        <p className="mt-6 max-w-xl text-[17.5px] leading-relaxed text-[#C7C5E8]">{t.hero_lead}</p>
                        <div className="mt-8 flex flex-wrap gap-3.5">
                            <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-[#5B4FE8] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#5B4FE8]/30 hover:bg-[#4C40D6]">{t.hero_cta1}<ArrowRightIcon className="h-4 w-4" /></Link>
                            <a href="#tarifs" className="inline-flex items-center rounded-full border border-white/35 px-6 py-3.5 text-sm font-semibold text-white hover:border-white">{t.hero_cta2}</a>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/10 pt-7">
                            {[
                                ['10', t.stat_modules],
                                ['4', t.stat_roles],
                                ['5', t.stat_offers],
                                ['3', t.stat_currency],
                            ].map(([number, label]) => (
                                <div key={label}>
                                    <b className="font-display text-2xl">{number}</b>
                                    <span className="mt-0.5 block text-xs text-[#9C99C9]">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative mx-auto hidden aspect-square w-full max-w-[460px] lg:block">
                        <div className="absolute inset-0 rounded-full border border-[#5B4FE8]/20" />
                        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#5B4FE8] bg-[#101124] shadow-[0_0_45px_rgba(91,79,232,.3)] flex flex-col items-center justify-center">
                            <span className="font-display text-[15px] font-bold">SDS</span>
                            <span className="font-display text-[15px] font-bold text-[#17C8A6]">RH</span>
                        </div>
                        {tenants.map((tenant, index) => {
                            const positions = [
                                'left-[12%] top-[15%]',
                                'right-[12%] top-[10%]',
                                'left-[10%] bottom-[14%]',
                                'right-[8%] bottom-[10%]',
                            ];
                            return (
                                <div key={tenant.name} className={`absolute ${positions[index]} ${tenant.className} animate-[pulse_3.2s_ease-in-out_infinite] rounded-2xl p-4 shadow-2xl`}>
                                    <div className="font-display text-lg font-bold">{tenant.name}</div>
                                    <div className="mt-1 max-w-[125px] font-mono text-[9px] opacity-75">{tenant.tags}</div>
                                    <div className="mt-3 h-1.5 w-28 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-white/55" style={{ width: `${68 - index * 14}%` }} /></div>
                                </div>
                            );
                        })}
                        <p className="absolute bottom-1 left-0 right-0 text-center font-mono text-[10.5px] text-[#B9B6E3]">{t.orbit_caption}</p>
                    </div>
                </div>
            </section>

            {/* Trust bar */}
            <div className="border-t border-white/10 bg-[#101124] py-5">
                <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-7 text-center font-mono text-xs tracking-wide text-[#8683B8]">
                    <span>{t.trust1}</span><span>·</span><span>{t.trust2}</span><span>·</span><span>{t.trust3}</span>
                </div>
            </div>

            {/* Modules */}
            <section id="modules" className="py-20 lg:py-24">
                <div className="mx-auto max-w-[1180px] px-7">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="mb-4 inline-flex rounded-full border border-[#5B4FE8]/25 bg-[#5B4FE8]/[.08] px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[#5B4FE8]">{t.mod_eyebrow}</span>
                        <h2 className="font-display text-3xl font-bold text-[#191A3D] lg:text-[38px]">{t.mod_title}</h2>
                        <p className="mt-3.5 text-base text-[#6B6890]">{t.mod_lead}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {modules.map((module, index) => {
                            const [title, description] = module[lang];
                            const Icon = module.icon;
                            return (
                                <div key={title} className="rounded-[14px] border border-[#E4E1F5] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#8B7FFF] hover:shadow-[0_20px_50px_-20px_rgba(25,26,61,.25)]">
                                    <span className="font-mono text-[11px] font-semibold text-[#0EA98C]">{String(index + 1).padStart(2, '0')}</span>
                                    <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B4FE8]/10 text-[#5B4FE8]"><Icon className="h-5 w-5" /></div>
                                    <h3 className="mt-4 font-display text-sm font-bold text-[#191A3D]">{title}</h3>
                                    <p className="mt-1.5 text-xs leading-snug text-[#6B6890]">{description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Differentiation */}
            <section id="differences" className="border-y border-[#E4E1F5] bg-white py-20 lg:py-24">
                <div className="mx-auto max-w-[1180px] px-7">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="mb-4 inline-flex rounded-full border border-[#5B4FE8]/25 bg-[#5B4FE8]/[.08] px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[#5B4FE8]">{t.diff_eyebrow}</span>
                        <h2 className="font-display text-3xl font-bold text-[#191A3D] lg:text-[38px]">{t.diff_title}</h2>
                        <p className="mt-3.5 text-base text-[#6B6890]">{t.diff_lead}</p>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {differentiators.map((item) => {
                            const [title, description] = item[lang];
                            return (
                                <div key={title} className="rounded-2xl border border-[#E4E1F5] bg-white p-6">
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B4FE8] to-[#17C8A6] text-white">{item.icon}</div>
                                    <h3 className="font-display text-base font-bold text-[#191A3D]">{title}</h3>
                                    <p className="mt-2 text-sm text-[#6B6890]">{description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="tarifs" className="border-y border-[#E4E1F5] bg-white py-20 lg:py-24">
                <div className="mx-auto max-w-[1180px] px-7">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="mb-4 inline-flex rounded-full border border-[#5B4FE8]/25 bg-[#5B4FE8]/[.08] px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[#5B4FE8]">{t.price_eyebrow}</span>
                        <h2 className="font-display text-3xl font-bold text-[#191A3D] lg:text-[38px]">{t.price_title}</h2>
                        <p className="mt-3.5 text-base text-[#6B6890]">{t.price_lead}</p>
                    </div>

                    <div className="mb-12 grid gap-6 rounded-[20px] border border-[#E4E1F5] bg-[#F7F6FB] p-6 lg:grid-cols-[1.4fr_auto_auto] lg:items-center lg:p-7">
                        <div>
                            <label className="mb-2.5 flex justify-between gap-4 text-sm font-semibold text-[#191A3D]">
                                <span>{t.price_slider_label}</span>
                                <span className="font-mono text-[#5B4FE8]">{employees} {t.price_slider_unit}</span>
                            </label>
                            <input aria-label={t.price_slider_label} type="range" min="1" max="200" value={employees} onChange={(event) => setEmployees(Number(event.target.value))} className="w-full accent-[#5B4FE8]" />
                        </div>
                        <div className="flex rounded-full border border-[#E4E1F5] bg-white p-1">
                            <button onClick={() => setCycle('monthly')} className={`rounded-full px-4 py-2 text-xs font-semibold ${cycle === 'monthly' ? 'bg-[#191A3D] text-white' : 'text-[#6B6890]'}`}>{t.price_monthly}</button>
                            <button onClick={() => setCycle('annual')} className={`rounded-full px-4 py-2 text-xs font-semibold ${cycle === 'annual' ? 'bg-[#191A3D] text-white' : 'text-[#6B6890]'}`}>{t.price_annual}</button>
                        </div>
                        <div className="flex rounded-full border border-[#E4E1F5] bg-white p-1">
                            {(['XOF', 'EUR', 'USD'] as Currency[]).map((cur) => (
                                <button key={cur} onClick={() => setCurrency(cur)} className={`rounded-full px-3.5 py-2 text-xs font-semibold ${currency === cur ? 'bg-[#191A3D] text-white' : 'text-[#6B6890]'}`}>{cur === 'XOF' ? 'FCFA' : cur}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {renderedPlans.map((plan) => (
                            <div key={plan.key} className={`relative flex flex-col gap-3.5 rounded-[18px] border-[1.5px] p-5 ${plan.recommended ? 'border-[#5B4FE8] shadow-[0_20px_50px_-20px_rgba(25,26,61,.25)] lg:-translate-y-1.5' : 'border-[#E4E1F5] bg-white'}`}>
                                {plan.recommended && <div className="absolute -top-3 left-5 rounded-full bg-[#5B4FE8] px-3 py-1.5 font-mono text-[11px] font-bold text-white">{t.recommended}</div>}
                                <div className="font-display text-lg font-bold text-[#191A3D]">{plan.data.name}</div>
                                <div className="text-xs text-[#6B6890]">{plan.range}</div>
                                <div className="mt-1 min-h-9 text-[#191A3D]">{plan.price}</div>
                                <ul className="flex flex-1 flex-col gap-2.5">
                                    {plan.data.feat.map((feature) => <li key={feature} className="flex items-start gap-2 text-xs text-[#14132B]"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#0EA98C]" />{feature}</li>)}
                                </ul>
                                <Link to={`/register?${plan.query}`} className={`mt-2 inline-flex w-full items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold ${plan.recommended ? 'border-[#5B4FE8] bg-[#5B4FE8] text-white hover:bg-[#4C40D6]' : 'border-[#E4E1F5] text-[#191A3D] hover:border-[#5B4FE8] hover:text-[#5B4FE8]'}`}>{t.choose} {plan.data.name}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment */}
            <section id="paiement" className="py-20 lg:py-24">
                <div className="mx-auto max-w-[1180px] px-7">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="mb-4 inline-flex rounded-full border border-[#5B4FE8]/25 bg-[#5B4FE8]/[.08] px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[#5B4FE8]">{t.pay_eyebrow}</span>
                        <h2 className="font-display text-3xl font-bold text-[#191A3D] lg:text-[38px]">{t.pay_title}</h2>
                        <p className="mt-3.5 text-base text-[#6B6890]">{t.pay_lead}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            ['FedaPay', '#F0A63A'],
                            ['Kkiapay', '#17C8A6'],
                            ['Visa / Mastercard', '#5B4FE8'],
                            ['PayPal', '#0EA98C'],
                            [t.pay_transfer, '#191A3D'],
                        ].map(([name, dot]) => (
                            <div key={name} className="flex items-center gap-2.5 rounded-[14px] border border-[#E4E1F5] bg-white px-5 py-3.5 text-sm font-semibold text-[#191A3D]">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dot }} />{name}
                            </div>
                        ))}
                    </div>
                    <p className="mx-auto mt-5 max-w-xl text-center text-xs text-[#6B6890]">{t.pay_note}</p>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-0 pb-20 lg:pb-24">
                <div className="mx-auto max-w-[1180px] px-7">
                    <div className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] bg-gradient-to-br from-[#191A3D] via-[#2C2A6B] to-[#5B4FE8] px-8 py-14 text-white lg:px-12">
                        <div>
                            <h2 className="max-w-xl font-display text-2xl font-bold lg:text-3xl">{t.cta_title}</h2>
                            <p className="mt-2.5 max-w-xl text-[#C7C5E8]">{t.cta_lead}</p>
                        </div>
                        <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-[#5B4FE8] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-black/20 hover:bg-[#4C40D6]">{t.cta_button}<ArrowRightIcon className="h-4 w-4" /></Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#101124] py-14 text-[#8683B8]">
                <div className="mx-auto max-w-[1180px] px-7">
                    <div className="grid gap-8 border-b border-white/10 pb-9 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
                        <div>
                            <Link to="/" className="mb-3.5 flex items-center gap-2.5">
                                <img src={logoicone} alt="SDS-RH" className="h-7 w-7" />
                                <span className="font-display text-lg font-bold text-white">SDS<span className="text-[#17C8A6]">·</span>RH</span>
                            </Link>
                            <p className="max-w-[260px] text-[13.5px]">{t.footer_tagline}</p>
                        </div>
                        <div>
                            <h3 className="mb-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white">{t.footer_product}</h3>
                            <a className="mb-2 block text-sm hover:text-white" href="#modules">{t.nav_modules}</a>
                            <a className="mb-2 block text-sm hover:text-white" href="#tarifs">{t.nav_pricing}</a>
                            <a className="block text-sm hover:text-white" href="#paiement">{t.nav_payment}</a>
                        </div>
                        <div>
                            <h3 className="mb-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white">{t.footer_company}</h3>
                            <a className="mb-2 block text-sm hover:text-white" href="#">{t.footer_about}</a>
                            <a className="mb-2 block text-sm hover:text-white" href="#">{t.footer_security}</a>
                            <a className="block text-sm hover:text-white" href="#">{t.footer_contact}</a>
                        </div>
                        <div>
                            <h3 className="mb-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white">{t.footer_legal}</h3>
                            <Link to="/confidentielle/conditions-d-utilisation" className="mb-2 block text-sm hover:text-white">{t.footer_cgu}</Link>
                            <Link to="/confidentielle/politique-de-confidentialite" className="block text-sm hover:text-white">{t.footer_privacy}</Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-between gap-3 pt-6 text-xs">
                        <span>{t.footer_copy}</span>
                        <span>{t.footer_made}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;