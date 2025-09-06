import { Metadata } from "next";
import DeleteAccountForm from "@/components/auth/DeleteAccountForm";

export const metadata: Metadata = {
  title: "Supprimer mon compte - ZaLaMa",
  description: "Supprimez définitivement votre compte ZaLaMa. Cette action est irréversible.",
  robots: "noindex, nofollow", // Empêcher l'indexation de cette page sensible
};

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Effets de fond */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF671E]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <DeleteAccountForm />
      </div>
    </div>
  );
}
