"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Login page removed — system is now in public access mode.
// All visitors are auto-redirected to the dashboard.
export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
