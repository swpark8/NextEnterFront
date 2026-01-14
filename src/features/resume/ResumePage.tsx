import { useState, useRef, useEffect } from "react";
import ResumeSidebar from "./components/ResumeSidebar";
import ResumeFormPage from "./ResumeFormPage";
// ✅ [필수] 메뉴 구조 데이터를 불러옵니다 (누구 자식인지 확인용)
import { navigationMenuData } from "../../features/navigation-menu/data/menuData";

interface ResumePageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function ResumePage({
  initialMenu,
  onNavigate,
}: ResumePageProps) {
  // 1. 초기값 설정
  const [activeMenu, setActiveMenu] = useState(initialMenu || "resume-sub-1");
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialMenu) {
      setActiveMenu(initialMenu);
    }
  }, [initialMenu]);

  // ✅ [수정된 핵심 로직] 클릭된 메뉴의 '부모 탭'을 찾아서 이동시킵니다.
  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId); // 1. 일단 클릭한 거 파란색으로 표시

    // 2. 클릭한 메뉴(menuId)가 어느 대분류(탭)에 속하는지 찾기
    let targetTab = "";

    // ⚠️ [해결] 'as any[]'를 붙여서 TypeScript가 데이터 구조를 너무 엄격하게 검사하지 않도록 합니다.
    const sections = Object.values(navigationMenuData) as any[];

    for (const section of sections) {
      // 대분류 ID랑 같거나, 하위 아이템들 중에 이 ID가 있으면 당첨
      if (
        section.id === menuId ||
        section.items?.some((item: any) => item.id === menuId)
      ) {
        targetTab = section.id;
        break;
      }
    }

    // 3. 찾은 탭이 현재 페이지('resume')가 아니라면 -> App.tsx에게 이동 요청
    if (onNavigate && targetTab) {
      onNavigate(targetTab, menuId);
    }
  };

  const handleFileUpload = () => fileInputRef.current?.click();
  const handleEdit = () => setIsCreating(true);
  const handleDelete = () => console.log("삭제 클릭됨");
  const handleCreateResume = () => setIsCreating(true);
  const handleBackToList = () => setIsCreating(false);

  if (isCreating) {
    return <ResumeFormPage onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex gap-6">
          {/* 사이드바 */}
          <ResumeSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick} // ✅ 수정된 핸들러 연결
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
                <div className="mb-2 text-sm text-gray-600">총 1건</div>
                <div className="p-6 border-2 border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">이력서 제목</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 text-sm font-medium text-blue-600 transition border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white"
                      >
                        수정
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white"
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
    </div>
  );
}
