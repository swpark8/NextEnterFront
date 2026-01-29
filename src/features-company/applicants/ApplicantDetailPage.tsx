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
import api from "../../api/axios"; // ✅ 추가

// ResumeResponse 타입이 프로젝트에 있으면 import 해서 쓰는 걸 추천.
// 여기서는 최소한으로 any로 처리 (원하면 타입 붙여줄게)
type ResumeResponse = any;

export default function ApplicantDetailPage() {
  const navigate = useNavigate();
  const { applicantId } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const reloadParam = searchParams.get("reload");

  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<ApplyDetailResponse | null>(null);

  // ✅ 지원자의 이력서(포트폴리오/자소서 파일 포함) 상세를 추가로 가져오기 위한 state
  const [resume, setResume] = useState<ResumeResponse | null>(null);

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
        const data = await getApplyDetail(parseInt(applicantId), user.companyId);
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

  // ✅ applicant가 로드되면 resumeId로 이력서 상세(공개) 조회
  useEffect(() => {
    const loadResume = async () => {
      // 기업 회원의 userId(= companyUserId)가 필요
      if (!user?.userId || !applicant?.resumeId) return;

      try {
        const res = await api.get(`/api/resume/public/${applicant.resumeId}`, {
          headers: {
            userId: user.userId.toString(), // ✅ 회사 유저ID로 조회
          },
        });
        setResume(res.data);
      } catch (err) {
        console.error("지원자 이력서(public) 조회 실패:", err);
        setResume(null);
      }
    };

    loadResume();
  }, [applicant?.resumeId, user?.userId]);

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

        const updatedData = await getApplyDetail(applicant.applyId, user.companyId);
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

        const updatedData = await getApplyDetail(applicant.applyId, user.companyId);
        setApplicant(updatedData);
      } catch (error: any) {
        console.error("상태 변경 실패:", error);
        alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
      }
    }
  };

  // ✅ 면접 제안
  const handleInterviewOffer = async () => {
    if (!applicant || !user?.companyId) return;

    if (applicant.status === "ACCEPTED") {
      alert("이미 합격 처리된 지원자입니다.");
      return;
    }

    if (
      window.confirm(`${applicant.userName}님에게 기업의 요청을 하시겠습니까?`)
    ) {
      try {
        await createInterviewOffer(user.companyId, {
          userId: applicant.userId,
          jobId: applicant.jobId,
          applyId: applicant.applyId,
        });

        alert(
          "기업의 요청이 성공적으로 전송되었습니다.\n개인 회원은 '받은 제안' 페이지에서 확인할 수 있습니다.",
        );
      } catch (error: any) {
        console.error("기업의 요청 실패:", error);
        alert(error.response?.data?.message || "기업의 요청에 실패했습니다.");
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
      case "CANCELED":
        return "bg-gray-100 text-gray-700";
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
      case "CANCELED":
        return "면접거절";
      default:
        return status;
    }
  };

  // ✅ 하위호환 structuredData 파싱 (ResumeDetailPage 스타일 그대로)
  const parseStructuredData = (structuredData: string | undefined) => {
    if (!structuredData) return null;
    try {
      return JSON.parse(structuredData);
    } catch {
      return null;
    }
  };

  const structuredData = resume ? parseStructuredData(resume.structuredData) : null;

  // ✅ 포트폴리오 다운로드 (resumeId 기반)
  const handlePortfolioDownload = async (portfolio: any) => {
    if (!user?.userId || !applicant?.resumeId) return;

    if (portfolio?.portfolioId) {
      try {
        const response = await api.get(
          `/api/resume/${applicant.resumeId}/portfolios/${portfolio.portfolioId}/download`,
          {
            headers: { userId: user.userId.toString() },
            responseType: "blob",
          },
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", portfolio.filename || portfolio.fileName || "portfolio");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("포트폴리오 다운로드 오류:", error);
        alert("포트폴리오를 다운로드할 수 없습니다. 파일이 서버에 없을 수 있습니다.");
      }
    } else {
      alert("이 포트폴리오는 파일명만 저장되어 있습니다.\n실제 파일이 없어서 다운로드할 수 없습니다.");
    }
  };

  // ✅ 자기소개서 파일 다운로드 (coverLetterId 기반)
  const handleCoverLetterDownload = async (file: any) => {
    if (!user?.userId) return;

    const coverLetterId = typeof file === "object" ? file.coverLetterId : null;

    let filename = typeof file === "string" ? file : file.title || file.filename || "coverletter";
    if (typeof file === "object" && file.fileType) {
      const ext = String(file.fileType).toLowerCase();
      if (!filename.toLowerCase().endsWith(`.${ext}`)) {
        filename = `${filename}.${ext}`;
      }
    }

    if (coverLetterId) {
      try {
        const response = await api.get(`/api/coverletters/${coverLetterId}/file`, {
          params: { userId: user.userId }, // ✅ coverletters는 requestParam userId
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("자기소개서 다운로드 오류:", error);
        alert("자기소개서를 다운로드할 수 없습니다. 파일이 서버에 없을 수 있습니다.");
      }
    } else {
      alert("이 자기소개서는 파일명만 저장되어 있습니다.\n실제 파일이 없어서 다운로드할 수 없습니다.");
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
          <CompanyLeftSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
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

            {/* ✅ 인적사항 (ResumeDetailPage 스타일) */}
            {(applicant.userName ||
              applicant.userEmail ||
              applicant.gender ||
              applicant.userPhone ||
              applicant.birthDate ||
              applicant.address ||
              applicant.profileImage) && (
              <div className="p-6 mb-8 border-2 border-indigo-200 rounded-lg bg-indigo-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">📋 인적사항</h2>

                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  {applicant.profileImage && (
                    <div className="flex justify-center md:justify-start">
                      <img
                        src={applicant.profileImage}
                        alt="프로필 이미지"
                        className="object-cover w-40 h-48 bg-white border-2 border-indigo-200 rounded-lg shadow-sm"
                      />
                    </div>
                  )}

                  <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                    {applicant.userName && (
                      <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                        <div className="mb-1 text-xs font-medium text-gray-500">이름</div>
                        <div className="font-semibold text-gray-900">{applicant.userName}</div>
                      </div>
                    )}

                    {applicant.gender && (
                      <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                        <div className="mb-1 text-xs font-medium text-gray-500">성별</div>
                        <div className="font-semibold text-gray-900">
                          {applicant.gender === "MALE"
                            ? "남성"
                            : applicant.gender === "FEMALE"
                            ? "여성"
                            : applicant.gender}
                        </div>
                      </div>
                    )}

                    {applicant.birthDate && (
                      <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                        <div className="mb-1 text-xs font-medium text-gray-500">생년월일</div>
                        <div className="font-semibold text-gray-900">{applicant.birthDate}</div>
                      </div>
                    )}

                    {applicant.userEmail && (
                      <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                        <div className="mb-1 text-xs font-medium text-gray-500">이메일</div>
                        <div className="font-semibold text-gray-900">{applicant.userEmail}</div>
                      </div>
                    )}

                    {applicant.userPhone && (
                      <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                        <div className="mb-1 text-xs font-medium text-gray-500">연락처</div>
                        <div className="font-semibold text-gray-900">{applicant.userPhone}</div>
                      </div>
                    )}

                    {applicant.address && (
                      <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                        <div className="mb-1 text-xs font-medium text-gray-500">주소</div>
                        <div className="font-semibold text-gray-900">{applicant.address}</div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {/* ✅ 주요 스킬 */}
            {applicant.skills && applicant.skills.length > 0 && (
              <div className="p-6 mb-8 border-2 border-purple-200 rounded-lg bg-purple-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">💻 주요 스킬</h2>
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

            {/* ✅ 경험/활동/교육 */}
            {applicant.experiences && applicant.experiences.length > 0 && (
              <div className="p-6 mb-8 border-2 border-orange-200 rounded-lg bg-orange-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">🌟 경험/활동/교육</h2>
                <div className="space-y-3">
                  {applicant.experiences.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-white border border-orange-200 rounded-lg">
                      <div className="font-semibold text-gray-900">{exp.title}</div>
                      <div className="text-sm text-gray-600">{exp.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ 자격증/어학/수상 */}
            {applicant.certificates && applicant.certificates.length > 0 && (
              <div className="p-6 mb-8 border-2 border-yellow-200 rounded-lg bg-yellow-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">🏆 자격증/어학/수상</h2>
                <div className="space-y-3">
                  {applicant.certificates.map((cert, idx) => (
                    <div key={idx} className="p-4 bg-white border border-yellow-200 rounded-lg">
                      <div className="font-semibold text-gray-900">{cert.title}</div>
                      <div className="text-sm text-gray-600">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ 학력 */}
            {applicant.educations && applicant.educations.length > 0 && (
              <div className="p-6 mb-8 border-2 border-blue-200 rounded-lg bg-blue-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">🎓 학력</h2>
                <div className="space-y-3">
                  {applicant.educations.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-white border border-blue-200 rounded-lg">
                      <div className="font-semibold text-gray-900">{edu.school}</div>
                      <div className="text-sm text-gray-600">{edu.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ 경력 */}
            {applicant.careers && applicant.careers.length > 0 && (
              <div className="p-6 mb-8 border-2 border-teal-200 rounded-lg bg-teal-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  경력 ({applicant.experience || "신입"})
                </h2>
                <div className="space-y-3">
                  {applicant.careers.map((career, idx) => (
                    <div key={idx} className="p-4 bg-white border border-teal-200 rounded-lg">
                      <div className="font-semibold text-gray-900">{career.company}</div>
                      <div className="text-sm text-gray-600">{career.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================
                ✅ 아래부터 추가: 포트폴리오/자기소개서(파일) 섹션
               ========================== */}

            {/* ✅ 포트폴리오 (백엔드에서 직접) */}
            {resume?.portfolios && resume.portfolios.length > 0 && (
              <div className="p-6 mb-8 border-2 border-pink-200 rounded-lg bg-pink-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">📁 포트폴리오</h2>
                <div className="space-y-3">
                  {resume.portfolios.map((portfolio: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white border border-pink-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{portfolio.fileType === "pdf" ? "📄" : "📃"}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{portfolio.filename}</p>
                          <p className="text-sm text-gray-600">{portfolio.description || "설명 없음"}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePortfolioDownload(portfolio)}
                        className="px-4 py-2 text-sm font-semibold text-pink-700 transition bg-white border-2 border-pink-300 rounded-lg hover:bg-pink-100"
                      >
                        다운로드
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ 포트폴리오 (structuredData에서 - 하위호환) */}
            {(!resume?.portfolios || resume.portfolios.length === 0) &&
              structuredData?.portfolios &&
              structuredData.portfolios.length > 0 && (
                <div className="p-6 mb-8 border-2 border-pink-200 rounded-lg bg-pink-50">
                  <h2 className="mb-4 text-lg font-bold text-gray-900">📁 포트폴리오</h2>
                  <div className="space-y-3">
                    {structuredData.portfolios.map((portfolio: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-white border border-pink-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {portfolio.filename?.endsWith(".pdf") ? "📄" : "📃"}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900">{portfolio.filename}</p>
                            <p className="text-sm text-gray-600">
                              {portfolio.portfolioId ? "다운로드 가능" : "파일명만 저장됨"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePortfolioDownload(portfolio)}
                          className="px-4 py-2 text-sm font-semibold text-pink-700 transition bg-white border-2 border-pink-300 rounded-lg hover:bg-pink-100"
                        >
                          다운로드
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* ✅ 자기소개서 (백엔드에서 직접) */}
            {resume?.coverLetters && resume.coverLetters.length > 0 && (
              <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">✍️ 자기소개서</h2>
                <div className="space-y-4">
                  {resume.coverLetters.map((coverLetter: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white border border-green-200 rounded-lg">
                      {coverLetter.filePath && (
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-green-200">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {coverLetter.fileType === "pdf" ? "📄" : "📃"}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900">{coverLetter.title}</p>
                              <p className="text-sm text-gray-600">파일 다운로드 가능</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCoverLetterDownload(coverLetter)}
                            className="px-4 py-2 text-sm font-semibold text-green-700 transition bg-white border-2 border-green-300 rounded-lg hover:bg-green-100"
                          >
                            다운로드
                          </button>
                        </div>
                      )}

                      {coverLetter.content && (
                        <div>
                          {coverLetter.title && !coverLetter.filePath && (
                            <h3 className="mb-3 text-lg font-bold text-gray-900">
                              {coverLetter.title}
                            </h3>
                          )}
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {coverLetter.content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ 자기소개서 파일 (structuredData에서 - 하위호환) */}
            {(!resume?.coverLetters || resume.coverLetters.length === 0) &&
              structuredData?.coverLetter?.files &&
              structuredData.coverLetter.files.length > 0 && (
                <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                  <h2 className="mb-4 text-lg font-bold text-gray-900">📄 자기소개서 파일</h2>
                  <div className="space-y-3">
                    {structuredData.coverLetter.files.map((file: any, idx: number) => {
                      const filename = typeof file === "string" ? file : file.filename;
                      const coverLetterId = typeof file === "object" ? file.coverLetterId : null;

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-white border border-green-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {filename?.endsWith(".pdf") ? "📄" : "📃"}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900">{filename}</p>
                              <p className="text-sm text-gray-600">
                                {coverLetterId ? "다운로드 가능" : "파일명만 저장됨"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCoverLetterDownload(file)}
                            className="px-4 py-2 text-sm font-semibold text-green-700 transition bg-white border-2 border-green-300 rounded-lg hover:bg-green-100"
                          >
                            다운로드
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* ✅ 자기소개서 텍스트 (기존 applicant.coverLetterContent 유지) */}
            {applicant.coverLetterContent && (
              <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  ✍️ 자기소개서
                  {applicant.coverLetterTitle && ` - ${applicant.coverLetterTitle}`}
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
                <p className="text-gray-700 whitespace-pre-wrap">{applicant.notes}</p>
              </div>
            )}

            {/* 하단 버튼 */}
            <div className="flex gap-4">
              {applicant.status !== "ACCEPTED" && applicant.status !== "REJECTED" && (
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
                className={`flex-1 px-6 py-3 font-semibold transition rounded-lg ${
                  applicant.status === "ACCEPTED"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                기업의 요청
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
