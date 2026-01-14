import { useState, useRef } from "react";
// 통일성을 위해 기존 이력서 사이드바를 재사용합니다.
import ResumeSidebar from "../resume/components/ResumeSidebar";

interface CoverLetterFormPageProps {
  onBack: () => void; // 부모(Page)에게 "나 끝났어!" 하고 알리는 신호기
  onMenuClick: (menuId: string) => void;
  onSave: (data: { title: string; content: string; fileCount: number }) => void;
}

export default function CoverLetterFormPage({
  onBack,
  onMenuClick,
  onSave,
}: CoverLetterFormPageProps) {
  // 1. 메뉴 활성화 (자소서 관리)
  const [activeMenu, setActiveMenu] = useState("resume-sub-2");

  // 2. 입력값 관리 (제목, 내용)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 3. 파일 업로드 관리
  const [coverLetterFiles, setCoverLetterFiles] = useState<string[]>([]);
  const coverLetterFileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverLetterFileUpload = () => {
    coverLetterFileInputRef.current?.click();
  };

  const handleCoverLetterFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverLetterFiles([...coverLetterFiles, file.name]);
    }
  };

  const removeCoverLetterFile = (index: number) => {
    setCoverLetterFiles(coverLetterFiles.filter((_, i) => i !== index));
  };

  // 4. 저장/취소 버튼
  const handleSubmit = () => {
    onSave({
      title: title,
      content: content,
      fileCount: coverLetterFiles.length,
    });

    alert("자소서가 등록되었습니다.");
  };

  const handleCancel = () => {
    if (window.confirm("작성을 취소하시겠습니까?")) {
      onBack(); // 목록으로 돌아가기
    }
  };

  const handleSidebarClick = (menuId: string) => {
    if (
      window.confirm(
        "페이지를 이동하면 작성 중인 내용이 사라집니다. 이동하시겠습니까?"
      )
    ) {
      onMenuClick(menuId); // 확인 누르면 부모에게 이동 요청
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex gap-6">
          {/* 사이드바 */}
          <ResumeSidebar
            activeMenu={activeMenu}
            onMenuClick={handleSidebarClick}
          />

          {/* 메인 컨텐츠 */}
          <div className="flex-1 space-y-8">
            <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">자기소개서 작성</h2>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  목록으로
                </button>
              </div>

              <div className="mb-8">
                {/* 파일 업로드 */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">파일 불러오기</h3>
                  <button
                    onClick={handleCoverLetterFileUpload}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + 불러오기
                  </button>
                </div>
                <input
                  type="file"
                  ref={coverLetterFileInputRef}
                  onChange={handleCoverLetterFileChange}
                  className="hidden"
                />
                {coverLetterFiles.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {coverLetterFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <button
                          onClick={() => removeCoverLetterFile(index)}
                          className="px-3 py-1 text-sm border rounded-full"
                        >
                          X | {file}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 입력 폼 */}
                <div className="space-y-4">
                  <div className="p-4 border-2 border-gray-300 rounded-lg">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="자소서 제목"
                      className="w-full font-medium outline-none"
                    />
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요."
                    rows={15}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg outline-none resize-none"
                  />
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                  onClick={handleCancel}
                  className="px-8 py-3 font-semibold text-gray-700 bg-gray-200 rounded-full"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-full"
                >
                  등록
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
