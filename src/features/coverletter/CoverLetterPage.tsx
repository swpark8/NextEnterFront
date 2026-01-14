// src/features/cover-letter/CoverLetterPage.tsx

import { useState, useEffect } from "react";
import ResumeSidebar from "../resume/components/ResumeSidebar";
import CoverLetterFormPage from "./CoverLetterFormPage";
import { navigationMenuData } from "../../features/navigation-menu/data/menuData";

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
  const [activeMenu, setActiveMenu] = useState(initialMenu || "resume-sub-2");
  const [isCreating, setIsCreating] = useState(false);

  // ✅ [핵심] 자소서 목록을 담을 그릇 (처음엔 비어있음 [])
  const [coverLetterList, setCoverLetterList] = useState<CoverLetterItem[]>([]);

  useEffect(() => {
    if (initialMenu) setActiveMenu(initialMenu);
  }, [initialMenu]);

  // 메뉴 이동 로직 (기존과 동일)
  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    let targetTab = "";
    const sections = Object.values(navigationMenuData) as any[];
    for (const section of sections) {
      if (
        section.id === menuId ||
        section.items?.some((item: any) => item.id === menuId)
      ) {
        targetTab = section.id;
        break;
      }
    }
    if (onNavigate && targetTab) {
      onNavigate(targetTab, menuId);
    }
  };

  // ✅ [핵심] 자식이 데이터를 던져주면 받아서 목록에 추가하는 함수
  const handleSaveData = (data: {
    title: string;
    content: string;
    fileCount: number;
  }) => {
    const newItem: CoverLetterItem = {
      id: Date.now(), // 고유 ID (현재시간)
      title: data.title || "제목 없는 자소서",
      date: new Date().toLocaleDateString(), // 오늘 날짜
      fileCount: data.fileCount,
      status: "작성중",
    };

    // 기존 목록(...prev)에 새 거(newItem) 추가
    setCoverLetterList((prev) => [newItem, ...prev]);
    setIsCreating(false); // 목록 화면으로 복귀
  };

  // 작성 모드일 때 (자식 보여줌)
  if (isCreating) {
    return (
      <CoverLetterFormPage
        onBack={() => setIsCreating(false)}
        onMenuClick={handleMenuClick}
        onSave={handleSaveData} // ✅ 저장 셔틀 함수 전달
      />
    );
  }

  // 목록 모드일 때
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex gap-6">
          <ResumeSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />

          <div className="flex-1 space-y-8">
            <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">자소서 관리</h2>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  자소서 작성
                </button>
              </div>

              {/* ✅ [핵심] 목록이 비었냐? 있냐? 에 따라 다르게 보여주기 */}
              {coverLetterList.length === 0 ? (
                // 1. 목록이 없을 때 (Empty State)
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
                // 2. 목록이 있을 때 (List State)
                <div className="mb-6">
                  {/* 여기가 바로 진짜 카운팅! */}
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
    </div>
  );
}
