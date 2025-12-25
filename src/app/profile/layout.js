export default function ProfileLayout({ children }) {
  return (
    <>
      {/* No navbar or footer on profile page - just render children */}
      {children}
    </>
  );
}

