import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import {
  getApplies,
  updateApplyStatus,
  type ApplyListResponse,
} from "../api/apply";

export default function ApplicantManagementPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [selectedJobPosting, setSelectedJobPosting] = useState("전체");
  const [selectedJobCategory, setSelectedJobCategory] = useState("전체");
  const [experienceRange, setExperienceRange] = useState("전체");

  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<ApplyListResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 지원자 목록 로드
  useEffect(() => {
    const loadApplicants = async () => {
      if (!user?.companyId) {
        alert("기업 정보를 찾을 수 없습니다.");
        navigate("/company/login");
        return;
      }

      try {
        setLoading(true);

        const params: any = {
          page: currentPage,
          size: 20,
        };

        const response = await getApplies(user.companyId, params);
        setApplicants(response.content);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        console.error("지원자 목록 조회 실패:", error);
        alert(error.response?.data?.message || "지원자 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, [currentPage, user, navigate]);

  const handleApplicantClick = (applyId: number) => {
    navigate(`/company/applicants/${applyId}`);
  };

  const handleAccept = async (applyId: number) => {
    if (!user?.companyId) return;

    if (window.confirm("이 지원자를 합격 처리하시겠습니까?")) {
      try {
        await updateApplyStatus(applyId, user.companyId, {
          status: "ACCEPTED",
        });
        alert("합격 처리되었습니다.");

        // 목록 새로고침
        const response = await getApplies(user.companyId, {
          page: currentPage,
          size: 20,
        });
        setApplicants(response.content);
      } catch (error: any) {
        console.error("상태 변경 실패:", error);
        alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
      }
    }
  };

  const handleReject = async (applyId: number) => {
    if (!user?.companyId) return;

    if (window.confirm("이 지원자를 불합격 처리하시겠습니까?")) {
      try {
        await updateApplyStatus(applyId, user.companyId, {
          status: "REJECTED",
        });
        alert("불합격 처리되었습니다.");

        // 목록 새로고침
        const response = await getApplies(user.companyId, {
          page: currentPage,
          size: 20,
        });
        setApplicants(response.content);
      } catch (error: any) {
        console.error("상태 변경 실패:", error);
        alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
      }
    }
  };

  const handleLogoClick = () => {
    navigate("/company");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REVIEWING":
        return "bg-blue-100 text-blue-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "REVIEWING":
        return "검토중";
      case "ACCEPTED":
        return "합격";
      case "REJECTED":
        return "불합격";
      default:
        return status;
    }
  };

  // 클라이언트 측 필터링
  const filteredApplicants = applicants.filter((applicant) => {
    const categoryMatch =
      selectedJobCategory === "전체" ||
      applicant.jobCategory === selectedJobCategory;

    const expYears = parseInt(applicant.experience) || 0;
    const expMatch =
      experienceRange === "전체" ||
      (experienceRange === "신입" && expYears === 0) ||
      (experienceRange === "3년 이하" && expYears > 0 && expYears <= 3) ||
      (experienceRange === "3-5년" && expYears > 3 && expYears <= 5) ||
      (experienceRange === "5년 이상" && expYears > 5);

    return categoryMatch && expMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div
              onClick={handleLogoClick}
              className="transition-opacity cursor-pointer hover:opacity-80"
            >
              <span className="text-2xl font-bold text-blue-600">Next </span>
              <span className="text-2xl font-bold text-blue-800">Enter</span>
            </div>

            {/* 네비게이션 */}
            <nav className="flex space-x-8">
              <button
                onClick={() => navigate("/company/jobs")}
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                ■ 채용공고
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                자료
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                홍보
              </button>
            </nav>

            {/* 오른쪽 버튼 */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user?.userType === "company" ? (
                <>
                  <span className="text-gray-700 font-medium">
                    {user.companyName || user.name}님
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/company/login");
                    }}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/company/login")}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => navigate("/company/signup")}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    회원가입
                  </button>
                </>
              )}
              <button
                onClick={() => navigate("/user")}
                className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold">지원자 관리</h1>

        {/* 필터 섹션 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              공고
            </label>
            <select
              value={selectedJobPosting}
              onChange={(e) => setSelectedJobPosting(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              직무
            </label>
            <select
              value={selectedJobCategory}
              onChange={(e) => setSelectedJobCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="프론트엔드 개발자">프론트엔드 개발자</option>
              <option value="백엔드 개발자">백엔드 개발자</option>
              <option value="풀스택 개발자">풀스택 개발자</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              경력
            </label>
            <select
              value={experienceRange}
              onChange={(e) => setExperienceRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="신입">신입</option>
              <option value="3년 이하">3년 이하</option>
              <option value="3-5년">3-5년</option>
              <option value="5년 이상">5년 이상</option>
            </select>
          </div>
        </div>

        {/* 지원자 목록 */}
        <div className="space-y-4">
          {filteredApplicants.map((applicant) => (
            <div
              key={applicant.applyId}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                {/* 왼쪽: 지원자 정보 */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleApplicantClick(applicant.applyId)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold">{applicant.userName}</h3>
                    <span className="text-gray-600">({applicant.userAge}세)</span>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(
                        applicant.status
                      )}`}
                    >
                      {getStatusText(applicant.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">지원 공고:</span>
                      <span className="ml-2 font-medium">
                        {applicant.jobTitle}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">직무:</span>
                      <span className="ml-2 font-medium">
                        {applicant.jobCategory}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">경력:</span>
                      <span className="ml-2 font-medium">
                        {applicant.experience}
                      </span>
                    </div>
                  </div>

                  {/* 기술 스택 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {applicant.skills && applicant.skills.length > 0 ? (
                      applicant.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">등록된 기술 스택이 없습니다</span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    지원일: {new Date(applicant.appliedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* 오른쪽: 점수 및 버튼 */}
                <div className="flex flex-col items-center gap-4 ml-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {applicant.aiScore || 0}
                    </div>
                    <div className="text-sm text-gray-500">매칭 점수</div>
                  </div>

                  <div className="flex flex-col gap-2 w-32">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(applicant.applyId);
                      }}
                      disabled={applicant.status === "ACCEPTED" || applicant.status === "REJECTED"}
                      className={`px-4 py-2 font-semibold transition rounded-lg ${
                        applicant.status === "ACCEPTED"
                          ? "bg-green-600 text-white cursor-default shadow-lg"
                          : applicant.status === "REJECTED"
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      합격
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(applicant.applyId);
                      }}
                      disabled={applicant.status === "ACCEPTED" || applicant.status === "REJECTED"}
                      className={`px-4 py-2 font-semibold transition rounded-lg ${
                        applicant.status === "REJECTED"
                          ? "bg-red-600 text-white cursor-default shadow-lg"
                          : applicant.status === "ACCEPTED"
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      불합격
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredApplicants.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <div className="mb-4 text-4xl">📭</div>
            <div className="text-lg font-medium">지원자가 없습니다</div>
            <div className="text-sm">아직 지원한 사람이 없습니다</div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
