import { useState, useEffect } from "react";
// ✅ 1. useLocation 추가 (현재 내 위치 확인용)
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { navigationMenuData } from "../features/navigation-menu/data/menuData";

export const usePageNavigation = (
  currentPageId: string,
  initialMenuOrDefault?: string,
  onNavigate?: (page: string, subMenu?: string) => void
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // ✅ 2. 현재 위치 가져오기
  const location = useLocation();

  const menuFromUrl = searchParams.get("menu");

  const [activeMenu, setActiveMenu] = useState(
    menuFromUrl || initialMenuOrDefault || currentPageId
  );

  useEffect(() => {
    const newMenu = searchParams.get("menu");
    if (newMenu) {
      setActiveMenu(newMenu);
    }
  }, [searchParams]);

  useEffect(() => {
    if (initialMenuOrDefault && !menuFromUrl) {
      setActiveMenu(initialMenuOrDefault);
    }
  }, [initialMenuOrDefault, menuFromUrl]);

  const handleMenuClick = (
    menuId: string,
    navigateCallback?: (page: string, subMenu: string) => void
  ) => {
    // 3. 별도 페이지로 가야 하는 메뉴들
    const separateRoutes: { [key: string]: string } = {
      "job-sub-1": "/user/jobs/all",
      "job-sub-2": "/user/jobs/ai",
      "job-sub-3": "/user/jobs/position",
      "job-sub-4": "/user/jobs/location",
      "resume-sub-2": "/user/coverletter",
      "offer-sub-2": "/user/offers/interview",
      "credit-sub-2": "/user/credit/charge",
      "mypage-sub-2": "/user/profile",
      "mypage-sub-3": "/user/application-status", // ✅ 입사지원 현황 추가
    };

    // ✅ 특별 처리: 페이지 ID로 직접 이동하는 경우
    const specialRoutes: { [key: string]: string } = {
      "application-status": "/user/application-status",
      "ai-recommend": "/user/jobs/ai", // AI 추천 공고
    };

    // 먼저 특별 라우트 체크
    if (specialRoutes[menuId]) {
      navigate(specialRoutes[menuId]);
      return;
    }

    if (separateRoutes[menuId]) {
      navigate(`${separateRoutes[menuId]}?menu=${menuId}`);
      return;
    }

    // 4. 같은 탭 안에서 이동할 때의 로직
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

    if (targetTab === currentPageId) {
      // ✅ [핵심 수정] "같은 탭이지만, 내가 지금 딴 데(별도 페이지) 와있나?" 체크
      const baseRoutes: { [key: string]: string } = {
        job: "/user",
        resume: "/user/resume",
        matching: "/user/matching",
        interview: "/user/interview",
        offer: "/user/offers",
        mypage: "/user/mypage",
        credit: "/user/credit",
      };

      const targetBaseRoute = baseRoutes[targetTab];

      // "목적지가 기본 페이지인데, 현재 내 주소가 거기가 아니라면?" -> 이동해라!
      if (targetBaseRoute && location.pathname !== targetBaseRoute) {
        navigate(`${targetBaseRoute}?menu=${menuId}`);
      } else {
        // 이미 기본 페이지에 있으면 쿼리만 변경
        setActiveMenu(menuId);
        setSearchParams({ menu: menuId });
      }
    } else {
      // 다른 탭으로 이동 (기존 로직 유지)
      const callback = navigateCallback || onNavigate;
      if (callback) {
        callback(targetTab, menuId);
      } else {
        const routes: { [key: string]: string } = {
          job: "/user",
          resume: "/user/resume",
          matching: "/user/matching",
          interview: "/user/interview",
          offer: "/user/offers",
          mypage: "/user/mypage",
          credit: "/user/credit",
        };
        const route = routes[targetTab];
        if (route) {
          navigate(`${route}?menu=${menuId}`);
        }
      }
    }
  };

  return {
    activeMenu,
    handleMenuClick,
    setActiveMenu,
  };
};
