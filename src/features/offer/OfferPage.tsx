import { useState, useEffect } from "react";
import OfferSidebar from "./components/OfferSidebar";
import { navigationMenuData } from "../navigation-menu/data/menuData";

interface OfferPageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

interface OfferDetail {
  id: number;
  company: string;
  sender: string;
  position: string;
  date: string;
  message: string;
  jobTitle: string;
  salary: string;
  location: string;
  tags: string[];
  jobUrl?: string; // 공고 상세 URL
}

export default function OfferPage({ initialMenu, onNavigate }: OfferPageProps) {
  const [activeMenu, setActiveMenu] = useState(initialMenu || "offer");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);

  useEffect(() => {
    if (initialMenu) {
      setActiveMenu(initialMenu);
    }
  }, [initialMenu]);

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    
    // 1. 클릭한 메뉴가 어느 탭 소속인지 찾기
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

    // 2. 내 구역('offer')이 아니면 App.tsx에게 이동 요청
    if (targetTab && targetTab !== "offer") {
      if (onNavigate) {
        onNavigate(targetTab, menuId);
      }
    }
  };

  // 샘플 제안 데이터
  const [offers, setOffers] = useState([
    {
      id: 1,
      company: "(주)테크솔루션",
      position: "SI/SM 웹 개발자 경력직 채용",
      date: "제안일 2026.01.13 14:30",
    },
    {
      id: 2,
      company: "(주)네이버",
      position: "프론트엔드 개발자 (신입/경력)",
      date: "제안일 2026.01.12 09:15",
    },
    {
      id: 3,
      company: "(주)카카오",
      position: "React 개발자 경력직 채용",
      date: "제안일 2026.01.11 16:45",
    },
    {
      id: 4,
      company: "(주)쿠팡",
      position: "Full Stack 웹 개발자",
      date: "제안일 2026.01.10 11:20",
    },
  ]);

  // 세부 제안 정보 (실제로는 API에서 가져올 데이터)
  const offerDetails: Record<number, OfferDetail> = {
    1: {
      id: 1,
      company: "(주)테크솔루션",
      sender: "인사팀 김철수 책임",
      position: "SI/SM 웹 개발자 경력직",
      date: "2026.01.13 14:30",
      message: `안녕하세요, 진규님. (주)테크솔루션입니다.\n깃허브에 올려주신 파일 드래그앤드롭 기능을 흥미롭게 보았습니다. 저희가 현재 개발 중인 프로젝트에서 React 전문가를 찾고 있습니다. 진규님의 경력과 기술 스택이 저희 팀과 매우 잘 맞을 것 같아 제안 드립니다.\n\n저희는 최신 기술 스택을 사용하며, 수평적인 조직문화를 지향하고 있습니다. 자세한 내용은 면접에서 말씀드리고 싶습니다.`,
      jobTitle: "[채용] SI/SM 웹 개발자 경력직 채용",
      salary: "4,000 ~ 5,000만원 (면접 후 협의 가능)",
      location: "서울 구로구",
      tags: ["#자율복장", "#간식무제한", "#4.5일제"],
      jobUrl: "https://example.com/jobs/1", // 추후 실제 URL로 교체
    },
    2: {
      id: 2,
      company: "(주)네이버",
      sender: "채용팀 이영희 매니저",
      position: "프론트엔드 개발자 (신입/경력)",
      date: "2026.01.12 09:15",
      message: `진규님, 안녕하세요.\n네이버 채용팀입니다. 진규님의 GitHub 프로젝트를 보고 큰 인상을 받았습니다.\n\n저희 팀은 현재 차세대 웹 서비스를 개발하고 있으며, React와 TypeScript를 주로 사용합니다. 진규님의 기술력이 저희 팀에 큰 도움이 될 것 같습니다.`,
      jobTitle: "[채용] 프론트엔드 개발자 (신입/경력)",
      salary: "3,500 ~ 6,000만원 (경력에 따라 협의)",
      location: "경기 성남시 분당구",
      tags: ["#재택근무", "#유연근무제", "#도서구입비"],
      jobUrl: "https://example.com/jobs/2",
    },
    3: {
      id: 3,
      company: "(주)카카오",
      sender: "개발실 박지훈 팀장",
      position: "React 개발자 경력직",
      date: "2026.01.11 16:45",
      message: `진규님, 안녕하세요.\n카카오 개발실의 박지훈입니다.\n\n진규님의 NextEnter 프로젝트를 보고 큰 관심이 생겼습니다. 특히 컴포넌트 구조화와 상태 관리 부분이 인상적이었습니다.\n\n저희는 대규모 서비스를 운영하며, 최신 기술 도입에 적극적입니다.`,
      jobTitle: "[채용] React 개발자 경력직 채용",
      salary: "5,000 ~ 7,000만원",
      location: "경기 판교시",
      tags: ["#연봉상한없음", "#스톡옵션", "#식당지원"],
      jobUrl: "https://example.com/jobs/3",
    },
    4: {
      id: 4,
      company: "(주)쿠팡",
      sender: "HR팀 최민수 수석",
      position: "Full Stack 웹 개발자",
      date: "2026.01.10 11:20",
      message: `안녕하세요, 진규님.\n쿠팡 HR팀의 최민수입니다.\n\n진규님의 풀스택 경험이 저희가 찾던 인재상과 매우 잘 맞습니다. 특히 Spring Boot와 React를 모두 다루신 경험이 인상적이었습니다.\n\n저희는 빠르게 성장하는 이커머스 플랫폼을 운영하고 있으며, 다양한 기술 챌린지를 경험할 수 있습니다.`,
      jobTitle: "[채용] Full Stack 웹 개발자 (경력 3년 이상)",
      salary: "4,500 ~ 6,500만원",
      location: "서울 송파구",
      tags: ["#통근버스", "#점심제공", "#교육지원"],
      jobUrl: "https://example.com/jobs/4",
    },
  };

  const handleOfferClick = (id: number) => {
    setSelectedOffer(id);
    setIsMessageExpanded(false);
  };

  const handleBack = () => {
    setSelectedOffer(null);
  };

  const handleAccept = () => {
    console.log("제안 수락");
    // 추후 API 연동
  };

  const handleReject = () => {
    console.log("제안 거절");
    // 추후 API 연동
  };

  const handleDelete = (id: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 카드 클릭 이벤트 방지
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setOffers(offers.filter((offer) => offer.id !== id));
      console.log(`제안 ${id} 삭제됨`);
    }
  };

  // 세부 내용 렌더링
  if (selectedOffer !== null) {
    const detail = offerDetails[selectedOffer];

    return (
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex gap-6">
          <OfferSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

          <div className="flex-1">
            {/* 상단 헤더 */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleBack}
                className="p-2 transition rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold">받은 제안 (상세)</h2>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="mb-20 overflow-hidden bg-white border-2 border-gray-200 rounded-2xl">
              {/* Header: 발신자 정보 */}
              <div className="p-6 border-b-2 border-gray-200 bg-blue-50">
                <div className="flex items-start gap-4">
                  {/* 기업 로고 */}
                  <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 bg-gray-300 rounded-lg">
                    <span className="text-xs text-gray-600">로고</span>
                  </div>

                  <div>
                    <h3 className="mb-1 text-xl font-bold text-gray-900">
                      {detail.company}
                    </h3>
                    <p className="mb-1 text-gray-700">
                      {detail.sender} 님이 제안을 보냈습니다.
                    </p>
                    <p className="text-sm text-gray-500">{detail.date}</p>
                  </div>
                </div>
              </div>

              {/* Body: 제안 메시지 */}
              <div className="p-6 border-b-2 border-gray-200">
                <div className="mb-2 font-semibold text-blue-600">
                  "진규님의 React 프로젝트 경험이 인상적입니다."
                </div>
                <div className="text-gray-700 whitespace-pre-line">
                  {isMessageExpanded
                    ? detail.message
                    : detail.message.slice(0, 150) + "..."}
                </div>
                <button
                  onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                  className="flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  {isMessageExpanded ? "접기" : "더보기"}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isMessageExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Card: 직무 정보 */}
              <div className="p-6">
                <h4 className="mb-4 text-lg font-bold text-gray-900">
                  {detail.jobTitle}
                </h4>

                <div className="mb-4 space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">연봉:</span> {detail.salary}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">지역:</span>{" "}
                    {detail.location}
                  </p>
                </div>

                <div className="flex gap-2 mb-6">
                  {detail.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={detail.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
                  >
                    공고 상세보기
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer: 고정 버튼 */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-200 shadow-lg">
              <div className="flex justify-end gap-4 mx-auto max-w-7xl">
                <button
                  onClick={handleReject}
                  className="px-8 py-3 font-semibold text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  거절하기
                </button>
                <button
                  onClick={handleAccept}
                  className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  수락하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 목록 페이지
  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <h2 className="inline-block mb-6 text-2xl font-bold">제안 현황</h2>

      <div className="flex gap-6">
        {/* 왼쪽 사이드바 */}
        <OfferSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

        {/* 메인 컨텐츠 */}
        <div className="flex-1">
          {/* 포지션 제안 섹션 */}
          <div className="mb-6">
            <h3 className="pb-2 mb-4 text-lg font-bold text-blue-600 border-b-2 border-blue-600">
              포지션 제안
            </h3>

            <div className="space-y-3">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => handleOfferClick(offer.id)}
                  onMouseEnter={() => setHoveredId(offer.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`p-4 bg-white border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                    hoveredId === offer.id
                      ? "border-blue-500 shadow-md transform scale-[1.01]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex-1">
                    <h4
                      className={`mb-1 transition-all ${
                        hoveredId === offer.id
                          ? "text-xl font-bold text-gray-900"
                          : "text-lg font-semibold text-gray-800"
                      }`}
                    >
                      {offer.company}
                    </h4>
                    <p className="mb-2 text-sm text-gray-600">
                      {offer.position} | {offer.date}
                    </p>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => handleDelete(offer.id, e)}
                    className="p-2 text-gray-400 transition-all rounded-lg hover:text-red-600 hover:bg-red-50"
                    title="삭제"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
