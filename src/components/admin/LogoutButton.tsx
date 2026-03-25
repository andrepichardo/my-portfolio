"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      style={{
        background: "none",
        backgroundImage: "none",
        backgroundColor: "#374151",
        boxShadow: "none",
        borderRadius: "8px",
        padding: "8px 16px",
        color: "#f9fafb",
        fontSize: "14px",
        textTransform: "none",
        cursor: "pointer",
      }}
      className="hover:bg-gray-600 transition-colors"
    >
      Logout
    </button>
  );
}
