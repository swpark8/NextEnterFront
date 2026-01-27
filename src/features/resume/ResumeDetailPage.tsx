import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ResumeSidebar from "./components/ResumeSidebar";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { getResumeDetail, deleteResume, type ResumeResponse } from "../../api/resume";
import api from "../../api/axios";

export default function ResumeDetailPage() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const { user } = useAuth();
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "resume",
    "resume-sub-1"
  );

  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<ResumeResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadResumeDetail = async () => {
      if (!resumeId || !user?.userId) {
        alert("잘못된 접근입니다.");
        navigate("/user/resume");
        return;
      }

      try {
        setLoading(true);
        const data = await getResumeDetail(parseInt(resumeId), user.userId);
        setResume(data);

        // ✅ 디버깅: 새로운 구조 확인
        console.log("📥 받은 이력서 데이터:", data);
        console.log("📥 userName:", data.userName);
        console.log("📥 experiences:", data.experiences);
        console.log("📥 certificates:", data.certificates);
        console.log("📥 educations:", data.educations);
        console.log("📥 careers:", data.careers);
        console.log("📥 skills:", data.skills);
        console.log("📥 structuredData (하위호환):", data.structuredData);
      } catch (error: any) {
        console.error("이력서 상세 조회 실패:", error);
        alert(
          error.response?.data?.message ||
            "이력서 정보를 불러오는데 실패했습니다."
        );
        navigate("/user/resume");
      } finally {
        setLoading(false);
      }
    };

    loadResumeDetail();
  }, [resumeId, user, navigate]);

  const handleBackClick = () => {
    navigate("/user/resume");
  };

  const handleEditClick = () => {
    navigate(`/user/resume/edit/${resumeId}`);
  };

  // 이력서 파일 다운로드 핸들러
  const handleFileDownload = async () => {
    if (!resumeId || !user?.userId || !resume) return;

    try {
      const response = await api.get(`/api/resume/${resumeId}/download`, {
        headers: {
          userId: user.userId.toString(),
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `${resume.title}.${resume.fileType || "docx"}`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("파일 다운로드 오류:", error);
      alert(
        error.response?.data?.message ||
          "파일 다운로드 중 오류가 발생했습니다."
      );
    }
  };

  // 포트폴리오 다운로드 핸들러
  const handlePortfolioDownload = async (portfolio: any) => {
    if (!resumeId || !user?.userId) return;

    if (portfolio.portfolioId) {
      try {
        const response = await api.get(
          `/api/resume/${resumeId}/portfolios/${portfolio.portfolioId}/download`,
          {
            headers: {
              userId: user.userId.toString(),
            },
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", portfolio.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error: any) {
        console.error("포트폴리오 다운로드 오류:", error);
        alert(
          "포트폴리오를 다운로드할 수 없습니다. 파일이 서버에 저장되지 않았을 수 있습니다."
        );
      }
    } else {
      alert(
        "이 이력서의 포트폴리오는 파일명만 저장되어 있습니다.\n실제 파일을 다운로드하려면 이력서를 다시 작성하거나 포트폴리오를 별도로 업로드해주세요."
      );
    }
  };

  // 자기소개서 파일 다운로드 핸들러
  const handleCoverLetterDownload = async (file: any) => {
    if (!user?.userId) return;

    const coverLetterId =
      typeof file === "object" ? file.coverLetterId : null;
    const filename = typeof file === "string" ? file : file.filename;

    if (coverLetterId) {
      try {
        const response = await api.get(
          `/api/coverletters/${coverLetterId}/file`,
          {
            params: {
              userId: user.userId,
            },
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error: any) {
        console.error("자기소개서 다운로드 오류:", error);
        alert(
          "자기소개서를 다운로드할 수 없습니다. 파일이 서버에 저장되지 않았을 수 있습니다."
        );
      }
    } else {
      alert(
        "이 이력서의 자기소개서는 파일명만 저장되어 있습니다.\n실제 파일을 다운로드하려면 이력서를 다시 작성하거나 자기소개서를 별도로 업로드해주세요."
      );
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!resumeId || !user?.userId) return;

    setIsDeleting(true);
    try {
      await deleteResume(parseInt(resumeId), user.userId);
      alert("이력서가 삭제되었습니다.");
      navigate("/user/resume");
    } catch (error: any) {
      console.error("이력서 삭제 실패:", error);
      alert(error.response?.data?.message || "이력서 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // ✅ 각 섹션 파싱 함수들
  const parseExperiences = (experiences: string | undefined) => {
    if (!experiences) return [];
    try {
      return JSON.parse(experiences);
    } catch {
      return [];
    }
  };

  const parseCertificates = (certificates: string | undefined) => {
    if (!certificates) return [];
    try {
      return JSON.parse(certificates);
    } catch {
      return [];
    }
  };

  const parseEducations = (educations: string | undefined) => {
    if (!educations) return [];
    try {
      return JSON.parse(educations);
    } catch {
      return [];
    }
  };

  const parseCareers = (careers: string | undefined) => {
    if (!careers) return [];
    try {
      return JSON.parse(careers);
    } catch {
      return [];
    }
  };

  const parseSkills = (skills: string | undefined) => {
    if (!skills) return [];
    // 쉼표로 구분된 문자열 파싱
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
  };

  const parseStructuredData = (structuredData: string | undefined) => {
    if (!structuredData) return null;
    try {
      return JSON.parse(structuredData);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">
          이력서 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  // ✅ 새로운 구조에서 데이터 파싱
  const experiences = parseExperiences(resume.experiences);
  const certificates = parseCertificates(resume.certificates);
  const educations = parseEducations(resume.educations);
  const careers = parseCareers(resume.careers);
  const skills = parseSkills(resume.skills);

  // ✅ 하위 호환성: structuredData (포트폴리오, 자기소개서 파일 등)
  const structuredData = parseStructuredData(resume.structuredData);

  // ✅ 직접 작성한 이력서인지 확인
  const isFormBasedResume =
    experiences.length > 0 ||
    certificates.length > 0 ||
    educations.length > 0 ||
    careers.length > 0 ||
    (resume.structuredData && resume.structuredData.trim() !== "");

  return (
    <>
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-2xl">
            <div className="mb-6 text-center">
              <div className="mb-4 text-5xl">⚠️</div>
              <h3 className="mb-4 text-2xl font-bold">
                이력서를 삭제하시겠습니까?
              </h3>
              <p className="mt-2 text-gray-500">
                삭제된 이력서는 복구할 수 없습니다.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 font-semibold text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold">이력서 상세</h2>
          <div className="flex gap-6">
            <ResumeSidebar
              activeMenu={activeMenu}
              onMenuClick={handleMenuClick}
            />

            <div className="flex-1 min-w-0">
              <div className="p-8 bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handleBackClick}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <span>←</span>
                    <span>목록으로 돌아가기</span>
                  </button>
                  <div className="flex items-center gap-3">
                    {/* 상태 배지 */}
                    {resume.visibility === "PUBLIC" ? (
                      <span className="px-4 py-1.5 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                        공개
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full">
                        비공개
                      </span>
                    )}
                    <span className="px-4 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                      {resume.status === "COMPLETED" ? "완료" : "작성중"}
                    </span>

                    {/* 직접 작성한 이력서면 수정 버튼 표시 */}
                    {isFormBasedResume && (
                      <button
                        onClick={handleEditClick}
                        className="px-4 py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        ✏️ 수정
                      </button>
                    )}

                    {/* 파일이 있으면 다운로드 버튼 */}
                    {resume.filePath && (
                      <button
                        onClick={handleFileDownload}
                        className="px-4 py-2 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        📥 다운로드
                      </button>
                    )}

                    <button
                      onClick={handleDeleteClick}
                      className="px-4 py-2 font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      🗑️ 삭제
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h1 className="mb-4 text-3xl font-bold text-gray-900">
                    {resume.title}
                  </h1>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">직무:</span>
                      <span className="ml-2 font-medium">
                        {resume.jobCategory || "미지정"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">조회수:</span>
                      <span className="ml-2 font-medium">
                        {resume.viewCount}회
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">작성일:</span>
                      <span className="ml-2 font-medium">
                        {new Date(resume.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ✅ 인적사항 - User 테이블에서 가져온 정보 + structuredData */}
                {(resume.userName ||
                  resume.userEmail ||
                  resume.userGender ||
                  resume.userPhone ||
                  structuredData?.personalInfo) && (
                  <div className="p-6 mb-8 border-2 border-indigo-200 rounded-lg bg-indigo-50">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      📋 인적사항
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {resume.userName && (
                        <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                          <div className="mb-1 text-xs font-medium text-gray-500">
                            이름
                          </div>
                          <div className="font-semibold text-gray-900">
                            {resume.userName}
                          </div>
                        </div>
                      )}
                      {resume.userGender && (
                        <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                          <div className="mb-1 text-xs font-medium text-gray-500">
                            성별
                          </div>
                          <div className="font-semibold text-gray-900">
                            {resume.userGender === "MALE" ? "남성" : "여성"}
                          </div>
                        </div>
                      )}
                      {structuredData?.personalInfo?.birthDate && (
                        <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                          <div className="mb-1 text-xs font-medium text-gray-500">
                            생년월일
                          </div>
                          <div className="font-semibold text-gray-900">
                            {structuredData.personalInfo.birthDate}
                          </div>
                        </div>
                      )}
                      {resume.userEmail && (
                        <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                          <div className="mb-1 text-xs font-medium text-gray-500">
                            이메일
                          </div>
                          <div className="font-semibold text-gray-900">
                            {resume.userEmail}
                          </div>
                        </div>
                      )}
                      {resume.userPhone && (
                        <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                          <div className="mb-1 text-xs font-medium text-gray-500">
                            연락처
                          </div>
                          <div className="font-semibold text-gray-900">
                            {resume.userPhone}
                          </div>
                        </div>
                      )}
                      {structuredData?.personalInfo?.address && (
                        <div className="col-span-2 p-3 bg-white border border-indigo-200 rounded-lg">
                          <div className="mb-1 text-xs font-medium text-gray-500">
                            주소
                          </div>
                          <div className="font-semibold text-gray-900">
                            {structuredData.personalInfo.address}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ✅ 주요 스킬 */}
                {skills.length > 0 && (
                  <div className="p-6 mb-8 border-2 border-purple-200 rounded-lg bg-purple-50">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      💻 주요 스킬
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill: string, idx: number) => (
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
                {experiences.length > 0 && (
                  <div className="p-6 mb-8 border-2 border-orange-200 rounded-lg bg-orange-50">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      🌟 경험/활동/교육
                    </h2>
                    <div className="space-y-3">
                      {experiences.map((exp: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border border-orange-200 rounded-lg"
                        >
                          <div className="font-semibold text-gray-900">
                            {exp.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {exp.period}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ✅ 자격증/어학/수상 */}
                {certificates.length > 0 && (
                  <div className="p-6 mb-8 border-2 border-yellow-200 rounded-lg bg-yellow-50">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      🏆 자격증/어학/수상
                    </h2>
                    <div className="space-y-3">
                      {certificates.map((cert: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border border-yellow-200 rounded-lg"
                        >
                          <div className="font-semibold text-gray-900">
                            {cert.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {cert.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ✅ 학력 */}
                {educations.length > 0 && (
                  <div className="p-6 mb-8 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      🎓 학력
                    </h2>
                    <div className="space-y-3">
                      {educations.map((edu: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border border-blue-200 rounded-lg"
                        >
                          <div className="font-semibold text-gray-900">
                            {edu.school}
                          </div>
                          <div className="text-sm text-gray-600">
                            {edu.period}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ✅ 경력 */}
                {careers.length > 0 && (
                  <div className="p-6 mb-8 border-2 border-teal-200 rounded-lg bg-teal-50">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      💼 경력
                    </h2>
                    <div className="space-y-3">
                      {careers.map((career: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border border-teal-200 rounded-lg"
                        >
                          <div className="font-semibold text-gray-900">
                            {career.company}
                          </div>
                          {career.position && (
                            <div className="text-sm text-gray-600">
                              {career.position}
                            </div>
                          )}
                          {career.role && (
                            <div className="mt-2 text-sm text-gray-700">
                              {career.role}
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            {career.period}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ✅ 포트폴리오 (백엔드에서 직접) */}
                {resume.portfolios && resume.portfolios.length > 0 && (
                  <div className="p-6 mb-8 border-2 border-pink-200 rounded-lg bg-pink-50">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      📁 포트폴리오
                    </h2>
                    <div className="space-y-3">
                      {resume.portfolios.map(
                        (portfolio: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-white border border-pink-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {portfolio.fileType === "pdf"
                                  ? "📄"
                                  : "📃"}
                              </span>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {portfolio.filename}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {portfolio.description || "설명 없음"}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handlePortfolioDownload(portfolio)
                              }
                              className="px-4 py-2 text-sm font-semibold text-pink-700 transition bg-white border-2 border-pink-300 rounded-lg hover:bg-pink-100"
                            >
                              다운로드
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* ✅ 포트폴리오 (structuredData에서 - 하위호환) */}
                {(!resume.portfolios || resume.portfolios.length === 0) &&
                  structuredData?.portfolios &&
                  structuredData.portfolios.length > 0 && (
                    <div className="p-6 mb-8 border-2 border-pink-200 rounded-lg bg-pink-50">
                      <h2 className="mb-4 text-lg font-bold text-gray-900">
                        📁 포트폴리오
                      </h2>
                      <div className="space-y-3">
                        {structuredData.portfolios.map(
                          (portfolio: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-4 bg-white border border-pink-200 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {portfolio.filename?.endsWith(".pdf")
                                    ? "📄"
                                    : "📃"}
                                </span>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {portfolio.filename}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {portfolio.portfolioId
                                      ? "다운로드 가능"
                                      : "파일명만 저장됨"}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handlePortfolioDownload(portfolio)
                                }
                                className="px-4 py-2 text-sm font-semibold text-pink-700 transition bg-white border-2 border-pink-300 rounded-lg hover:bg-pink-100"
                              >
                                다운로드
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* ✅ 자기소개서 (백엔드에서 직접) */}
                {resume.coverLetters && resume.coverLetters.length > 0 && (
                  <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">
                      ✍️ 자기소개서
                    </h2>
                    <div className="space-y-4">
                      {resume.coverLetters.map(
                        (coverLetter: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 bg-white border border-green-200 rounded-lg"
                          >
                            {/* 파일이 있으면 파일 다운로드 */}
                            {coverLetter.filePath && (
                              <div className="flex items-center justify-between pb-4 mb-4 border-b border-green-200">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">
                                    {coverLetter.fileType === "pdf" ? "📄" : "📃"}
                                  </span>
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {coverLetter.title}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      파일 다운로드 가능
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleCoverLetterDownload(coverLetter)
                                  }
                                  className="px-4 py-2 text-sm font-semibold text-green-700 transition bg-white border-2 border-green-300 rounded-lg hover:bg-green-100"
                                >
                                  다운로드
                                </button>
                              </div>
                            )}
                            
                            {/* 텍스트 내용 */}
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
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* ✅ 자기소개서 (하위호환 - structuredData에서) */}
                {(!resume.coverLetters || resume.coverLetters.length === 0) && (
                  <>
                    {/* 자기소개서 파일 (structuredData에서) */}
                    {structuredData?.coverLetter?.files &&
                      structuredData.coverLetter.files.length > 0 && (
                        <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                          <h2 className="mb-4 text-lg font-bold text-gray-900">
                            📄 자기소개서 파일
                          </h2>
                          <div className="space-y-3">
                            {structuredData.coverLetter.files.map(
                              (file: any, idx: number) => {
                                const filename =
                                  typeof file === "string" ? file : file.filename;
                                const coverLetterId =
                                  typeof file === "object"
                                    ? file.coverLetterId
                                    : null;

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
                                        <p className="font-semibold text-gray-900">
                                          {filename}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {coverLetterId
                                            ? "다운로드 가능"
                                            : "파일명만 저장됨"}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleCoverLetterDownload(file)
                                      }
                                      className="px-4 py-2 text-sm font-semibold text-green-700 transition bg-white border-2 border-green-300 rounded-lg hover:bg-green-100"
                                    >
                                      다운로드
                                    </button>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}

                    {/* 자기소개서 텍스트 (structuredData에서) */}
                    {structuredData?.coverLetter &&
                      structuredData.coverLetter.content && (
                        <div className="p-6 mb-8 border-2 border-green-200 rounded-lg bg-green-50">
                          <h2 className="mb-4 text-lg font-bold text-gray-900">
                            ✍️ 자기소개서 (텍스트)
                            {structuredData.coverLetter.title &&
                              ` - ${structuredData.coverLetter.title}`}
                          </h2>
                          <div className="p-4 bg-white border border-green-200 rounded-lg">
                            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                              {structuredData.coverLetter.content}
                            </p>
                          </div>
                        </div>
                      )}
                  </>
                )}

                {/* 하단 버튼 */}
                <div className="flex justify-end">
                  <button
                    onClick={handleBackClick}
                    className="px-8 py-3 font-semibold text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    목록으로
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}