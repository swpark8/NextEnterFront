import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
