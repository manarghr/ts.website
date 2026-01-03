"use client";

import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import MealPost from "@/components/meal/MealPost";


export default function MealPostPage() {
  const params = useParams();
  const postId = params.id;

  return (
    <MainLayout>
      <MealPost postId={postId} />
    </MainLayout>
  );
}