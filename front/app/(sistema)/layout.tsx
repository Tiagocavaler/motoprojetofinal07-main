import SistemaHeader from "./components/SistemaHeader";

export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B1325] text-white">
      <SistemaHeader />
      <main>{children}</main>
    </div>
  );
}