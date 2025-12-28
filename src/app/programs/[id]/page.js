"use client";

import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import ProgramDetail from '@/components/Programs/ProgramDetail';

export default function ProgramPage() {
  const params = useParams();
  const programId = params.id;

  return (
    <MainLayout>
      <ProgramDetail programId={programId} />
    </MainLayout>
  );
}

