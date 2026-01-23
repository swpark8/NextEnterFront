import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getCompanyProfile,
  updateCompanyProfile,
  changeCompanyPassword,
} from "../../api/company";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import CompanyProfile from "./components/CompanyProfile";
import AccountSecurity from "./components/AccountSecurity";
import PaymentCredits from "./components/PaymentCredits";
import NotificationSettings from "./components/NotificationSettings";

interface CompanyMyPageProps {
  initialMenu?: string;
}

export default function CompanyMyPage({
  initialMenu = "companyMy-sub-1",
}: CompanyMyPageProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // 1. 네비게이션 훅 사용
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "companyMy",
    initialMenu,
  );

  // 2. [수정완료] 크레딧 및 히스토리 정보 (setCurrentCredit 경고 해결을 위해 사용하지 않는 변수 제거)
  const [currentCredit] = useState<number>(0);
  const [creditHistory] = useState([
    {
      id: 1,
      date: "2025.01.20 14:30",
      type: "충전",
      content: "크레딧 충전",
      amount: "+1000",
    },
    {
      id: 2,
      date: "2025.01.19 10:15",
      type: "사용",
      content: "공고 등록 차감",
      amount: "-100",
    },
    {
      id: 3,
      date: "2025.01.18 16:45",
      type: "사용",
      content: "인재 검색 차감",
      amount: "-50",
    },
    {
      id: 4,
      date: "2025.01.17 09:20",
      type: "충전",
      content: "크레딧 충전",
      amount: "+500",
    },
    {
      id: 5,
      date: "2025.01.16 11:30",
      type: "사용",
      content: "공고 등록 차감",
      amount: "-100",
    },
  ]);

  // 3. 로딩/에러 상태
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 4. 기업 정보 상태
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [companySize, setCompanySize] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [ceoName, setCeoName] = useState<string>("");
  const [shortIntro, setShortIntro] = useState<string>("");
  const [snsUrl, setSnsUrl] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [managerDepartment, setManagerDepartment] = useState<string>("");

  // 5. 계정 및 보안 상태
  const [managerName, setManagerName] = useState<string>("");
  const [managerPhone, setManagerPhone] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // 초기 데이터 로드
  useEffect(() => {
    const loadCompanyProfile = async () => {
      if (!user?.companyId) return;
      setLoading(true);
      setError(null);
      try {
        const profile = await getCompanyProfile(user.companyId);
        setCompanyLogo(profile.logoUrl || "");
        setCompanyName(profile.companyName || "");
        setBusinessNumber(profile.businessNumber || "");
        setDescription(profile.description || "");
        setWebsite(profile.website || "");
        setIndustry(profile.industry || "");
        setCompanySize(profile.companySize || "");
        setAddress(profile.address || "");
        setEmployeeCount(profile.employeeCount || 0);
        setManagerName(profile.managerName || "");
        setManagerPhone(profile.managerPhone || "");
        setCeoName(profile.ceoName || "");
        setShortIntro(profile.shortIntro || "");
        setSnsUrl(profile.snsUrl || "");
        setDetailAddress(profile.detailAddress || "");
        setManagerDepartment(profile.managerDepartment || "");
      } catch (err: any) {
        console.error("기업 프로필 로드 오류:", err);
        setError("기업 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadCompanyProfile();
  }, [user?.companyId]);

  // 기업 정보 저장
  const handleSaveCompanyProfile = async () => {
    if (!user?.companyId) return;
    setLoading(true);
    try {
      let calculatedEmployeeCount = employeeCount;
      if (companySize) {
        if (companySize === "1-10명") calculatedEmployeeCount = 10;
        else if (companySize === "11-50명") calculatedEmployeeCount = 50;
        else if (companySize === "51-200명") calculatedEmployeeCount = 200;
        else if (companySize === "201-500명") calculatedEmployeeCount = 500;
        else if (companySize === "501-1000명") calculatedEmployeeCount = 1000;
        else if (companySize === "1000명 이상") calculatedEmployeeCount = 1001;
      }
      await updateCompanyProfile(user.companyId, {
        logoUrl: companyLogo,
        description,
        website,
        industry,
        employeeCount: calculatedEmployeeCount,
        address,
        managerName,
        managerPhone,
        ceoName,
        shortIntro,
        snsUrl,
        detailAddress,
        managerDepartment,
      });
      alert("기업 정보가 저장되었습니다.");
    } catch (err: any) {
      alert("기업 정보 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 변경
  const onChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("비밀번호 변경의 모든 칸을 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!user?.companyId) return;
    setLoading(true);
    try {
      await changeCompanyPassword(user.companyId, currentPassword, newPassword);
      alert("비밀번호가 변경되었습니다.\n보안을 위해 다시 로그인 해주세요.");
      logout();
      navigate("/company/login");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !companyName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold">기업 마이페이지</h1>
        <div className="flex gap-6">
          <CompanyLeftSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />
          <main className="flex-1">
            <div className="p-8 bg-white border-2 border-purple-500 rounded-lg">
              {activeMenu === "companyMy-sub-1" && (
                <CompanyProfile
                  loading={loading}
                  companyLogo={companyLogo}
                  setCompanyLogo={setCompanyLogo}
                  companyName={companyName}
                  ceoName={ceoName}
                  setCeoName={setCeoName}
                  businessNumber={businessNumber}
                  description={description}
                  setDescription={setDescription}
                  shortIntro={shortIntro}
                  setShortIntro={setShortIntro}
                  website={website}
                  setWebsite={setWebsite}
                  snsUrl={snsUrl}
                  setSnsUrl={setSnsUrl}
                  industry={industry}
                  setIndustry={setIndustry}
                  companySize={companySize}
                  setCompanySize={setCompanySize}
                  address={address}
                  detailAddress={detailAddress}
                  setDetailAddress={setDetailAddress}
                  onSave={handleSaveCompanyProfile}
                />
              )}
              {activeMenu === "companyMy-sub-2" && (
                <AccountSecurity
                  email={user?.email || ""}
                  managerName={managerName}
                  setManagerName={setManagerName}
                  managerPhone={managerPhone}
                  setManagerPhone={setManagerPhone}
                  managerDepartment={managerDepartment}
                  setManagerDepartment={setManagerDepartment}
                  currentPassword={currentPassword}
                  setCurrentPassword={setCurrentPassword}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  onChangePassword={onChangePassword}
                />
              )}
              {activeMenu === "companyMy-sub-3" && (
                <PaymentCredits
                  currentCredit={currentCredit}
                  creditHistory={creditHistory}
                />
              )}
              {activeMenu === "companyMy-sub-4" && user?.companyId && (
                <NotificationSettings
                  companyId={user.companyId}
                  onSave={() => console.log('알림 설정 저장 완료')}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
