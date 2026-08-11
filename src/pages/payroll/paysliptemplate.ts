import type { Payroll } from '../../types';

const escapeHtml = (value: unknown): string =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const formatCurrency = (value: number): string => {
    if (!value || isNaN(value)) return '0 FCFA';
    return Math.round(value).toLocaleString('fr-FR') + ' FCFA';
};

const UNITS = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
    'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

const chunkToWords = (num: number): string => {
    if (num === 0) return '';
    if (num < 20) return UNITS[num];
    if (num < 100) {
        const t = Math.floor(num / 10);
        const u = num % 10;
        if (t === 7) return `soixante-${UNITS[10 + u]}`;
        if (t === 9) return `quatre-vingt-${UNITS[10 + u]}`;
        return TENS[t] + (u ? (u === 1 && t !== 8 ? '-et-un' : `-${UNITS[u]}`) : (t === 8 ? 's' : ''));
    }
    const c = Math.floor(num / 100);
    const r = num % 100;
    return (c > 1 ? `${chunkToWords(c)} cent${r === 0 ? 's' : ''}` : 'cent') + (r ? ` ${chunkToWords(r)}` : '');
};

export const numberToFrenchWords = (n: number): string => {
    if (n === 0) return 'zéro';
    const millions = Math.floor(n / 1000000);
    const thousands = Math.floor((n % 1000000) / 1000);
    const rest = n % 1000;

    let words = '';
    if (millions) words += millions > 1 ? `${chunkToWords(millions)} millions ` : 'un million ';
    if (thousands) words += thousands > 1 ? `${chunkToWords(thousands)} mille ` : 'mille ';
    if (rest) words += chunkToWords(rest);
    return words.trim();
};

const MONTHS_FR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const formatMonthLabel = (month: string): string => {
    const [year, m] = month.split('-').map(Number);
    if (!year || !m || m < 1 || m > 12) return month;
    return `${MONTHS_FR[m - 1]} ${year}`;
};

const maritalStatusLabel = (status?: string, childrenCount?: number): string => {
    const labels: Record<string, string> = {
        single: 'Célibataire',
        married: 'Marié(e)',
        divorced: 'Divorcé(e)',
        widowed: 'Veuf/Veuve',
    };
    const base = status ? (labels[status] || status) : 'Non renseignée';
    const children = childrenCount ? ` — ${childrenCount} enfant(s)` : '';
    return `${base}${children}`;
};

const statusLabel = (payroll: Payroll): string => {
    if (payroll.status === 'paid') {
        const date = payroll.paid_at ? new Date(payroll.paid_at).toLocaleDateString('fr-FR') : '';
        return date ? `Payé le ${date}` : 'Payé';
    }
    if (payroll.status === 'processed') return 'En attente de paiement';
    return 'Brouillon';
};

