import Navbar from "@/components/navBar/NavBar";

export default function ProfileLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-[60px]">{children}</main>
    </>
  );
}

