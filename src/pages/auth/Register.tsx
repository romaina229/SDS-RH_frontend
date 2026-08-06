import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';

type Lang = 'fr' | 'en';
type Plan = 'free' | 'starter' | 'standard' | 'business' | 'enterprise';
type Cycle = 'monthly' | 'annual';
type Currency = 'XOF' | 'EUR' | 'USD';
type Payment = 'fedapay' | 'kkiapay' | 'card' | 'paypal' | 'transfer';

interface RegisterFormData {
  organization_name: string; organization_type: string; country: string; sector: string;
  employee_count: number; plan: Plan; cycle: Cycle; currency: Currency; payment: Payment;
  full_name: string; email: string; phone: string; password: string; password_confirmation: string;
  cgu: boolean; newsletter: boolean;
}

const T = {
  fr: {
    back:"← Retour à l'accueil", eyebrow:"Créer votre espace SDS-RH", title:"Un espace RH sécurisé pour votre organisation",
    lead:"Renseignez votre organisation, choisissez votre formule et vos modalités de paiement — votre espace est prêt en quelques minutes.",
    step1:"Organisation", step2:"Formule & facturation", step3:"Paiement", step4:"Compte administrateur",
    org_h:"Votre organisation", org_sub:"Ces informations déterminent vos jours fériés, votre devise et vos cotisations sociales.",
    org_name:"Nom de l'organisation", org_name_ph:"Ex : Fondation Espoir", org_type:"Type d'organisation",
    type_pme:"PME / Entreprise privée", type_ong:"ONG / Association", type_public:"Institution publique", type_school:"École / Université", type_hospital:"Hôpital / Clinique",
    org_country:"Pays", c_benin:"Bénin (FCFA)", c_ci:"Côte d'Ivoire (FCFA)", c_senegal:"Sénégal (FCFA)", c_togo:"Togo (FCFA)", c_france:"France (EUR)", c_other:"Autre pays (USD)",
    org_sector:"Secteur d'activité", org_sector_ph:"Ex : Santé, Éducation, Commerce…", org_size:"Effectif actuel", employees:"employés", org_size_hint:"Nous suggérons automatiquement la formule adaptée — vous pourrez la modifier.",
    plan_h:"Formule & facturation", plan_sub:"Changez de formule à tout moment depuis votre espace d'administration.", cycle_label:"Cycle de facturation", cycle_monthly:"Mensuel", cycle_monthly_d:"Sans engagement", cycle_annual:"Annuel", cycle_annual_d:"−17% · 2 mois offerts", currency_label:"Devise de facturation", suggested:"Suggéré", quote:"Sur devis", free:"Gratuit", perMonth:"/mois", perYear:"/an",
    pay_h:"Moyen de paiement", pay_sub:"Choisissez comment régler votre abonnement.", pay_mm:"Mobile money & carte — Afrique de l'Ouest", pay_mm2:"Mobile money — Bénin, Togo, Côte d'Ivoire…", pay_card:"Carte bancaire", pay_intl:"Paiement international", pay_transfer:"Virement bancaire", pay_transfer_d:"Recommandé pour l'offre Annuel / Enterprise",
    modal_title:"Modalités contractuelles", modal1:"Essai gratuit de 14 jours sur les formules payantes, sans engagement.", modal2:"Formule Mensuelle : résiliable à tout moment, effective à la fin de la période en cours.", modal3:"Formule Annuelle : engagement de 12 mois, renouvellement automatique sauf annulation 7 jours avant l'échéance.", modal4:"Facturation au début de chaque période, dans la devise sélectionnée.", modal5:"Changement de formule possible à tout moment, avec ajustement au prorata.",
    admin_h:"Compte administrateur", admin_sub:"Ce compte pilote l'ensemble de votre espace RH.", admin_name:"Nom complet", admin_email:"Email professionnel", admin_phone:"Téléphone", admin_pwd:"Mot de passe", admin_pwd2:"Confirmer le mot de passe",
    agree1a:"J'accepte les", agree_cgu:"conditions générales d'utilisation", agree1b:"et la", agree_privacy:"politique de confidentialité", agree2:"J'accepte de recevoir des conseils RH et les actualités de SDS-RH.", submit:"Créer mon espace SDS-RH", already:"Déjà un compte ?", login:"Se connecter",
    summary_title:"Récapitulatif", sum_cycle:"Cycle", sum_currency:"Devise", sum_payment:"Paiement", sum_total:"Total dû aujourd'hui", trial_note:"🎁 14 jours d'essai gratuit inclus avant le premier prélèvement.", trial_note_free:"✓ Formule Gratuite — aucun moyen de paiement requis.", footer_copy:"© 2026 SDS-RH. Tous droits réservés. Paiements sécurisés et chiffrés.", pwdMismatch:"Les mots de passe ne correspondent pas.", required:"Ce champ est requis.", invalidEmail:"Email invalide.", minPassword:"Minimum 8 caractères.", cguRequired:"Vous devez accepter les conditions générales et la politique de confidentialité."
  },
  en: {
    back:"← Back to home", eyebrow:"Create your SDS-RH workspace", title:"A secure HR workspace for your organization", lead:"Tell us about your organization, choose your plan and payment terms — your workspace is ready in minutes.",
    step1:"Organization", step2:"Plan & billing", step3:"Payment", step4:"Admin account", org_h:"Your organization", org_sub:"This information determines your public holidays, currency and social contributions.", org_name:"Organization name", org_name_ph:"E.g. Hope Foundation", org_type:"Organization type",
    type_pme:"SME / Private company", type_ong:"NGO / Association", type_public:"Public institution", type_school:"School / University", type_hospital:"Hospital / Clinic", org_country:"Country", c_benin:"Benin (XOF)", c_ci:"Côte d'Ivoire (XOF)", c_senegal:"Senegal (XOF)", c_togo:"Togo (XOF)", c_france:"France (EUR)", c_other:"Other country (USD)",
    org_sector:"Sector of activity", org_sector_ph:"E.g. Healthcare, Education, Retail…", org_size:"Current headcount", employees:"employees", org_size_hint:"We automatically suggest the right plan — you can change it anytime.", plan_h:"Plan & billing", plan_sub:"You can change your plan anytime from your admin workspace.", cycle_label:"Billing cycle", cycle_monthly:"Monthly", cycle_monthly_d:"No commitment", cycle_annual:"Annual", cycle_annual_d:"−17% · 2 months free", currency_label:"Billing currency", suggested:"Suggested", quote:"Custom quote", free:"Free", perMonth:"/mo", perYear:"/yr",
    pay_h:"Payment method", pay_sub:"Choose how you'd like to pay for your subscription.", pay_mm:"Mobile money & card — West Africa", pay_mm2:"Mobile money — Benin, Togo, Côte d'Ivoire…", pay_card:"Credit / debit card", pay_intl:"International payment", pay_transfer:"Bank transfer", pay_transfer_d:"Recommended for Annual / Enterprise plans", modal_title:"Contract terms", modal1:"14-day free trial on paid plans, no commitment.", modal2:"Monthly plan: cancel anytime, effective at the end of the current period.", modal3:"Annual plan: 12-month commitment, auto-renews unless cancelled 7 days before renewal.", modal4:"Billed at the start of each period, in the selected currency.", modal5:"Change plans anytime, with a prorated adjustment.",
    admin_h:"Administrator account", admin_sub:"This account manages your entire HR workspace.", admin_name:"Full name", admin_email:"Work email", admin_phone:"Phone number", admin_pwd:"Password", admin_pwd2:"Confirm password", agree1a:"I agree to the", agree_cgu:"terms of service", agree1b:"and the", agree_privacy:"privacy policy", agree2:"I'd like to receive HR tips and SDS-RH news.", submit:"Create my SDS-RH workspace", already:"Already have an account?", login:"Log in", summary_title:"Summary", sum_cycle:"Cycle", sum_currency:"Currency", sum_payment:"Payment", sum_total:"Total due today", trial_note:"🎁 14-day free trial included before your first charge.", trial_note_free:"✓ Free plan — no payment method required.", footer_copy:"© 2026 SDS-RH. All rights reserved. Secure, encrypted payments.", pwdMismatch:"Passwords do not match.", required:"This field is required.", invalidEmail:"Invalid email.", minPassword:"Minimum 8 characters.", cguRequired:"You must accept the terms of service and privacy policy."
  }
} as const;

