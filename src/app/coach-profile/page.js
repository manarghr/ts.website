"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoachProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Coach profile has been merged into the coach dashboard page
    router.replace("/coach/dashboard");
  }, [router]);

  return null;
}


