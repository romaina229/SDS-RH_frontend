import type { Payroll } from '../../types';

const escapeHtml = (value: unknown): string =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const UNITS = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
    'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

const chunkToWords = (num: number): string => {
    if (num === 0) return '';
    if (num < 20) return UNITS[num];
    if (num < 100) {
        const t = Math.floor(num / 10);
        const u = num % 10;
        if (t === 7 || t === 9) return `${TENS[t]}-${UNITS[10 + u]}`;
        return TENS[t] + (u ? (u === 1 && t !== 8 ? '-et-un' : `-${UNITS[u]}`) : (t === 8 ? 's' : ''));
    }
    const c = Math.floor(num / 100);
    const r = num % 100;
    return (c > 1 ? `${chunkToWords(c)} cent${r === 0 ? 's' : ''}` : 'cent') + (r ? ` ${chunkToWords(r)}` : '');
};

/**
 * Convertit un montant entier en toutes lettres, en français, pour la
 * mention légale du bulletin de paie ("Montant: ...").
 */
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

/**
 * Génère le document HTML complet du bulletin de paie, structuré comme le
 * modèle officiel (en-tête organisation + QR code, bloc identité employé,
 * tableau code/libellé/gain/retenue, totaux, montant en lettres).
 *
 * `payroll` doit être chargé avec les relations employee.user,
 * employee.department, employee.position, tenant.
 */
export const buildPayslipHtml = (payroll: Payroll): string => {
    const employee = payroll.employee;
    const tenant = payroll.tenant;
    const items = payroll.breakdown || [];

    const qrData = `${window.location.origin}/verify/${payroll.qr_token || payroll.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(qrData)}`;

    const rows = items.map((it) => `
        <tr>
            <td class="mono">${escapeHtml(it.code)}</td>
            <td>${escapeHtml(it.label)}${it.patronal ? ' <span class="tag">(patronal)</span>' : ''}</td>
            <td class="num">${it.gain != null ? it.gain.toLocaleString('fr-FR') : ''}</td>
            <td class="num">${it.retenue != null ? it.retenue.toLocaleString('fr-FR') : ''}</td>
            <td class="num">${it.rappel != null ? it.rappel.toLocaleString('fr-FR') : ''}</td>
        </tr>
    `).join('');

    const totalGain = items.filter((i) => i.gain != null).reduce((s, i) => s + (i.gain || 0), 0);
    const totalRetenue = items.filter((i) => i.retenue != null && !i.patronal).reduce((s, i) => s + (i.retenue || 0), 0);

    const orgName = tenant?.emitting_authority || tenant?.name || 'Organisation';
    const logoBlock = tenant?.logo
        ? `<img src="${escapeHtml(tenant.logo)}" alt="Logo" />`
        : `<div class="logo-placeholder">${escapeHtml((tenant?.name || 'SDS').slice(0, 3).toUpperCase())}</div>`;

    return `
        <!doctype html>
        <html lang="fr">
        <head>
            <meta charset="utf-8">
            <title>Bulletin de paie — ${escapeHtml(employee?.user?.first_name)} ${escapeHtml(employee?.user?.last_name)}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 30px; color: #111827; font-size: 12.5px; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #191A3D; padding-bottom: 12px; margin-bottom: 16px; }
                .header-left { display: flex; gap: 12px; align-items: center; }
                .header img { height: 56px; }
                .logo-placeholder { height: 56px; width: 56px; border-radius: 8px; background: #191A3D; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; }
                .org-name { font-weight: 700; font-size: 15px; max-width: 420px; }
                .org-meta { color: #6b7280; font-size: 10.5px; }
                h1 { font-size: 18px; margin: 10px 0 2px; }
                .box { border: 1px solid #d1d5db; border-radius: 6px; padding: 10px 14px; }
                .id-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px 14px; margin: 10px 0; font-size: 11.5px; }
                .id-grid div b { display: block; color: #6b7280; font-weight: 600; font-size: 10px; text-transform: uppercase; }
                table { width: 100%; border-collapse: collapse; margin-top: 14px; }
                th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
                th { background: #f3f4f6; font-size: 10.5px; text-transform: uppercase; }
                td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
                .mono { font-family: monospace; }
                .tag { color: #9ca3af; font-size: 10px; }
                .totals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
                .totals .box b { display: block; font-size: 10px; color: #6b7280; text-transform: uppercase; }
                .net { font-size: 20px; font-weight: 800; color: #065f46; }
                .words { margin-top: 14px; font-style: italic; }
                @media print { body { margin: 12mm; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="header-left">
                    ${logoBlock}
                    <div>
                        <div class="org-name">${escapeHtml(orgName)}</div>
                        <div class="org-meta">${escapeHtml(tenant?.address || '')}</div>
                        <div class="org-meta">
                            ${tenant?.phone ? `Tél: ${escapeHtml(tenant.phone)} ` : ''}
                            ${tenant?.fax ? `· Fax: ${escapeHtml(tenant.fax)} ` : ''}
                        </div>
                        <div class="org-meta">
                            ${tenant?.website ? escapeHtml(tenant.website) : ''}
                            ${tenant?.ifu ? ` · IFU: ${escapeHtml(tenant.ifu)}` : ''}
                        </div>
                    </div>
                </div>
                <img src="${qrUrl}" alt="QR code de vérification" />
            </div>

            <h1>BULLETIN DE PAIE</h1>
            <div class="org-meta">Salaire de : ${escapeHtml(payroll.month)}</div>

            <div class="box" style="margin-top:10px;">
                <div><b>${escapeHtml(employee?.user?.first_name)} ${escapeHtml(employee?.user?.last_name)}</b></div>
                <div class="org-meta">${escapeHtml(employee?.user?.email)}</div>
            </div>

            <div class="id-grid box">
                <div><b>Matricule</b>${escapeHtml(employee?.employee_number)}</div>
                <div><b>Grade</b>${escapeHtml(employee?.position?.grade || '-')}</div>
                <div><b>Situation matrimoniale</b>${escapeHtml(employee?.marital_status || '-')}</div>
                <div><b>Enfants</b>${escapeHtml(employee?.children_count ?? 0)}</div>
                <div><b>Corps</b>${escapeHtml(employee?.position?.corps || '-')}</div>
                <div style="grid-column: span 3;"><b>Fonction</b>${escapeHtml(employee?.position?.title || '-')}</div>
                <div style="grid-column: span 4;"><b>Affectation</b>${escapeHtml(employee?.department?.name || '-')}</div>
            </div>

            <table>
                <thead>
                    <tr><th>Code</th><th>Élément payé</th><th class="num">Gain</th><th class="num">Retenue</th><th class="num">Rappel</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>

            <div class="totals">
                <div class="box">
                    <b>Payé à</b>
                    ${escapeHtml(employee?.bank_details?.bank_name || 'Espèces')}<br>
                    ${escapeHtml(employee?.bank_details?.account_number || '')}
                </div>
                <div class="box">
                    <b>Total gains / retenues</b>
                    ${totalGain.toLocaleString('fr-FR')} / ${totalRetenue.toLocaleString('fr-FR')} FCFA
                </div>
                <div class="box">
                    <b>Net à payer</b>
                    <span class="net">${Number(payroll.net_salary).toLocaleString('fr-FR')} FCFA</span>
                </div>
            </div>

            <div class="words">
                Montant en lettres : ${numberToFrenchWords(Math.round(payroll.net_salary))} francs CFA
            </div>
        </body>
        </html>
    `;
};