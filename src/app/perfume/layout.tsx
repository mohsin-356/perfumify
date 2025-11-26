export default function PerfumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal layout: you can add a simple header/footer here later */}
      {children}
    </div>
  );
}
