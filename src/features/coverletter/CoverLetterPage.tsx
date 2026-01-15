// src/features/cover-letter/CoverLetterPage.tsx

import { useState, useRef } from "react";
import ResumeSidebar from "../resume/components/ResumeSidebar";
import CoverLetterFormPage from "./CoverLetterFormPage";
import { usePageNavigation } from "../../hooks/usePageNavigation";

// 데이터 타입 정의 (자소서 하나가 이렇게 생겼다)
interface CoverLetterItem {
  id: number;
  title: string;
  date: string;
  fileCount: number;
  status: string;
}

interface CoverLetterPageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function CoverLetterPage({
  initialMenu,
  onNavigate,
}: CoverLetterPageProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [coverLetterList, setCoverLetterList] = useState<CoverLetterItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "resume",
    initialMenu,
    onNavigate
  );

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newItem: CoverLetterItem = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        date: new Date().toLocaleDateString(),
        fileCount: 1,
        status: "불러온 파일",
      };
      setCoverLetterList((prev) => [newItem, ...prev]);
      e.target.value = "";
    }
  };

  const handleSaveData = (data: {
    title: string;
    content: string;
    fileCount: number;
  }) => {
    const newItem: CoverLetterItem = {
      id: Date.now(),
      title: data.title || "제목 없는 자소서",
      date: new Date().toLocaleDateString(),
      fileCount: data.fileCount,
      status: "작성중",
    };
    setCoverLetterList((prev) => [newItem, ...prev]);
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <CoverLetterFormPage
        onBack={() => setIsCreating(false)}
        onMenuClick={handleMenuClick}
        onSave={handleSaveData}
      />
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <div className="flex gap-6">
        <ResumeSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

        <div className="flex-1 space-y-8">
          <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">자소서 관리</h2>
              <div className="flex gap-4">
                <button
                  onClick={handleFileUpload}
                  className="text-blue-600 hover:text-blue-700"
                >
                  + 불러오기
                </button>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  자소서 작성
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.hwp"
              className="hidden"
            />

            {coverLetterList.length === 0 ? (
              <div className="mb-6">
                <div className="py-12 text-center text-gray-500 border-2 border-gray-200 border-dashed rounded-xl">
                  <div className="mb-2 text-4xl">📝</div>
                  <p>아직 등록된 자기소개서가 없습니다.</p>
                  <p className="text-sm text-gray-400">
                    새로운 자기소개서를 작성해보세요!
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="mb-2 text-sm text-gray-600">
                  총 {coverLetterList.length}건
                </div>

                <div className="space-y-4">
                  {coverLetterList.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 transition border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {item.title}
                        </h3>
                        <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>최종수정: {item.date}</span>
                        <span className="mx-2">|</span>
                        <span>첨부파일: {item.fileCount}개</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
