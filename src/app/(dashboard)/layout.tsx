import { Sidebar } from "@/components/Sidebar";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Suspense fallback={<div className="w-72 bg-white h-screen border-r border-gray-200" />}>
        <Sidebar />
      </Suspense>
      <div className="flex-1 lg:pl-72 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
