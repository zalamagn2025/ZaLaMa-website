import { BackgroundEffects } from '@/components/ui/background-effects';
import { PartnershipForm } from '@/components/sections/Partenariat/PartnershipForm';

export default function FormulairePage() {
  return (
    <div className="relative flex flex-col min-h-screen text-[var(--zalama-text)]">
      <BackgroundEffects />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <PartnershipForm />
      </main>
      
    </div>
  );
}