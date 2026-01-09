import { useState, useRef } from "react";
import ResumeSidebar from "./components/ResumeSidebar";
import ResumeFormPage from "./ResumeFormPage";

export default function ResumePage() {
  const [activeMenu, setActiveMenu] = useState("resume");
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    console.log("파일 선택 클릭됨");
    fileInputRef.current?.click();
  };

  const handleEdit = () => {
    console.log("수정 클릭됨");
    setIsCreating(true);
  };

  const handleDelete = () => {
    console.log("삭제 클릭됨");
  };

  const handleCreateResume = () => {
    setIsCreating(true);
  };

  const handleBackToList = () => {
    setIsCreating(false);
  };

  // 이력서 작성 페이지 표시
  if (isCreating) {
    return <ResumeFormPage onBack={handleBackToList} />;
  }

  return (
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
                <div className="mb-2 text-sm text-gray-600">총 1건</div>

                {/* 이력서 목록 */}
                <div className="p-6 border-2 border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">이력서 제목</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 text-sm font-medium text-blue-600 transition border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer"
                      >
                        수정
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">산업:</span>
                      <span className="ml-2 font-medium">희망직무</span>
                    </div>
                    <div>
                      <span className="text-gray-600">지원 내역:</span>
                      <span className="ml-2 text-blue-600 underline cursor-pointer">
                        3건 &gt;
                      </span>
                    </div>
                  </div>
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
  );
}
