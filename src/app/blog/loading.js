// Shown while the article list loads.
// File: src/app/blog/loading.js

import LoadingScreen from "@/components/layout/LoadingScreen";

export default function Loading() {
  return <LoadingScreen label="Loading articles" cards={6} />;
}
