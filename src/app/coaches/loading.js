// Shown while the coach directory loads.
// File: src/app/coaches/loading.js

import LoadingScreen from "@/components/layout/LoadingScreen";

export default function Loading() {
  return <LoadingScreen label="Finding coaches" cards={6} />;
}
