"use client";

import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import CoachProfile from "@/components/coaches/CoachProfile";

export default function CoachProfilePage() {
  const params = useParams();
  const coachId = params.id;

  return (
    <MainLayout>
      <CoachProfile coachId={coachId} />
    </MainLayout>
  );
}

