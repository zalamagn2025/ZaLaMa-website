import { Header } from "@/components/layout/Header";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center">
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Connexion à votre compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Entrez vos identifiants fournis par l'administrateur
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
} 