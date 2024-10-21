import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className={`bg-black h-[100vh]`}>
      <Navbar />
      <div className="overflow-auto">{children}</div>
    </div>
  );
}
