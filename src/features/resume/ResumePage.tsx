import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { getResumeList, deleteResume, ResumeListItem } from "../../api/resume";
import ResumeSidebar from "./components/ResumeSidebar";
import ResumeFormPage from "./ResumeFormPage";
import { usePageNavigation } from "../../hooks/usePageNavigation";

export default function ResumePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setResumes: setContextResumes } = useApp();

  // 쿼리 파라미터에서 메뉴 상태 읽기 (기본값: resume-sub-1)
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "resume",
    "resume-sub-1"
  );

  const [isCreating, setIsCreating] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 삭제 관련 상태
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 실제 이력서 목록 상태
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 이력서 목록 불러오기
  useEffect(() => {
    if (user?.userId) {
      loadResumes();
    }
  }, [user?.userId]);

  const loadResumes = async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await getResumeList(user.userId);
      if (Array.isArray(data)) {
        setResumes(data);
        
        // ✅ AppContext에도 저장 (매칭 페이지에서 사용할 수 있도록)
        const contextResumes = data.map((resume) => ({
          id: resume.resumeId,
          title: resume.title,
          industry: resume.jobCategory || '미지정',
          applications: 0, // API에서 제공하지 않으므로 0으로 설정
        }));
        setContextResumes(contextResumes);
      } else {
        setError("잘못된 응답 형식입니다.");
      }
    } catch (err: any) {
      console.error("이력서 목록 로드 오류:", err);
      setError("이력서 목록 불러오기에 실패하였습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("파일 업로드됨:", file.name);
    }
  };

  const handleEdit = (id: number) => {
    setSelectedResumeId(id);
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId !== null && user?.userId) {
      setIsLoading(true);
      try {
        const response = await deleteResume(deleteTargetId, user.userId);
        if (response.message === "deleted") {
          setResumes(resumes.filter((r) => r.resumeId !== deleteTargetId));
        } else {
          alert("이력서 삭제에 실패했습니다.");
        }
      } catch (err: any) {
        console.error("이력서 삭제 오류:", err);
        alert("이력서 삭제 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const handleCreateResume = () => {
    setSelectedResumeId(null);
    setIsCreating(true);
  };

  const handleBackToList = () => {
    setIsCreating(false);
    setSelectedResumeId(null);
    loadResumes();
  };

  const handleApplicationClick = (resumeId: number) => {
    handleMenuClick("mypage-sub-3");
  };

  // 이력서 작성/수정 페이지 표시
  if (isCreating) {
    return (
      <ResumeFormPage
        onBack={handleBackToList}
        resumeId={selectedResumeId}
        initialMenu={activeMenu}
      />
    );
  }

  return (
    <>
      {/* 삭제 확인 다이얼로그 */}
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
                className="flex-1 px-6 py-3 font-semibold text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="flex-1 px-6 py-3 font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold">이력서</h1>
          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <ResumeSidebar
              activeMenu={activeMenu}
              onMenuClick={handleMenuClick}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 space-y-8">
              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">이력서 관리</h2>
                  <button
                    onClick={handleCreateResume}
                    className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    이력서 작성
                  </button>
                </div>

                {error && (
                  <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-red-600">{error}</p>
                      <button
                        onClick={loadResumes}
                        className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        재시도
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="mb-2 text-sm text-gray-600">
                    총 {resumes.length}건
                  </div>

                  {isLoading && resumes.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <div className="mb-4 text-4xl">⏳</div>
                      <p>이력서 목록을 불러오는 중...</p>
                    </div>
                  ) : resumes.length === 0 && !error ? (
                    <div className="p-12 text-center text-gray-500">
                      <div className="mb-4 text-4xl">📄</div>
                      <p className="mb-4">등록된 이력서가 없습니다.</p>
                      <button
                        onClick={handleCreateResume}
                        className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        첫 이력서 작성하기
                      </button>
                    </div>
                  ) : resumes.length > 0 ? (
                    <div className="p-2 space-y-3 overflow-y-auto max-h-96">
                      {resumes.map((resume) => (
                        <div
                          key={resume.resumeId}
                          onClick={() => navigate(`/user/resume/${resume.resumeId}`)}
                          className="p-6 transition bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-blue-400"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold">
                                {resume.title}
                              </h3>
                              {resume.visibility === "PUBLIC" ? (
                                <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                  공개
                                </span>
                              ) : (
                                <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                                  비공개
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">직무:</span>
                              <span className="ml-2 font-medium">
                                {resume.jobCategory || "미지정"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">상태:</span>
                              <span className="ml-2 font-medium">
                                {resume.status === "COMPLETED"
                                  ? "완료"
                                  : "작성중"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">조회수:</span>
                              <span className="ml-2 font-medium">
                                {resume.viewCount}회
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="p-12 border-2 border-blue-300 border-dashed rounded-2xl bg-blue-50">
                  <div className="text-center">
                    <div className="mb-4 text-6xl">📁</div>
                    <h3 className="mb-2 text-lg font-bold">
                      파일을 드래그 하거나 클릭하여 업로드
                    </h3>
                    <p className="mb-4 text-gray-600">
                      지원 형식: PDF, WORD, HWP, EXCEL
                      <br />
                      (최대 10MB)
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.hwp,.xls,.xlsx"
                      className="hidden"
                    />
                    <button
                      onClick={handleFileUpload}
                      className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                    >
                      파일선택
                    </button>
                  </div>
                </div>

                <div className="p-4 mt-6 border-l-4 border-red-400 bg-red-50">
                  <h4 className="mb-2 font-bold">
                    업로드 후 자동으로 전환됩니다
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-blue-600 rounded-full">
                        1
                      </div>
                      <div>
                        <div className="font-semibold">텍스트 추출</div>
                        <div className="text-xs text-gray-600">
                          파일에서 텍스트를 자동으로 추출합니다
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-blue-600 rounded-full">
                        2
                      </div>
                      <div>
                        <div className="font-semibold">AI 구조화</div>
                        <div className="text-xs text-gray-600">
                          학력, 경력, 프로젝트 스킬 등을 자동 분류
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-blue-600 rounded-full">
                        3
                      </div>
                      <div>
                        <div className="font-semibold">점수 추정</div>
                        <div className="text-xs text-gray-600">
                          다수 논문 기반 점수 등급 측정
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
