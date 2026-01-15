import { useState, useEffect } from "react";
import { navigationMenuData } from "../features/navigation-menu/data/menuData";

/**
 * 페이지 네비게이션 커스텀 훅
 * 
 * @param currentPageId - 현재 페이지 ID (예: "resume", "credit", "interview")
 * @param initialMenu - 초기 활성 메뉴 ID (App.tsx의 targetMenu에서 전달)
 * @param onNavigate - 페이지 이동 핸들러 (App.tsx의 handleTabChange)
 * @returns { activeMenu, handleMenuClick }
 * 
 * @example
 * ```tsx
 * const { activeMenu, handleMenuClick } = usePageNavigation(
 *   "resume",
 *   initialMenu,
 *   onNavigate
 * );
 * 
 * return (
 *   <ResumeSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
 * );
 * ```
 */
export const usePageNavigation = (
  currentPageId: string,
  initialMenu?: string,
  onNavigate?: (page: string, subMenu?: string) => void
) => {
  // 활성 메뉴 상태 관리
  const [activeMenu, setActiveMenu] = useState(initialMenu || currentPageId);

  // initialMenu가 변경되면 activeMenu 업데이트
  useEffect(() => {
    if (initialMenu) {
      setActiveMenu(initialMenu);
    }
  }, [initialMenu]);

  /**
   * 메뉴 클릭 핸들러
   * 1. activeMenu 상태 업데이트
   * 2. 클릭한 메뉴가 속한 탭(대분류) 찾기
   * 3. 현재 페이지가 아닌 다른 페이지라면 onNavigate 호출
   * 4. 같은 페이지라도 서브 메뉴가 다르면 onNavigate 호출 (예: 이력서 관리 → 자소서 관리)
   */
  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);

    // 클릭한 메뉴가 어느 탭에 속하는지 찾기
    let targetTab = "";
    const sections = Object.values(navigationMenuData) as any[];

    for (const section of sections) {
      // section.id가 일치하거나, section.items 중에 menuId가 있으면
      if (
        section.id === menuId ||
        section.items?.some((item: any) => item.id === menuId)
      ) {
        targetTab = section.id;
        break;
      }
    }

    // ✅ 수정: 다른 탭으로 이동하거나, 같은 탭이라도 항상 onNavigate 호출
    // (같은 탭 내에서 서브 페이지 전환을 위해)
    if (targetTab && onNavigate) {
      onNavigate(targetTab, menuId);
    }
  };

  return {
    activeMenu,
    handleMenuClick,
  };
};
