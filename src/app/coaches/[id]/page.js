"use client";

import { useParams } from "next/navigation";
import CoachProfile from "@/components/coaches/CoachProfile";

export default function CoachProfilePage() {
  const params = useParams();
  const coachId = params.id;

  return <CoachProfile coachId={coachId} />;
}