const seniority = (hireDate?: string): string => {
    if (!hireDate) return '';
    const start = new Date(hireDate);
    if (isNaN(start.getTime())) return '';
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} an${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mois`);
    return parts.length ? parts.join(' ') : "moins d'un mois";
};

export const buildPayslipHtml = (payroll: Payroll): string => {
    const employee = payroll.employee;
    const tenant = payroll.tenant;
    const items = payroll.breakdown || [];

    const qrData = `${window.location.origin}/verify/${payroll.qr_token || payroll.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    const rows = items.map((it: any) => {
        let row = '';
        if (it.gain != null && it.gain > 0) {
            row += `
                <tr>
                    <td>${escapeHtml(it.label)}${it.patronal ? ' <span class="tag">(charge patronale)</span>' : ''}</td>
                    <td class="num muted"></td>
                    <td class="num muted"></td>
                    <td class="num gain">${formatCurrency(it.gain)}</td>
                </tr>
            `;
        }
        if (it.retenue != null && it.retenue > 0) {
            row += `
                <tr class="retenue-row">
                    <td class="indent">${escapeHtml(it.label)}</td>
                    <td class="num muted"></td>
                    <td class="num muted"></td>
                    <td class="num retenue">${formatCurrency(it.retenue)}</td>
                </tr>
            `;
        }
        return row;
    }).join('');

    const totalGain = items
        .filter((i: any) => i.gain != null && i.gain > 0)
        .reduce((s: number, i: any) => s + Number(i.gain), 0);
    const totalRetenue = items
        .filter((i: any) => i.retenue != null && i.retenue > 0 && !i.patronal)
        .reduce((s: number, i: any) => s + Number(i.retenue), 0);

    const orgName = tenant?.emitting_authority || tenant?.name || 'Organisation';
    const logoBlock = tenant?.logo
        ? `<img src="${escapeHtml(tenant.logo)}" alt="Logo" />`
        : `<div class="logo-placeholder">${escapeHtml((tenant?.name || 'SDS').slice(0, 3).toUpperCase())}</div>`;

    const posteLabel = [employee?.position?.title, employee?.department?.name].filter(Boolean).join(' — Service : ');

    return `
        <!doctype html>
        <html lang="fr">
        <head>
            <meta charset="utf-8">
            <title>Bulletin de paie — ${escapeHtml(employee?.user?.first_name)} ${escapeHtml(employee?.user?.last_name)}</title>
            <style>
                * { box-sizing: border-box; }
                body { font-family: 'Segoe UI', Arial, sans-serif; margin: 24px; color: #14132B; font-size: 12.5px; background: #fff; }
                .sheet { max-width: 780px; margin: 0 auto; border: 1px solid #E4E1F5; border-radius: 12px; overflow: hidden; }

                .banner { background: linear-gradient(135deg, #191A3D, #2C2A6B); color: #fff; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; }
                .banner-left { display: flex; gap: 14px; align-items: center; }
                .banner img { height: 52px; width: 52px; border-radius: 10px; object-fit: contain; background: #fff; padding: 4px; }
                .logo-placeholder { height: 52px; width: 52px; border-radius: 10px; background: #5B4FE8; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; letter-spacing: .5px; }
                .org-name { font-weight: 800; font-size: 16px; letter-spacing: .2px; }
                .org-meta { color: #C7C5E8; font-size: 10.8px; line-height: 1.5; margin-top: 2px; }
                .banner img.qr { height: 64px; width: 64px; border-radius: 6px; background: #fff; padding: 3px; }

                .title-block { text-align: center; padding: 18px 24px 6px; }
                .title-block h1 { font-size: 19px; margin: 0; letter-spacing: .5px; color: #191A3D; }
                .title-block .sub { color: #6B6890; font-size: 11.5px; margin-top: 3px; }

                .id-box { margin: 14px 24px 0; background: #F7F6FB; border: 1px solid #E4E1F5; border-radius: 10px; padding: 14px 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; }
                .id-box .employee-name { grid-column: 1 / -1; font-weight: 800; font-size: 14.5px; color: #191A3D; margin-bottom: 4px; }
                .id-box .row { font-size: 11.5px; color: #14132B; padding: 2px 0; }
                .id-box .row b { color: #6B6890; font-weight: 600; margin-right: 4px; }

                table { width: 100%; border-collapse: collapse; margin: 16px 0 0; }
                thead th { background: #F0EFFB; color: #5B4FE8; font-size: 10.3px; text-transform: uppercase; letter-spacing: .4px; text-align: left; padding: 8px 10px; border-bottom: 2px solid #E4E1F5; }
                thead th.num { text-align: right; }
                tbody td { padding: 7px 10px; border-bottom: 1px solid #EEEDF7; font-size: 12px; }
                tbody td.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
                tbody td.gain { color: #0EA98C; font-weight: 600; }
                tbody td.retenue { color: #E5484D; font-weight: 600; }
                tbody td.indent { padding-left: 22px; color: #6B6890; font-style: italic; }
                tbody tr.retenue-row td { border-bottom: 1px solid #EEEDF7; }
                .tag { color: #9C99C9; font-size: 9.5px; }

                .totals-strip { margin: 0 24px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding: 14px 0; }
                .totals-strip .box { border: 1px solid #E4E1F5; border-radius: 8px; padding: 10px 12px; }
                .totals-strip .box b { display: block; font-size: 9.5px; text-transform: uppercase; color: #6B6890; letter-spacing: .3px; margin-bottom: 2px; }
                .net-box { background: #191A3D; color: #fff; border: none !important; }
                .net-box b { color: #C7C5E8 !important; }
                .net-amount { font-size: 19px; font-weight: 800; color: #17C8A6; }

                .words { margin: 0 24px 4px; font-style: italic; color: #6B6890; font-size: 11px; }
                .footer { margin: 14px 24px 20px; padding-top: 10px; border-top: 1px dashed #E4E1F5; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #9C99C9; }

                @media print { body { margin: 0; } .sheet { border: none; border-radius: 0; } }
            </style>
        </head>
        <body>
            <div class="sheet">
                <div class="banner">
                    <div class="banner-left">
                        ${logoBlock}
                        <div>
                            <div class="org-name">${escapeHtml(orgName)}</div>
                            <div class="org-meta">
                                ${escapeHtml(tenant?.address || '')}<br>
                                ${tenant?.phone ? `Tél: ${escapeHtml(tenant.phone)} ` : ''}
                                ${tenant?.email ? `· ${escapeHtml(tenant.email)}` : ''}
                                ${tenant?.ifu ? `<br>IFU: ${escapeHtml(tenant.ifu)}` : ''}
                                ${tenant?.rccm ? ` · RCCM: ${escapeHtml(tenant.rccm)}` : ''}
                            </div>
                        </div>
                    </div>
                    <img class="qr" src="${qrUrl}" alt="QR code de vérification" />
                </div>

                <div class="title-block">
                    <h1>BULLETIN DE PAIE</h1>
                    <div class="sub">${escapeHtml(formatMonthLabel(payroll.month))} — Réf. bulletin n° ${escapeHtml(String(payroll.qr_token || payroll.id).slice(0, 10).toUpperCase())}</div>
                </div>

                <div class="id-box">
                    <div class="employee-name">${escapeHtml(employee?.user?.first_name)} ${escapeHtml(employee?.user?.last_name)}</div>
                    <div class="row"><b>Matricule :</b>${escapeHtml(employee?.employee_number)}</div>
                    <div class="row"><b>Situation familiale :</b>${escapeHtml(maritalStatusLabel(employee?.marital_status, employee?.children_count))}</div>
                    <div class="row"><b>Poste :</b>${escapeHtml(posteLabel || '-')}</div>
                    <div class="row"><b>Jours travaillés :</b>${escapeHtml(payroll.worked_days ?? '-')} jours</div>
                    <div class="row"><b>Type de contrat :</b>${escapeHtml((employee?.contracts?.[0]?.type || '-').toUpperCase())}</div>
                    <div class="row"><b>Taux horaire indicatif :</b>${payroll.hourly_rate ? formatCurrency(payroll.hourly_rate) + '/h' : '-'}</div>
                    <div class="row"><b>Ancienneté :</b>${escapeHtml(employee?.hire_date ? `Embauché(e) le ${new Date(employee.hire_date).toLocaleDateString('fr-FR')} — ${seniority(employee.hire_date)}` : '-')}</div>
                    <div class="row"><b>Mode de paiement :</b>${escapeHtml(payroll.payment_method || 'Virement bancaire')}</div>
                    <div class="row"><b></b></div>
                    <div class="row"><b>Statut :</b>${escapeHtml(statusLabel(payroll))}</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Élément de rémunération</th>
                            <th class="num">Base</th>
                            <th class="num">Taux</th>
                            <th class="num">Montant</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>

                <div class="totals-strip">
                    <div class="box">
                        <b>Total gains</b>
                        ${formatCurrency(totalGain)}
                    </div>
                    <div class="box">
                        <b>Total retenues</b>
                        ${formatCurrency(totalRetenue)}
                    </div>
                    <div class="box net-box">
                        <b>Net à payer</b>
                        <span class="net-amount">${formatCurrency(Number(payroll.net_salary))}</span>
                    </div>
                </div>

                <div class="words">
                    Montant en lettres : ${numberToFrenchWords(Math.round(Number(payroll.net_salary)))} francs CFA
                </div>

                <div class="footer">
                    <span>Document généré par SDS-RH — vérifiable via le QR code ci-dessus.</span>
                    <span>${escapeHtml(orgName)}</span>
                </div>
            </div>
        </body>
        </html>
    `;
};