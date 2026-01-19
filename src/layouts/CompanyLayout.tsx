import { Outlet } from "react-router-dom";
import CompanyHeader from "../features-company/components/CompanyHeader";
import CompanyFooter from "../features-company/components/CompanyFooter";

export default function CompanyLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />
      <Outlet />
      <CompanyFooter />
    </div>
  );
}
