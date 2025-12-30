"use client";

import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import BlogPost from "@/components/blog/BlogPost";


export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id;

  return (
    <MainLayout>
      <BlogPost postId={postId} />
    </MainLayout>
  );
}
