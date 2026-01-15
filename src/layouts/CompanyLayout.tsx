import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

export default function CompanyLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
      <Footer />
    </div>
  );
}
