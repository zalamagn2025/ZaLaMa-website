import { BackgroundEffects } from "@/components/ui/background-effects";
import EmployeeRegisterForm from "@/components/auth/EmployeeRegisterForm";
import { debug, info, warn, error } from '@/lib/logger';

export default function RegisterPage() {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <BackgroundEffects />
      <EmployeeRegisterForm />
    </div>
  );
}
