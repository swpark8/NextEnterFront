import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import { useApp } from "../../context/AppContext";
import type { InterviewOffer } from "../../context/AppContext";
import {
  getApplyDetail,
  updateApplyStatus,
  type ApplyDetailResponse,
} from "../../api/apply";

export default function ApplicantDetailPage() {
  const navigate = useNavigate();
  const { applicantId } = useParams();
  const { user } = useAuth();
  const { addInterviewOffer } = useApp();

  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<ApplyDetailResponse | null>(null);

  // 사이드바 훅 사용
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "applicants",
    "applicants-sub-1"
  );

  // 화면 맨 위로 올림
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 지원자 상세 정보 로드
  useEffect(() => {
    const loadApplicantDetail = async () => {
      if (!applicantId || !user?.companyId) {
        alert("잘못된 접근입니다.");
        navigate("/company/applicants");
        return;
      }

      try {
        setLoading(true);
        const data = await getApplyDetail(parseInt(applicantId), user.companyId);
        setApplicant(data);
      } catch (error: any) {
        console.error("지원자 상세 조회 실패:", error);
        alert(
          error.response?.data?.message ||
            "지원자 정보를 불러오는데 실패했습니다."
        );
        navigate("/company/applicants");
      } finally {
        setLoading(false);
      }
    };

    loadApplicantDetail();
  }, [applicantId, user, navigate]);

  const handleBackClick = () => {
    navigate("/company/applicants");
  };

  const handleCompatibilityClick = () => {
    navigate(`/company/applicants/${applicantId}/compatibility`);
  };

  const handleAccept = async () => {
    if (!applicant || !user?.companyId) return;

    if (window.confirm(`${applicant.userName}님을 합격 처리하시겠습니까?`)) {
      try {
        await updateApplyStatus(applicant.applyId, user.companyId, {
          status: "ACCEPTED",
        });
        alert("합격 처리되었습니다.");

        // 상태 업데이트
        const updatedData = await getApplyDetail(
          applicant.applyId,
          user.companyId
        );
        setApplicant(updatedData);
      } catch (error: any) {
        console.error("상태 변경 실패:", error);
        alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
      }
    }
  };

  const handleReject = async () => {
    if (!applicant || !user?.companyId) return;

    if (window.confirm(`${applicant.userName}님을 불합격 처리하시겠습니까?`)) {
      try {
        await updateApplyStatus(applicant.applyId, user.companyId, {
          status: "REJECTED",
        });
        alert("불합격 처리되었습니다.");

        // 상태 업데이트
        const updatedData = await getApplyDetail(
          applicant.applyId,
          user.companyId
        );
        setApplicant(updatedData);
      } catch (error: any) {
        console.error("상태 변경 실패:", error);
        alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
      }
    }
  };

  const handleInterviewRequest = () => {
    if (!applicant) return;

    if (window.confirm(`${applicant.userName}님에게 면접 요청을 하시겠습니까?`)) {
      const newInterviewOffer: InterviewOffer = {
        id: Date.now(),
        company: user?.companyName || "(주)등록기업",
        position: applicant.jobTitle,
        date: new Date().toISOString().split("T")[0],
        status: "면접 대기",
        content: `안녕하세요 ${applicant.userName}님, ${
          user?.companyName || "(주)등록기업"
        } 채용 담당자입니다.\n\n귀하의 이력서를 보고 큰 인상을 받아 면접 제안을 드립니다. 저희와 잘 맞을 분이라고 판단되며, 자세한 내용은 면접에서 말씀드리겠습니다.`,
        location: "서울특별시 강남구 테헤란로 123",
        jobId: applicant.jobId,
      };

      // AppContext에 면접 제안 추가
      addInterviewOffer(newInterviewOffer);

      alert(
        "면접 요청이 성공적으로 전송되었습니다.\n개인 회원은 '받은 제안' 페이지에서 확인할 수 있습니다."
      );
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">
          지원자 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-10 px-6 py-8 mx-auto max-w-screen-2xl">
        {/* 왼쪽 사이드바 */}
        <aside className="flex-shrink-0 hidden w-64 lg:block">
          <CompanyLeftSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 min-w-0">
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            {/* 상단: 뒤로가기 & 상태 */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <span>←</span>
                <span>목록으로 돌아가기</span>
              </button>
              <span
                className={`px-4 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(
                  applicant.status
                )}`}
              >
                {getStatusText(applicant.status)}
              </span>
            </div>

            {/* 지원자 프로필 & 종합 점수 */}
            <div className="flex items-start justify-between mb-8">
              {/* 왼쪽: 프로필 */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-purple-500 rounded-full">
                  {applicant.userName.charAt(0)}
                </div>
                <div>
                  <h1 className="mb-1 text-2xl font-bold text-gray-900">
                    {applicant.userName}
                  </h1>
                  <p className="flex items-center space-x-1 text-sm text-gray-500">
                    <span>📧</span>
                    <span>{applicant.userEmail || "이메일 미등록"}</span>
                  </p>
                  <p className="flex items-center space-x-1 text-sm text-gray-500">
                    <span>📱</span>
                    <span>{applicant.userPhone || "연락처 미등록"}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    🎂 {applicant.userAge}세
                  </p>
                </div>
              </div>

              {/* 오른쪽: 종합 점수 */}
              <div className="text-right">
                <div className="text-5xl font-bold text-purple-600">
                  {applicant.aiScore || 0}
                </div>
                <div className="text-sm text-gray-500">AI 매칭 점수</div>
              </div>
            </div>

            {/* 지원 정보 */}
            <div className="p-6 mb-8 rounded-lg bg-gray-50">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                지원 정보
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-1 text-sm text-gray-500">지원 공고</div>
                  <div className="font-medium text-gray-900">
                    {applicant.jobTitle}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">직무</div>
                  <div className="font-medium text-gray-900">
                    {applicant.jobCategory}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">지원일</div>
                  <div className="font-medium text-gray-900">
                    {new Date(applicant.appliedAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
                {applicant.reviewedAt && (
                  <div>
                    <div className="mb-1 text-sm text-gray-500">검토일</div>
                    <div className="font-medium text-gray-900">
                      {new Date(applicant.reviewedAt).toLocaleDateString(
                        "ko-KR"
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 주요 스킬 */}
            {applicant.skills && applicant.skills.length > 0 && (
              <div className="p-6 mb-8 border-2 border-purple-200 rounded-lg bg-purple-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  주요 스킬
                </h2>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 text-sm font-semibold text-purple-700 bg-white border-2 border-purple-300 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 이력서 */}
            <div className="p-6 mb-8 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                이력서 {applicant.resumeTitle && `- ${applicant.resumeTitle}`}
              </h2>
              
              <div className="space-y-4">
                {/* 경력 */}
                {applicant.experience && (
                  <div>
                    <div className="mb-2 text-sm font-semibold text-gray-700">💼 경력</div>
                    <div className="p-4 bg-white border border-blue-200 rounded-lg">
                      <span className="text-gray-900">{applicant.experience}</span>
                    </div>
                  </div>
                )}

                {/* 학력 */}
                {applicant.education && (
                  <div>
                    <div className="mb-2 text-sm font-semibold text-gray-700">🎓 학력</div>
                    <div className="p-4 bg-white border border-blue-200 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{applicant.education}</p>
                    </div>
                  </div>
                )}

                {/* 자격증 */}
                {applicant.certifications && (
                  <div>
                    <div className="mb-2 text-sm font-semibold text-gray-700">🏆 자격증</div>
                    <div className="p-4 bg-white border border-blue-200 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{applicant.certifications}</p>
                    </div>
                  </div>
                )}

                {!applicant.experience && !applicant.education && !applicant.certifications && (
                  <div className="p-4 text-center text-gray-500">
                    이력서 정보가 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 자기소개서 */}
            {applicant.coverLetterContent && (
              <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  자기소개서
                </h2>
                <div className="p-4 bg-white border border-green-200 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {applicant.coverLetterContent}
                  </p>
                </div>
              </div>
            )}

            {/* 메모 */}
            {applicant.notes && (
              <div className="p-6 mb-8 rounded-lg bg-blue-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">메모</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {applicant.notes}
                </p>
              </div>
            )}

            {/* 하단 버튼 */}
            <div className="flex gap-4">
              {applicant.status !== "ACCEPTED" &&
                applicant.status !== "REJECTED" && (
                  <>
                    <button
                      onClick={handleAccept}
                      className="flex-1 px-6 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      합격 처리
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 px-6 py-3 font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      불합격 처리
                    </button>
                  </>
                )}
              <button
                onClick={handleInterviewRequest}
                disabled={applicant.status === "REJECTED"}
                className={`flex-1 px-6 py-3 font-semibold transition rounded-lg ${
                  applicant.status === "REJECTED"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                면접 요청
              </button>
              <button
                onClick={handleCompatibilityClick}
                className="flex-1 px-6 py-3 font-semibold text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                적합성 상세
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
