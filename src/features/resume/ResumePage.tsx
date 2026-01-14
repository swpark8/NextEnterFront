import { useState, useRef } from "react";
import ResumeSidebar from "./components/ResumeSidebar";
import ResumeFormPage from "./ResumeFormPage";
import { usePageNavigation } from "../../hooks/usePageNavigation";

interface ResumePageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function ResumePage({
  initialMenu,
  onNavigate,
}: ResumePageProps) {
  // ✅ 커스텀 훅 사용 - 기존 30줄 코드가 3줄로!
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "resume",
    initialMenu,
    onNavigate
  );

  const [isCreating, setIsCreating] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 삭제 관련 상태
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 이력서 데이터 목록
  const [resumes, setResumes] = useState([
    {
      id: 1,
      title: "김유연_2025 개발자 이력서",
      industry: "프론트엔드 개발",
      applications: 3,
    },
    {
      id: 2,
      title: "김유연_프론트엔드 포지션",
      industry: "웹 개발",
      applications: 5,
    },
    {
      id: 3,
      title: "김유연_풀스택 개발자",
      industry: "풀스택",
      applications: 2,
    },
    {
      id: 4,
      title: "김유연_신입 개발자 이력서",
      industry: "신입 개발",
      applications: 1,
    },
  ]);

  // --- 핸들러 함수들 ---

  const handleFileUpload = () => {
    console.log("파일 선택 클릭됨");
    fileInputRef.current?.click();
  };

  const handleEdit = (id: number) => {
    console.log(`이력서 ${id} 수정 클릭됨`);
    setSelectedResumeId(id);
    setIsCreating(true);
  };

  const handleDelete = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      setResumes(resumes.filter((r) => r.id !== deleteTargetId));
      console.log(`이력서 ${deleteTargetId} 삭제됨`);
    }
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const handleCreateResume = () => {
    setSelectedResumeId(null); // 새 이력서 작성
    setIsCreating(true);
  };

  const handleBackToList = () => {
    setIsCreating(false);
    setSelectedResumeId(null);
  };

  // --- 렌더링 ---

  // ✅ ResumeFormPage에도 onNavigate 전달
  if (isCreating) {
    return (
      <ResumeFormPage
        onBack={handleBackToList}
        resumeId={selectedResumeId}
        onNavigate={onNavigate}
        initialMenu={initialMenu}
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
                className="flex-1 px-6 py-3 font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h2 className="inline-block mb-6 text-2xl font-bold">이력서 현황</h2>
        <div className="flex gap-6">
          {/* 사이드바 */}
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

              <div className="mb-6">
                <div className="mb-2 text-sm text-gray-600">
                  총 {resumes.length}건
                </div>

                {/* 이력서 목록 */}
                <div className="p-2 space-y-3 overflow-y-auto max-h-96">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="p-6 transition bg-white border-2 border-gray-300 rounded-lg hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{resume.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(resume.id)}
                            className="px-4 py-2 text-sm font-medium text-blue-600 transition border-2 border-blue-600 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(resume.id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-600 rounded-lg cursor-pointer hover:bg-red-600 hover:text-white"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">산업:</span>
                          <span className="ml-2 font-medium">
                            {resume.industry}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">지원 내역:</span>
                          <span className="ml-2 text-blue-600 underline cursor-pointer">
                            {resume.applications}건 &gt;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-12 border-2 border-blue-300 border-dashed bg-blue-50 rounded-2xl">
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
                  <input type="file" ref={fileInputRef} className="hidden" />
                  <button
                    onClick={handleFileUpload}
                    className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                  >
                    파일선택
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
