"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="bg-gray-700 hover:bg-gray-600 text-gray-50 text-sm rounded-lg px-4 py-2 cursor-pointer transition-colors"
    >
      Logout
    </button>
  );
}
