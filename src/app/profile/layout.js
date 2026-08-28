import Navbar from "@/components/navbar/NavBar";

export default function ProfileLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-h)]">{children}</main>
    </>
  );
}

