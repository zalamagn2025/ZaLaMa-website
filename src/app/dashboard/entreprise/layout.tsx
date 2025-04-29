import '@/styles/zalama-theme.css';

export default function EntrepriseDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen sidebar">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