const PLANS = [
  {key:'free' as Plan,min:1,max:5,priceXOF:0,fr:'Gratuit',en:'Free'},
  {key:'starter' as Plan,min:6,max:20,priceXOF:5000,fr:'Starter',en:'Starter'},
  {key:'standard' as Plan,min:21,max:50,priceXOF:15000,fr:'Standard',en:'Standard'},
  {key:'business' as Plan,min:51,max:150,priceXOF:35000,fr:'Business',en:'Business'},
  {key:'enterprise' as Plan,min:151,max:999999,priceXOF:null,fr:'Enterprise',en:'Enterprise'}
];
const RATES:Record<Currency,number>={XOF:1,EUR:1/655.957,USD:1/580};
const SYMS:Record<Currency,string>={XOF:'FCFA',EUR:'€',USD:'$'};
const TYPES=[['PME / Entreprise privée','SME / Private company'],['ONG / Association','NGO / Association'],['Institution publique','Public institution'],['École / Université','School / University'],['Hôpital / Clinique','Hospital / Clinic']];
const COUNTRIES=[['XOF','Bénin (FCFA)','Benin (XOF)'],['XOF',"Côte d'Ivoire (FCFA)","Côte d'Ivoire (XOF)"],['XOF','Sénégal (FCFA)','Senegal (XOF)'],['XOF','Togo (FCFA)','Togo (XOF)'],['EUR','France (EUR)','France (EUR)'],['USD','Autre pays (USD)','Other country (USD)']] as const;
const PAYMENTS:Payment[]=['fedapay','kkiapay','card','paypal','transfer'];

