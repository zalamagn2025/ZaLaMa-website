"use client";

import { useState } from "react";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

type RecommendationForm = {
  recommenderName: string;
  recommenderEmail: string;
  recommenderPhone: string;
  companyName: string;
  companyContactName: string;
  companyEmail: string;
  companyPhone: string;
  activityDomain: string;
  address: string;
  message: string;
};

export default function RecommendationsPage() {
  const [form, setForm] = useState<RecommendationForm>({
    recommenderName: "",
    recommenderEmail: "",
    recommenderPhone: "+224",
    companyName: "",
    companyContactName: "",
    companyEmail: "",
    companyPhone: "+224",
    activityDomain: "",
    address: "",
    message: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target as HTMLInputElement;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((p) => ({ ...p, [name]: value }));
    if (process.env.NODE_ENV !== "production") {
      console.log("📝 Field change:", name, "=>", value);
    }
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const onBlur = (name: keyof RecommendationForm) => {
    setTouched((p) => ({ ...p, [name]: true }));
    validateField(name, (form as any)[name]);
  };

  const validateField = (name: keyof RecommendationForm, value: any) => {
    const newErrors = { ...errors };
    switch (name) {
      case "recommenderName": if (!String(value).trim()) newErrors[name] = "Votre nom est requis"; break;
      case "recommenderEmail": if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) newErrors[name] = "Email invalide"; break;
      case "companyName": if (!String(value).trim()) newErrors[name] = "Nom de l'entreprise requis"; break;
      case "companyEmail": if (String(value).trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) newErrors[name] = "Email entreprise invalide"; break;
      case "recommenderPhone": if (!String(value).trim() || String(value).length < 8) newErrors[name] = "Téléphone invalide"; break;
      case "companyPhone": if (String(value).trim() && String(value).length < 8) newErrors[name] = "Téléphone entreprise invalide"; break;
    }
    setErrors(newErrors);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const fieldsToCheck: (keyof RecommendationForm)[] = [
      "recommenderName","recommenderEmail","recommenderPhone","companyName","companyEmail","companyPhone","activityDomain","address","message"
    ];
    const nextErrors: Record<string, string> = {};
    for (const k of fieldsToCheck) {
      switch (k) {
        case "recommenderName": if (!form.recommenderName.trim()) nextErrors[k] = "Votre nom est requis"; break;
        case "recommenderEmail": if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recommenderEmail)) nextErrors[k] = "Email invalide"; break;
        case "recommenderPhone": if (!form.recommenderPhone.trim() || form.recommenderPhone.length < 8) nextErrors[k] = "Téléphone invalide"; break;
        case "companyName": if (!form.companyName.trim()) nextErrors[k] = "Nom de l'entreprise requis"; break;
        case "companyEmail": if (form.companyEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.companyEmail)) nextErrors[k] = "Email entreprise invalide"; break;
        case "companyPhone": if (form.companyPhone.trim() && form.companyPhone.length < 8) nextErrors[k] = "Téléphone entreprise invalide"; break;
      }
    }
    setErrors(nextErrors);
    setTouched(fieldsToCheck.reduce((acc, k) => ({ ...acc, [k]: true }), {} as Record<string, boolean>));
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
            const [firstNameRaw, lastNameRaw] = (form.recommenderName || "")
        .trim()
        .split(/\s+(.+)?/)
        .filter(Boolean);

      const payload = {
        firstName: firstNameRaw || form.recommenderName || "",
        lastName: lastNameRaw || "",
        jobTitle: "N/A",
        phoneNumber: form.recommenderPhone,
        workEmail: form.recommenderEmail,
        companyName: form.companyName,
        employeeCount: 100,
        hrManagerName: form.companyContactName || "N/A",
        hrManagerEmail: form.companyEmail,
        consent: true,
      };
      if (process.env.NODE_ENV !== "production") {
        console.log("📤 Submitting recommendation payload:", payload);
      }
      const res = await fetch("http://localhost:3001/public/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (process.env.NODE_ENV !== "production") {
        console.log("📥 Response status:", res.status);
      }
            const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = Array.isArray(data?.message)
          ? data.message.join(", ")
          : (data?.message || `Erreur ${res.status}`);
        if (process.env.NODE_ENV !== "production") {
          console.log("❌ Error response body:", data);
        }
        throw new Error(msg);
      }
      if (process.env.NODE_ENV !== "production") {
        console.log("✅ Recommendation submitted successfully:", data);
      }
      setSuccess(true);
      setForm({
        recommenderName: "",
        recommenderEmail: "",
        recommenderPhone: "+224",
        companyName: "",
        companyContactName: "",
        companyEmail: "",
        companyPhone: "+224",
        activityDomain: "",
        address: "",
        message: "",
      });
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") {
        console.log("🧨 Submit error:", e);
      }
      setSubmitError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative flex flex-col min-h-screen text-[var(--zalama-text)]">
        <BackgroundEffects />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-green-500/30 p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Merci pour votre recommandation !</h2>
              <p className="text-gray-300 mb-6">Nous avons bien reçu vos informations et nous contacterons l'entreprise recommandée.</p>
              <Button onClick={() => setSuccess(false)} className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">Nouvelle recommandation</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen text-[var(--zalama-text)]">
      <BackgroundEffects />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-blue-900/30">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Recommander une entreprise</h2>
              <p className="text-gray-300">Partagez les coordonnées d'une entreprise que nous devrions contacter.</p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Votre nom" required>
                  <Input name="recommenderName" value={form.recommenderName} onChange={onChange} onBlur={() => onBlur("recommenderName")} placeholder="Ex: Mamadou DIALLO" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
                  <FieldError name="recommenderName" touched={touched} errors={errors} />
                </Field>
                <Field label="Votre email" required>
                  <Input name="recommenderEmail" type="email" value={form.recommenderEmail} onChange={onChange} onBlur={() => onBlur("recommenderEmail")} placeholder="vous@exemple.com" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
                  <FieldError name="recommenderEmail" touched={touched} errors={errors} />
                </Field>
                <Field label="Votre téléphone" required>
                  <Input name="recommenderPhone" value={form.recommenderPhone} onChange={onChange} onBlur={() => onBlur("recommenderPhone")} placeholder="+224 6XX XX XX XX" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
                  <FieldError name="recommenderPhone" touched={touched} errors={errors} />
                </Field>
                <Field label="Nom de l'entreprise" required>
                  <Input name="companyName" value={form.companyName} onChange={onChange} onBlur={() => onBlur("companyName")} placeholder="Ex: Entreprise XYZ" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
                  <FieldError name="companyName" touched={touched} errors={errors} />
                </Field>
                <Field label="Contact dans l'entreprise">
                  <Input name="companyContactName" value={form.companyContactName} onChange={onChange} placeholder="Nom du contact (optionnel)" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
                </Field>
                <Field label="Email de l'entreprise">
                  <Input name="companyEmail" type="email" value={form.companyEmail} onChange={onChange} onBlur={() => onBlur("companyEmail")} placeholder="contact@entreprise.com" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
                  <FieldError name="companyEmail" touched={touched} errors={errors} />
                </Field>
                <Field label="Téléphone de l'entreprise">
                  <Input name="companyPhone" value={form.companyPhone} onChange={onChange} onBlur={() => onBlur("companyPhone")} placeholder="+224 6XX XX XX XX" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
                  <FieldError name="companyPhone" touched={touched} errors={errors} />
                </Field>
                <Field label="Domaine d'activité">
                  <Input name="activityDomain" value={form.activityDomain} onChange={onChange} placeholder="Ex: Informatique et Technologie" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
                </Field>
                <Field label="Adresse complète" className="md:col-span-2">
                  <Input name="address" value={form.address} onChange={onChange} placeholder="Rue, Commune, Ville" className="bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all" />
                </Field>
                <Field label="Message" className="md:col-span-2">
                  <textarea name="message" value={form.message} onChange={onChange} placeholder="Pourquoi recommandez-vous cette entreprise ?" className="min-h-[100px] bg-blue-950/30 border text-white placeholder:text-gray-300/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 py-3 transition-all w-full"></textarea>
                </Field>
              </div>

              <div className="flex justify-between items-center pt-4 gap-3">
                <Button type="button" variant="outline" disabled={loading} onClick={() => {
                  const sample = {
                    recommenderName: "Aissatou BAH",
                    recommenderEmail: "aissatou.bah@example.com",
                    recommenderPhone: "+224621234567",
                    companyName: "Entreprise Test SARL",
                    companyContactName: "Mamadou Diallo",
                    companyEmail: "contact@entreprisetest.gn",
                    companyPhone: "+224621111111",
                    activityDomain: "Informatique et Technologie",
                    address: "123 Avenue de la République, Conakry",
                    message: "Solide entreprise avec une équipe RH réactive",
                  } as const;
                  if (process.env.NODE_ENV !== "production") {
                    console.log("⚙️ Prefilling recommendation form:", sample);
                  }
                  setForm({ ...form, ...sample });
                  setTouched({});
                  setErrors({});
                }} className="border-blue-700/70 text-blue-200 hover:bg-blue-950/30">
                  Préremplir (test)
                </Button>
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                  {loading ? "Envoi en cours..." : "Soumettre la recommandation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
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
