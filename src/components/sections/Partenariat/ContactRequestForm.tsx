'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';

type FormData = {
  companyName: string;
  legalStatus: string;
  rccm: string;
  nif: string;
  activityDomain: string;
  headquartersAddress: string;
  phone: string;
  email: string;
  paymentDay: string;
  siteWeb?: string;
  logoUrl?: string;
  agreement: boolean;
};

export function ContactRequestForm() {
  const [form, setForm] = useState<FormData>({
    companyName: '',
    legalStatus: '',
    rccm: '',
    nif: '',
    activityDomain: '',
    headquartersAddress: '',
    phone: '+224',
    email: '',
    paymentDay: '1',
    siteWeb: '',
    logoUrl: '',
    agreement: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target as HTMLInputElement;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((p) => ({ ...p, [name]: value }));
    if (process.env.NODE_ENV !== 'production') {
      console.log('📝 Field change:', name, '=>', value);
    }
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const onBlur = (name: keyof FormData) => {
    setTouched((p) => ({ ...p, [name]: true }));
    validateField(name, (form as any)[name]);
  };

  const validateField = (name: keyof FormData, value: any) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'companyName': if (!String(value).trim()) newErrors[name] = "Nom d'entreprise requis"; break;
      case 'legalStatus': if (!value) newErrors[name] = 'Statut juridique requis'; break;
      case 'rccm': if (!String(value).trim()) newErrors[name] = 'RCCM requis'; break;
      case 'nif': if (!String(value).trim()) newErrors[name] = 'NIF requis'; break;
      case 'activityDomain': if (!value) newErrors[name] = "Domaine d'activité requis"; break;
      case 'headquartersAddress': if (!String(value).trim()) newErrors[name] = 'Adresse du siège requise'; break;
      case 'phone': if (!String(value).trim() || String(value).length < 8) newErrors[name] = 'Téléphone invalide'; break;
      case 'email': if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) newErrors[name] = 'Email invalide'; break;
      case 'agreement': if (!value) newErrors[name] = 'Vous devez accepter les conditions'; break;
    }
    setErrors(newErrors);
  };

  const validateAll = () => {
    (Object.keys(form) as (keyof FormData)[]).forEach((k) => validateField(k, (form as any)[k]));
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setTouched(Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {} as Record<string, boolean>));

    // Recompute errors immediately before submit
    const nextErrors: Record<string, string> = {};
    const fieldsToCheck: (keyof FormData)[] = ['companyName','legalStatus','rccm','nif','activityDomain','headquartersAddress','phone','email','paymentDay','agreement'];
    for (const k of fieldsToCheck) {
      switch (k) {
        case 'companyName': if (!form.companyName.trim()) nextErrors[k] = "Nom d'entreprise requis"; break;
        case 'legalStatus': if (!form.legalStatus) nextErrors[k] = 'Statut juridique requis'; break;
        case 'rccm': if (!form.rccm.trim()) nextErrors[k] = 'RCCM requis'; break;
        case 'nif': if (!form.nif.trim()) nextErrors[k] = 'NIF requis'; break;
        case 'activityDomain': if (!form.activityDomain) nextErrors[k] = "Domaine d'activité requis"; break;
        case 'headquartersAddress': if (!form.headquartersAddress.trim()) nextErrors[k] = 'Adresse du siège requise'; break;
        case 'phone': if (!form.phone.trim() || form.phone.length < 8) nextErrors[k] = 'Téléphone invalide'; break;
        case 'email': if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors[k] = 'Email invalide'; break;
        case 'paymentDay': if (!form.paymentDay) nextErrors[k] = 'Jour de paiement requis'; break;
        case 'agreement': if (!form.agreement) nextErrors[k] = 'Vous devez accepter les conditions'; break;
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = { ...form, agreement: true };
      if (process.env.NODE_ENV !== 'production') {
        console.log('📤 Submitting contact request payload:', payload);
      }
      const res = await fetch('http://localhost:3001/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      if (process.env.NODE_ENV !== 'production') {
        console.log('📥 Response status:', res.status);
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        if (process.env.NODE_ENV !== 'production') {
          console.log('❌ Error response body:', d);
        }
        throw new Error(d.message || `Erreur ${res.status}`);
      }
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Contact request sent successfully');
      }
      setSuccess(true);
      setForm({
        companyName: '', legalStatus: '', rccm: '', nif: '', activityDomain: '', headquartersAddress: '',
        phone: '+224', email: '', paymentDay: '1', siteWeb: '', logoUrl: '', agreement: false,
      });
    } catch (e: any) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('🧨 Submit error:', e);
      }
      setSubmitError(e.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-green-500/30 p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Demande envoyée avec succès !</h2>
          <p className="text-gray-300 mb-6">Merci pour votre intérêt. Nous vous répondrons sous peu.</p>
          <Button onClick={() => setSuccess(false)} className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">Nouvelle demande</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-blue-900/30">
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Devenez Partenaire</h2>
          <p className="text-gray-300">Remplissez le formulaire ci-dessous pour soumettre votre demande de partenariat.</p>
        </div>
        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Nom de l'entreprise" required>
              <Input name="companyName" value={form.companyName} onChange={onChange} onBlur={() => onBlur('companyName')} placeholder="Ex: Mon Entreprise SARL" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
              <FieldError name="companyName" touched={touched} errors={errors} />
            </Field>
            <Field label="Statut juridique" required>
              <select name="legalStatus" value={form.legalStatus} onChange={onChange} onBlur={() => onBlur('legalStatus')} className="bg-blue-950/30 border text-white h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all w-full">
                <option value="" className="bg-blue-950">Sélectionnez un statut</option>
                {['SARL','SA','SUARL','GIE','Association','Autre'].map(s => <option key={s} value={s} className="bg-blue-950">{s}</option>)}
              </select>
              <FieldError name="legalStatus" touched={touched} errors={errors} />
            </Field>
            <Field label="N° RCCM" required>
              <Input name="rccm" value={form.rccm} onChange={onChange} onBlur={() => onBlur('rccm')} placeholder="RG-2024-A-12345" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
              <FieldError name="rccm" touched={touched} errors={errors} />
            </Field>
            <Field label="NIF" required>
              <Input name="nif" value={form.nif} onChange={onChange} onBlur={() => onBlur('nif')} placeholder="NIF-2024-12345" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
              <FieldError name="nif" touched={touched} errors={errors} />
            </Field>
            <Field label="Domaine d'activité" required>
              <select name="activityDomain" value={form.activityDomain} onChange={onChange} onBlur={() => onBlur('activityDomain')} className="bg-blue-950/30 border text-white h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all w-full">
                <option value="" className="bg-blue-950">Sélectionnez un domaine</option>
                {['Commerce de détail','Services','Industrie','Informatique et Technologie','Santé','Éducation','Finance','Autre'].map(d => <option key={d} value={d} className="bg-blue-950">{d}</option>)}
              </select>
              <FieldError name="activityDomain" touched={touched} errors={errors} />
            </Field>
            <Field label="Adresse du siège" required className="md:col-span-2">
              <Input name="headquartersAddress" value={form.headquartersAddress} onChange={onChange} onBlur={() => onBlur('headquartersAddress')} placeholder="Rue, Commune, Ville" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
              <FieldError name="headquartersAddress" touched={touched} errors={errors} />
            </Field>
            <Field label="Téléphone" required>
              <Input name="phone" value={form.phone} onChange={onChange} onBlur={() => onBlur('phone')} placeholder="+224 XXX XXX XXX" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
              <FieldError name="phone" touched={touched} errors={errors} />
            </Field>
            <Field label="Email" required>
              <Input name="email" type="email" value={form.email} onChange={onChange} onBlur={() => onBlur('email')} placeholder="contact@entreprise.com" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
              <FieldError name="email" touched={touched} errors={errors} />
            </Field>
            <Field label="Site web (optionnel)" className="md:col-span-2">
              <Input name="siteWeb" type="url" value={form.siteWeb} onChange={onChange} placeholder="https://www.entreprise.com" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
            </Field>
            <Field label="Jour de paiement préféré" className="md:col-span-2">
              <select name="paymentDay" value={form.paymentDay} onChange={onChange} className="bg-blue-950/30 border text-white h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all w-full">
                {Array.from({ length: 25 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={String(day)} className="bg-blue-950">{day}{day===1?'er':''} du mois</option>
                ))}
              </select>
            </Field>
            <div className="md:col-span-2">
              <label className="inline-flex items-start gap-2 text-sm">
                <input type="checkbox" name="agreement" checked={form.agreement} onChange={onChange} onBlur={() => onBlur('agreement')} className="mt-1" />
                <span>Je certifie que les informations fournies sont exactes et j'accepte les conditions d'utilisation <span className="text-red-400">*</span></span>
              </label>
              {touched.agreement && errors.agreement && <p className="mt-1 text-sm text-red-400">{errors.agreement}</p>}
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 gap-3">
            <Button type="button" variant="outline" disabled={loading} onClick={() => {
              const sample = {
                companyName: 'Entreprise Test SARL',
                legalStatus: 'SARL',
                rccm: 'RC/2024/001',
                nif: 'NIF2024001',
                activityDomain: 'Informatique et Technologie',
                headquartersAddress: '123 Avenue de la République, Conakry, Guinée',
                phone: '+224612345678',
                email: 'contact@entreprisetest.gn',
                paymentDay: '25',
                siteWeb: 'https://www.entreprisetest.gn',
                logoUrl: '',
                agreement: true,
              } as const;
              if (process.env.NODE_ENV !== 'production') {
                console.log('⚙️ Prefilling form with sample data:', sample);
              }
              setForm({ ...form, ...sample });
              setTouched({});
              setErrors({});
            }} className="border-blue-700/70 text-blue-200 hover:bg-blue-950/30">
              Préremplir (test)
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
              {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, required, className }: { label: string; children: React.ReactNode; required?: boolean; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-blue-100/90 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function FieldError({ name, touched, errors }: { name: string; touched: Record<string, boolean>; errors: Record<string, string> }) {
  if (!touched[name] || !errors[name]) return null;
  return (
    <div className="mt-1 text-sm text-red-400 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {errors[name]}
    </div>
  );
}
