"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BlogHero from "@/components/blog/BlogHero";
import BlogFilters from "@/components/blog/BlogFilters";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <MainLayout>
      <BlogHero />
      <BlogFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      {/* Add your blog content/cards here */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-gray-600">
          Blog content will go here. Search: "{searchTerm}" | Category: "{selectedCategory}"
        </p>
      </div>
    </MainLayout>
  );
}