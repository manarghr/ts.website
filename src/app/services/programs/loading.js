// Shown while the program list loads.
// File: src/app/services/programs/loading.js

import LoadingScreen from "@/components/layout/LoadingScreen";

export default function Loading() {
  return <LoadingScreen label="Loading programs" cards={6} />;
}
