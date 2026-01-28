import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import {
  getApplyDetail,
  updateApplyStatus,
  type ApplyDetailResponse,
} from "../../api/apply";
import { createInterviewOffer } from "../../api/interviewOffer";

export default function ApplicantDetailPage() {
  const navigate = useNavigate();
  const { applicantId } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const reloadParam = searchParams.get('reload');

  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<ApplyDetailResponse | null>(null);

  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "applicants",
    "applicants-sub-1",
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadApplicantDetail = async () => {
      if (!applicantId || !user?.companyId) {
        alert("잘못된 접근입니다.");
        navigate("/company/applicants");
        return;
      }

      try {
        setLoading(true);
        const data = await getApplyDetail(
          parseInt(applicantId),
          user.companyId,
        );
        setApplicant(data);
      } catch (error: any) {
        console.error("지원자 상세 조회 실패:", error);
        alert(
          error.response?.data?.message ||
          "지원자 정보를 불러오는데 실패했습니다.",
        );
        navigate("/company/applicants");
      } finally {
        setLoading(false);
      }
    };

    loadApplicantDetail();
  }, [applicantId, user, navigate, reloadParam]);

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

        const updatedData = await getApplyDetail(
          applicant.applyId,
          user.companyId,
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

        const updatedData = await getApplyDetail(
          applicant.applyId,
          user.companyId,
        );
        setApplicant(updatedData);
      } catch (error: any) {
        console.error("상태 변경 실패:", error);
        alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
      }
    }
  };

  // ✅ 면접 제안 (새 API 사용)
  const handleInterviewOffer = async () => {
    if (!applicant || !user?.companyId) return;

    // ✅ 합격 상태일 때 면접 제안 불가
    if (applicant.status === "ACCEPTED") {
      alert("이미 합격 처리된 지원자입니다.");
      return;
    }

    if (
      window.confirm(`${applicant.userName}님에게 스카웃 제안을 하시겠습니까?`)
    ) {
      try {
        await createInterviewOffer(user.companyId, {
          userId: applicant.userId,
          jobId: applicant.jobId,
          applyId: applicant.applyId,
        });

        alert(
          "스카웃 제안이 성공적으로 전송되었습니다.\n개인 회원은 '받은 제안' 페이지에서 확인할 수 있습니다.",
        );
      } catch (error: any) {
        console.error("스카웃 제안 실패:", error);
        alert(error.response?.data?.message || "스카웃 제안에 실패했습니다.");
      }
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
      case "CANCELED":
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
      case "CANCELED":
        return "면접거절";
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
                  applicant.status,
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
                        "ko-KR",
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 인적사항 */}
            <div className="p-6 mb-8 border-2 border-indigo-200 rounded-lg bg-indigo-50">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                📋 인적사항
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {applicant.gender && (
                  <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                    <div className="mb-1 text-xs font-medium text-gray-500">
                      성별
                    </div>
                    <div className="font-semibold text-gray-900">
                      {applicant.gender}
                    </div>
                  </div>
                )}
                {applicant.birthDate && (
                  <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                    <div className="mb-1 text-xs font-medium text-gray-500">
                      생년월일
                    </div>
                    <div className="font-semibold text-gray-900">
                      {applicant.birthDate}
                    </div>
                  </div>
                )}
                {applicant.address && (
                  <div className="col-span-2 p-3 bg-white border border-indigo-200 rounded-lg">
                    <div className="mb-1 text-xs font-medium text-gray-500">
                      주소
                    </div>
                    <div className="font-semibold text-gray-900">
                      {applicant.address}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 주요 스킬 */}
            {applicant.skills && applicant.skills.length > 0 && (
              <div className="p-6 mb-8 border-2 border-purple-200 rounded-lg bg-purple-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  💻 주요 스킬
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

            {/* 경험/활동/교육 */}
            {applicant.experiences && applicant.experiences.length > 0 && (
              <div className="p-6 mb-8 border-2 border-orange-200 rounded-lg bg-orange-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  🌟 경험/활동/교육
                </h2>
                <div className="space-y-3">
                  {applicant.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-orange-200 rounded-lg"
                    >
                      <div className="font-semibold text-gray-900">
                        {exp.title}
                      </div>
                      <div className="text-sm text-gray-600">{exp.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 자격증/어학/수상 */}
            {applicant.certificates && applicant.certificates.length > 0 && (
              <div className="p-6 mb-8 border-2 border-yellow-200 rounded-lg bg-yellow-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  🏆 자격증/어학/수상
                </h2>
                <div className="space-y-3">
                  {applicant.certificates.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-yellow-200 rounded-lg"
                    >
                      <div className="font-semibold text-gray-900">
                        {cert.title}
                      </div>
                      <div className="text-sm text-gray-600">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 학력 */}
            {applicant.educations && applicant.educations.length > 0 && (
              <div className="p-6 mb-8 border-2 border-blue-200 rounded-lg bg-blue-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  🎓 학력
                </h2>
                <div className="space-y-3">
                  {applicant.educations.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-blue-200 rounded-lg"
                    >
                      <div className="font-semibold text-gray-900">
                        {edu.school}
                      </div>
                      <div className="text-sm text-gray-600">{edu.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 경력 */}
            {applicant.careers && applicant.careers.length > 0 && (
              <div className="p-6 mb-8 border-2 border-teal-200 rounded-lg bg-teal-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  💼 경력 ({applicant.experience || "신입"})
                </h2>
                <div className="space-y-3">
                  {applicant.careers.map((career, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-teal-200 rounded-lg"
                    >
                      <div className="font-semibold text-gray-900">
                        {career.company}
                      </div>
                      <div className="text-sm text-gray-600">
                        {career.period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 자기소개서 */}
            {applicant.coverLetterContent && (
              <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  ✍️ 자기소개서
                  {applicant.coverLetterTitle &&
                    ` - ${applicant.coverLetterTitle}`}
                </h2>
                <div className="p-4 bg-white border border-green-200 rounded-lg">
                  <p className="leading-relaxed text-gray-900 whitespace-pre-wrap">
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
                onClick={handleInterviewOffer}
                disabled={
                  applicant.status === "ACCEPTED" // ✅ 합격 상태일 때도 비활성화
                }
                className={`flex-1 px-6 py-3 font-semibold transition rounded-lg ${applicant.status === "ACCEPTED"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                스카웃 제안
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