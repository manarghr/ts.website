"use client";

import { useParams } from "next/navigation";
import ProgramDetail from '@/components/Programs/ProgramDetail';

export default function ProgramPage() {
  const params = useParams();
  const programId = params.id;

  return <ProgramDetail programId={programId} />;
}

