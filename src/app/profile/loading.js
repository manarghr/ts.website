// Shown while your profile loads.
// File: src/app/profile/loading.js

import LoadingScreen from "@/components/layout/LoadingScreen";

export default function Loading() {
  return <LoadingScreen label="Loading your profile" cards={3} />;
}
