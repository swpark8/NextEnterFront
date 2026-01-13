import { useState, useRef } from "react";
import Footer from "../../components/Footer";
import ResumeSidebar from "./components/ResumeSidebar";
import ResumeFormPage from "./ResumeFormPage";

export default function ResumePage() {
  const [activeMenu, setActiveMenu] = useState("resume");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 샘플 이력서 목록
  const [resumes, setResumes] = useState([
    { id: 1, title: '김유연_2025 개발자 이력서', industry: '프론트엔드 개발', applications: 3 },
    { id: 2, title: '김유연_프론트엔드 포지션', industry: '웹 개발', applications: 5 },
    { id: 3, title: '김유연_풀스택 개발자', industry: '풀스택', applications: 2 },
    { id: 4, title: '김유연_신입 개발자 이력서', industry: '신입 개발', applications: 1 },
  ]);

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
      setResumes(resumes.filter(r => r.id !== deleteTargetId));
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

  // 이력서 작성/수정 페이지 표시
  if (isCreating) {
    return <ResumeFormPage onBack={handleBackToList} resumeId={selectedResumeId} />;
  }

  return (
    <>
      {/* 삭제 확인 다이얼로그 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-4">이력서를 삭제하시겠습니까?</h3>
              <p className="text-gray-500 mt-2">삭제된 이력서는 복구할 수 없습니다.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <ResumeSidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

          {/* 메인 컨텐츠 */}
          <div className="flex-1 space-y-8">
            {/* 섹션 1: 이력서 관리 */}
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
                <div className="mb-2 text-sm text-gray-600">총 {resumes.length}건</div>

                {/* 이력서 목록 - 스크롤 가능 */}
                <div className="max-h-96 overflow-y-auto space-y-3 p-2">
                  {resumes.map((resume) => (
                    <div key={resume.id} className="p-6 border-2 border-gray-300 rounded-lg bg-white hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{resume.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(resume.id)}
                            className="px-4 py-2 text-sm font-medium text-blue-600 transition border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(resume.id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white cursor-pointer"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">산업:</span>
                          <span className="ml-2 font-medium">{resume.industry}</span>
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

              {/* 파일 업로드 영역 */}
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) console.log("파일 업로드됨:", file.name);
                    }}
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

              {/* 업로드 후 자동으로 전환됩니다 */}
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
                        다수 눈문 급단 점수 등급 측정
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
      <Footer />
    </>
  );
}
