import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <AdminHeader />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
