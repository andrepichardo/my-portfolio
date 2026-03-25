import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata = {
  title: "Admin Panel | André Pichardo",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827]">
      {/* Admin Header */}
      <header className="bg-white dark:bg-[#1f2937] shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[#5651e5] font-bold text-lg tracking-tight hover:text-[#726ee7] transition-colors"
            >
              André.dev
            </Link>
            <span className="text-gray-400 dark:text-gray-500 text-sm hidden sm:block">
              /
            </span>
            <Link
              href="/admin"
              className="text-gray-600 dark:text-gray-300 text-sm font-medium hidden sm:block hover:text-[#5651e5] transition-colors"
            >
              Admin Panel
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 dark:text-gray-400 text-xs hidden md:block">
              {session.user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-5 py-8">{children}</main>
    </div>
  );
}