const Register:React.FC=()=>{
  const {register:registerUser}=useAuth(); const navigate=useNavigate(); const [params]=useSearchParams();
  const [lang,setLang]=useState<Lang>('fr'); const [loading,setLoading]=useState(false); const [employeeCount,setEmployeeCount]=useState(25); const [selectedPlan,setSelectedPlan]=useState<Plan>('free'); const [cycle,setCycle]=useState<Cycle>('monthly'); const [currency,setCurrency]=useState<Currency>('XOF'); const [payment,setPayment]=useState<Payment>('fedapay');
  const t=T[lang];
  const {register,handleSubmit,watch,setValue,formState:{errors}}=useForm<RegisterFormData>({defaultValues:{organization_name:'',organization_type:'PME / Entreprise privée',country:'XOF',sector:'',employee_count:25,plan:'free',cycle:'monthly',currency:'XOF',payment:'fedapay',full_name:'',email:'',phone:'',password:'',password_confirmation:'',cgu:false,newsletter:false}});
  const pwd=watch('password'); const selected=useMemo(()=>PLANS.find(p=>p.key===selectedPlan)||PLANS[0],[selectedPlan]);
  const fmt=(x:number)=>{const v=x*RATES[currency];const r=currency==='XOF'?Math.round(v/100)*100:Math.round(v*100)/100;return `${r.toLocaleString(lang==='fr'?'fr-FR':'en-US')} ${SYMS[currency]}`};
  const price=(p:typeof PLANS[number])=>p.priceXOF===null?t.quote:p.priceXOF===0?t.free:`${fmt(cycle==='monthly'?p.priceXOF:p.priceXOF*10)}${cycle==='monthly'?t.perMonth:t.perYear}`;
  const total=selected.priceXOF===null?t.quote:fmt(cycle==='monthly'?selected.priceXOF:selected.priceXOF*10);

  useEffect(()=>{const p=params.get('plan') as Plan|null,c=params.get('cycle') as Cycle|null,cur=params.get('currency') as Currency|null;if(p&&PLANS.some(x=>x.key===p)){setSelectedPlan(p);setValue('plan',p)}if(c==='monthly'||c==='annual'){setCycle(c);setValue('cycle',c)}if(cur&&['XOF','EUR','USD'].includes(cur)){setCurrency(cur);setValue('currency',cur)}},[params,setValue]);
  useEffect(()=>setValue('employee_count',employeeCount),[employeeCount,setValue]);
  const changeEmp=(n:number)=>{setEmployeeCount(n);const p=PLANS.find(x=>n>=x.min&&n<=x.max)||PLANS[0];setSelectedPlan(p.key);setValue('plan',p.key)};
  const submit=async(data:RegisterFormData)=>{
    if(data.password!==data.password_confirmation) return;
    setLoading(true);
    try{
      const {employee_count,password_confirmation,full_name,organization_name,...payload}=data;
      const nameParts=full_name.trim().split(/\s+/);
      const first_name=nameParts.shift()||'';
      const last_name=nameParts.join(' ')||'';
      const requestPayload={
        ...payload,
        organization_name,
        employee_count,
        full_name,
        plan:selectedPlan,
        cycle,
        currency,
        payment,
        tenant_name:organization_name,
        first_name,
        last_name,
        password_confirmation
      };
      const result=await registerUser({...requestPayload,country:currency});
      if(result.success) navigate('/dashboard');
    }finally{setLoading(false)}
  };
  const field='border-[1.5px] border-[#E4E1F5] rounded-[10px] px-3 py-2.5 text-sm w-full bg-white outline-none focus:border-[#5B4FE8] focus:ring-4 focus:ring-[#5B4FE8]/10';
  const err=(e:any)=><span className="text-xs text-[#E5484D]">{e?.message}</span>;
  const paymentLabel=(p:Payment)=>p==='fedapay'?'FedaPay':p==='kkiapay'?'Kkiapay':p==='card'?t.pay_card:p==='paypal'?'PayPal':t.pay_transfer;
  const paymentDesc=(p:Payment)=>p==='fedapay'?t.pay_mm:p==='kkiapay'?t.pay_mm2:p==='card'?'Visa, Mastercard':p==='paypal'?t.pay_intl:t.pay_transfer_d;
  return <div className="min-h-screen bg-[#F7F6FB] text-[#14132B]">
    <header className="bg-[#191A3D] py-4"><div className="max-w-[1180px] mx-auto px-7 flex items-center justify-between"><Link to="/" className="flex items-center gap-2.5"><svg viewBox="0 0 96 96" width="28"><rect x="14" y="58" width="20" height="20" rx="6.5" fill="#5B4FE8"/><rect x="38" y="40" width="25" height="25" rx="7.5" fill="#4A3FD6"/><rect x="64" y="16" width="30" height="30" rx="8.5" fill="#17C8A6"/></svg><span className="font-display font-bold text-[19px] text-white">SDS<span className="text-[#17C8A6]">·</span>RH</span></Link><div className="flex items-center gap-4"><Link to="/" className="text-[#C7C5E8] text-sm hover:text-white">{t.back}</Link><div className="flex bg-white/10 rounded-full p-0.5 border border-white/15"><button type="button" onClick={()=>setLang('fr')} className={`rounded-full px-3 py-1.5 text-xs font-semibold font-mono ${lang==='fr'?'bg-[#17C8A6] text-[#08322A]':'text-[#B9B6E3]'}`}>FR</button><button type="button" onClick={()=>setLang('en')} className={`rounded-full px-3 py-1.5 text-xs font-semibold font-mono ${lang==='en'?'bg-[#17C8A6] text-[#08322A]':'text-[#B9B6E3]'}`}>EN</button></div></div></div></header>
    <main><div className="max-w-[1180px] mx-auto px-7 pt-11 pb-7"><div className="inline-flex font-mono text-xs uppercase tracking-wider text-[#5B4FE8] bg-[#5B4FE8]/10 border border-[#5B4FE8]/25 px-3 py-1.5 rounded-full mb-4">{t.eyebrow}</div><h1 className="font-display text-[clamp(26px,3.4vw,36px)] font-bold text-[#191A3D] mb-2.5">{t.title}</h1><p className="text-[#6B6890] text-[15.5px] max-w-[560px]">{t.lead}</p><div className="flex flex-wrap gap-2.5 mt-6">{[t.step1,t.step2,t.step3,t.step4].map((s,i)=><div key={s} className="flex items-center gap-2 text-xs font-semibold text-[#6B6890] bg-white border border-[#E4E1F5] px-3.5 py-2 rounded-full"><span className="w-[18px] h-[18px] rounded-full bg-[#5B4FE8] text-white text-[11px] flex items-center justify-center font-mono">{i+1}</span>{s}</div>)}</div></div>
      <div className="max-w-[1180px] mx-auto px-7 pb-20 grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-7 items-start"><form onSubmit={handleSubmit(submit)}>
        <section className="bg-white border border-[#E4E1F5] rounded-2xl p-7 md:p-[30px_28px] mb-[22px]"><div className="font-mono text-[11.5px] text-[#0EA98C] font-bold">01</div><h3 className="font-display text-[17px] font-bold text-[#191A3D]">{t.org_h}</h3><p className="text-[#6B6890] text-[13.5px] mb-5">{t.org_sub}</p>
          <div className="grid md:grid-cols-2 gap-4"><div className="mb-4"><label className="block text-[13px] font-semibold mb-1.5">{t.org_name}</label><input {...register('organization_name',{required:t.required})} placeholder={t.org_name_ph} className={field}/>{err(errors.organization_name)}</div><div className="mb-4"><label className="block text-[13px] font-semibold mb-1.5">{t.org_type}</label><select {...register('organization_type',{required:t.required})} className={field}>{TYPES.map(x=><option key={x[0]} value={x[0]}>{lang==='fr'?x[0]:x[1]}</option>)}</select></div></div>
          <div className="grid md:grid-cols-2 gap-4"><div className="mb-4"><label className="block text-[13px] font-semibold mb-1.5">{t.org_country}</label><select value={currency} onChange={e=>{const v=e.target.value as Currency;setCurrency(v);setValue('country',v);setValue('currency',v)}} className={field}>{COUNTRIES.map((x,i)=><option key={i} value={x[0]}>{lang==='fr'?x[1]:x[2]}</option>)}</select></div><div className="mb-4"><label className="block text-[13px] font-semibold mb-1.5">{t.org_sector}</label><input {...register('sector',{required:t.required})} placeholder={t.org_sector_ph} className={field}/>{err(errors.sector)}</div></div>
          <label className="block text-[13px] font-semibold mb-1.5">{t.org_size} — <span className="font-mono">{employeeCount} {t.employees}</span></label><input type="range" min="1" max="200" value={employeeCount} onChange={e=>changeEmp(Number(e.target.value))} className="w-full accent-[#5B4FE8]"/><span className="text-[11.5px] text-[#6B6890]">{t.org_size_hint}</span>
        </section>

        <section className="bg-white border border-[#E4E1F5] rounded-2xl p-7 md:p-[30px_28px] mb-[22px]"><div className="font-mono text-[11.5px] text-[#0EA98C] font-bold">02</div><h3 className="font-display text-[17px] font-bold">{t.plan_h}</h3><p className="text-[#6B6890] text-[13.5px] mb-5">{t.plan_sub}</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{PLANS.map(p=><label key={p.key} className="relative cursor-pointer">{employeeCount>=p.min&&employeeCount<=p.max&&<span className="absolute -top-2 right-2.5 z-10 bg-[#0EA98C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{t.suggested}</span>}<input type="radio" name="plan" checked={selectedPlan===p.key} onChange={()=>{setSelectedPlan(p.key);setValue('plan',p.key)}} className="sr-only"/><div className={`h-full border-[1.5px] rounded-xl p-3.5 ${selectedPlan===p.key?'border-[#5B4FE8] bg-[#F7F6FE] ring-4 ring-[#5B4FE8]/10':'border-[#E4E1F5]'}`}><div className="font-bold text-[14.5px]">{p[lang]}</div><div className="text-[11.5px] text-[#6B6890]">{p.priceXOF===null?'150+':`${p.min}–${p.max}`} {t.employees}</div><div className="font-mono text-[13.5px] text-[#5B4FE8] mt-2 font-semibold">{price(p)}</div></div></label>)}</div>
          <label className="block text-[13px] font-semibold mt-[22px] mb-1.5">{t.cycle_label}</label><div className="flex gap-3 flex-wrap">{[['monthly',t.cycle_monthly,t.cycle_monthly_d],['annual',t.cycle_annual,t.cycle_annual_d]].map(([v,a,b])=><label key={v} className="relative flex-1 min-w-[150px] cursor-pointer"><input type="radio" name="cycle" checked={cycle===v} onChange={()=>{setCycle(v as Cycle);setValue('cycle',v as Cycle)}} className="sr-only"/><div className={`border-[1.5px] rounded-xl p-3.5 text-center ${cycle===v?'border-[#0EA98C] bg-[#F0FCFA]':'border-[#E4E1F5]'}`}><b className="block text-sm">{a}</b><span className="text-[11.5px] text-[#6B6890]">{b}</span></div></label>)}</div>
          <label className="block text-[13px] font-semibold mt-4 mb-1.5">{t.currency_label}</label><select value={currency} onChange={e=>{const v=e.target.value as Currency;setCurrency(v);setValue('currency',v)}} className={field}><option value="XOF">FCFA (XOF)</option><option value="EUR">Euro (EUR)</option><option value="USD">Dollar (USD)</option></select>
        </section>

        <section className="bg-white border border-[#E4E1F5] rounded-2xl p-7 md:p-[30px_28px] mb-[22px]"><div className="font-mono text-[11.5px] text-[#0EA98C] font-bold">03</div><h3 className="font-display text-[17px] font-bold">{t.pay_h}</h3><p className="text-[#6B6890] text-[13.5px] mb-5">{t.pay_sub}</p><div className={`grid sm:grid-cols-2 gap-3 ${selected.key==='free'?'opacity-45 pointer-events-none':''}`}>{PAYMENTS.map(p=><label key={p} className="cursor-pointer"><input type="radio" name="payment" checked={payment===p} onChange={()=>{setPayment(p);setValue('payment',p)}} className="sr-only"/><div className={`border-[1.5px] rounded-xl p-3.5 flex items-center gap-3 ${payment===p?'border-[#5B4FE8] bg-[#F7F6FE]':'border-[#E4E1F5]'}`}><div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-white bg-[#5B4FE8]">{p==='fedapay'?'F':p==='kkiapay'?'K':p==='card'?'💳':p==='paypal'?'P':'🏦'}</div><div><b className="block text-[13.5px]">{paymentLabel(p)}</b><span className="text-[11px] text-[#6B6890]">{paymentDesc(p)}</span></div></div></label>)}</div><div className="bg-[#FBF7EC] border border-[#F0DDA8] rounded-xl p-4 text-[13px] text-[#6B5A28] mt-1.5"><strong>{t.modal_title}</strong><ul className="mt-2 pl-[18px] list-disc"><li>{t.modal1}</li><li>{t.modal2}</li><li>{t.modal3}</li><li>{t.modal4}</li><li>{t.modal5}</li></ul></div></section>

        <section className="bg-white border border-[#E4E1F5] rounded-2xl p-7 md:p-[30px_28px] mb-[22px]"><div className="font-mono text-[11.5px] text-[#0EA98C] font-bold">04</div><h3 className="font-display text-[17px] font-bold">{t.admin_h}</h3><p className="text-[#6B6890] text-[13.5px] mb-5">{t.admin_sub}</p><div className="grid md:grid-cols-2 gap-4"><div className="mb-4"><label className="block text-[13px] font-semibold mb-1.5">{t.admin_name}</label><input {...register('full_name',{required:t.required})} className={field}/>{err(errors.full_name)}</div><div className="mb-4"><label className="block text-[13px] font-semibold mb-1.5">{t.admin_email}</label><input {...register('email',{required:t.required,pattern:{value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:t.invalidEmail}})} type="email" className={field}/>{err(errors.email)}</div></div><div className="grid md:grid-cols-2 gap-4"><div className="mb-4"><label className="block text-[13px] font-semibold mb-1.5">{t.admin_phone}</label><input {...register('phone',{required:t.required})} type="tel" placeholder="+229 …" className={field}/>{err(errors.phone)}</div><div/></div><div className="grid md:grid-cols-2 gap-4"><div className="mb-4"><label className="block text-[13px] font-semibold mb-1.5">{t.admin_pwd}</label><input {...register('password',{required:t.required,minLength:{value:8,message:t.minPassword}})} type="password" className={field}/>{err(errors.password)}</div><div className="mb-4"><label className="block text-[13px] font-semibold mb-1.5">{t.admin_pwd2}</label><input {...register('password_confirmation',{required:t.required,validate:v=>v===pwd||t.pwdMismatch})} type="password" className={field}/>{err(errors.password_confirmation)}</div></div>
          <div className="flex gap-2.5 items-start mb-3"><input {...register('cgu',{required:t.cguRequired})} type="checkbox" id="cgu" className="mt-1"/><label htmlFor="cgu" className="text-[13px] text-[#6B6890]">{t.agree1a} <Link to="/confidentielle/conditions-d-utilisation" className="text-[#5B4FE8] font-semibold">{t.agree_cgu}</Link> {t.agree1b} <Link to="/confidentielle/politique-de-confidentialite" className="text-[#5B4FE8] font-semibold">{t.agree_privacy}</Link>.</label></div>{err(errors.cgu)}<div className="flex gap-2.5 items-start my-3"><input {...register('newsletter')} type="checkbox" id="news" className="mt-1"/><label htmlFor="news" className="text-[13px] text-[#6B6890]">{t.agree2}</label></div><button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-full bg-[#5B4FE8] hover:bg-[#4C40D6] text-white font-bold text-[15px] disabled:opacity-60">{loading?'...':t.submit}</button><p className="text-center text-xs text-[#6B6890] mt-3">{t.already} <Link to="/login" className="text-[#5B4FE8] font-semibold">{t.login}</Link></p>
        </section>
      </form>
      <aside className="lg:sticky lg:top-6 bg-gradient-to-br from-[#191A3D] to-[#262A5F] text-white rounded-[20px] p-7"><h4 className="text-white text-[15px] font-bold mb-[18px] flex justify-between"><span>{t.summary_title}</span><span className="font-mono text-[11px] text-[#9C99C9]">{watch('organization_type')||''}</span></h4><div className="flex justify-between items-baseline py-3.5 border-b border-white/10"><b className="font-display text-[19px]">{selected[lang]}</b><span className="font-mono text-xs text-[#C7C5E8]">{selected.priceXOF===null?'150+':`${selected.min}–${selected.max} ${t.employees}`}</span></div><div className="flex justify-between text-[13px] text-[#C7C5E8] py-2"><span>{t.sum_cycle}</span><b className="text-white">{cycle==='monthly'?t.cycle_monthly:t.cycle_annual}</b></div><div className="flex justify-between text-[13px] text-[#C7C5E8] py-2"><span>{t.sum_currency}</span><b className="text-white">{SYMS[currency]}</b></div><div className="flex justify-between text-[13px] text-[#C7C5E8] py-2"><span>{t.sum_payment}</span><b className="text-white">{paymentLabel(payment)}</b></div><div className="flex justify-between items-baseline mt-3.5 pt-3.5 border-t border-white/15"><span>{t.sum_total}</span><span className="font-mono text-2xl font-bold text-[#17C8A6]">{total}</span></div><div className="mt-4 bg-[#17C8A6]/10 border border-[#17C8A6]/30 rounded-[10px] px-3 py-2.5 text-xs text-[#9EF3DE]">{selectedPlan==='free'?t.trial_note_free:t.trial_note}</div></aside>
      </div></main><footer className="bg-[#101124] text-[#8683B8] py-[26px] text-center text-xs">© 2026 SDS-RH. Tous droits réservés. Paiements sécurisés et chiffrés.</footer>
  </div>;
};
export default Register;
