import React from 'react';
import type { EmployeeHistory } from '../../types';
import {
    BriefcaseIcon,
    ArrowUpCircleIcon,
    ArrowsRightLeftIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    StarIcon,
    XCircleIcon,
    CheckCircleIcon,
    UserPlusIcon,
    EllipsisHorizontalCircleIcon,
} from '@heroicons/react/24/outline';

interface CareerTimelineProps {
    history: EmployeeHistory[];
    onDelete?: (id: number) => void;
}

const TYPE_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    hire: UserPlusIcon,
    promotion: ArrowUpCircleIcon,
    transfer: ArrowsRightLeftIcon,
    salary_change: CurrencyDollarIcon,
    title_change: BriefcaseIcon,
    contract_change: DocumentTextIcon,
    suspension: ExclamationTriangleIcon,
    warning: ExclamationTriangleIcon,
    commendation: StarIcon,
    termination: XCircleIcon,
    reinstatement: CheckCircleIcon,
    other: EllipsisHorizontalCircleIcon,
};

const TYPE_COLORS: Record<string, string> = {
    hire: 'bg-green-100 text-green-600',
    promotion: 'bg-primary-100 text-primary-600',
    transfer: 'bg-blue-100 text-blue-600',
    salary_change: 'bg-emerald-100 text-emerald-600',
    title_change: 'bg-indigo-100 text-indigo-600',
    contract_change: 'bg-purple-100 text-purple-600',
    suspension: 'bg-orange-100 text-orange-600',
    warning: 'bg-warning-100 text-warning-700',
    commendation: 'bg-yellow-100 text-yellow-700',
    termination: 'bg-red-100 text-red-600',
    reinstatement: 'bg-teal-100 text-teal-600',
    other: 'bg-gray-100 text-gray-600',
};

const TYPE_LABELS: Record<string, string> = {
    hire: 'Embauche',
    promotion: 'Promotion',
    transfer: 'Mutation',
    salary_change: 'Changement de salaire',
    title_change: 'Changement de poste',
    contract_change: 'Changement de contrat',
    suspension: 'Suspension',
    warning: 'Avertissement',
    commendation: 'Distinction',
    termination: 'Fin de contrat',
    reinstatement: 'Réintégration',
    other: 'Autre',
};

const formatSalary = (value?: number | null): string | null =>
    value != null ? `${Number(value).toLocaleString()} FCFA` : null;

const CareerTimeline: React.FC<CareerTimelineProps> = ({ history, onDelete }) => {
    if (history.length === 0) {
        return (
            <p className="text-gray-500 text-center py-8">
                Aucun événement de carrière enregistré pour le moment.
            </p>
        );
    }

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {history.map((event, index) => {
                    const Icon = TYPE_ICONS[event.type] || EllipsisHorizontalCircleIcon;
                    const color = TYPE_COLORS[event.type] || 'bg-gray-100 text-gray-600';
                    const isLast = index === history.length - 1;

                    return (
                        <li key={event.id}>
                            <div className="relative pb-8">
                                {!isLast && (
                                    <span
                                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                    />
                                )}
                                <div className="relative flex items-start space-x-3">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-8 ring-white ${color}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {event.type_label || TYPE_LABELS[event.type] || event.type}
                                                    {' · '}
                                                    {new Date(event.effective_date).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(event.id)}
                                                    className="text-xs font-medium text-danger-600 hover:text-danger-800"
                                                >
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>

                                        {event.description && (
                                            <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                                        )}

                                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                            {(event.previous_department || event.new_department) && (
                                                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                    {event.previous_department?.name || '—'} → {event.new_department?.name || '—'}
                                                </span>
                                            )}
                                            {(event.previous_position || event.new_position) && (
                                                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                    {event.previous_position?.title || '—'} → {event.new_position?.title || '—'}
                                                </span>
                                            )}
                                            {(event.previous_salary != null || event.new_salary != null) && (
                                                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                    {formatSalary(event.previous_salary) || '—'} → {formatSalary(event.new_salary) || '—'}
                                                </span>
                                            )}
                                            {event.initiator && (
                                                <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-400">
                                                    par {event.initiator.first_name} {event.initiator.last_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CareerTimeline;
