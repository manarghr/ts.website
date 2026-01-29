import Navbar from "@/components/navbar/NavBar";

export default function ProfileLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-[60px]">{children}</main>
    </>
  );
}

