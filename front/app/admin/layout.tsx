import SistemaHeader from "../(sistema)/components/SistemaHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B1325] text-white">
      <SistemaHeader />
      <main>{children}</main>
    </div>
  );
}