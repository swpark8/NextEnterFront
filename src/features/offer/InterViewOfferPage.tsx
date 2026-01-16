import { useState } from "react";
import OfferSidebar from "./components/OfferSidebar";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useApp } from "../../context/AppContext";

interface InterviewOfferPageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function InterviewOfferPage({
  initialMenu,
  onNavigate,
}: InterviewOfferPageProps) {
  // 1. 네비게이션 훅
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "offer",
    initialMenu || "offer-sub-2",
    onNavigate
  );

  // 2. AppContext에서 면접 제안 데이터 가져오기
  const { interviewOffers, deleteInterviewOffer } = useApp();

  // 3. 상태 관리
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // 4. 핸들러
  const handleDelete = (id: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 카드 클릭 방지
    if (window.confirm("제안을 삭제하시겠습니까?")) {
      deleteInterviewOffer(id);
      if (selectedOfferId === id) {
        setSelectedOfferId(null);
      }
    }
  };

  const handleOfferClick = (id: number) => setSelectedOfferId(id);
  const handleBackToList = () => setSelectedOfferId(null);

  const selectedOffer = interviewOffers.find((o) => o.id === selectedOfferId);

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <h2 className="inline-block mb-6 text-2xl font-bold">제안 현황</h2>
      <div className="flex gap-6">
        {/* 왼쪽 사이드바 */}
        <OfferSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        {/* 메인 컨텐츠 */}
        <div className="flex-1">
          {/* 면접 제안 섹션 */}
          <div className="mb-6">
            <h3 className="pb-2 mb-4 text-lg font-bold text-blue-600 border-b-2 border-blue-600">
              면접 제안
            </h3>

            {selectedOfferId && selectedOffer ? (
              // 🟦 상세 화면
              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">
                        {selectedOffer.company}
                      </h2>
                      <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                        {selectedOffer.status}
                      </span>
                    </div>
                    <p className="text-gray-500">
                      {selectedOffer.position} 포지션 면접 제안
                    </p>
                  </div>
                  <button
                    onClick={handleBackToList}
                    className="px-6 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    목록으로
                  </button>
                </div>

                <div className="mb-8 space-y-6">
                  <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl">
                    <h3 className="mb-2 font-bold text-gray-900">
                      📩 제안 메시지
                    </h3>
                    <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                      {selectedOffer.content}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <span className="block mb-1 text-sm text-gray-500">
                        제안일
                      </span>
                      <span className="font-medium">{selectedOffer.date}</span>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <span className="block mb-1 text-sm text-gray-500">
                        면접 장소
                      </span>
                      <span className="font-medium">
                        {selectedOffer.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button
                    onClick={(e) => handleDelete(selectedOffer.id, e)}
                    className="px-6 py-3 font-semibold text-red-600 transition rounded-lg bg-red-50 hover:bg-red-100"
                  >
                    제안 거절 / 삭제
                  </button>
                  <button className="px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">
                    면접 수락하기
                  </button>
                </div>
              </section>
            ) : (
              // 🟦 목록 화면
              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="space-y-4">
                  {interviewOffers.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 border-2 border-dashed rounded-xl">
                      받은 면접 제안이 없습니다.
                    </div>
                  ) : (
                    interviewOffers.map((offer) => (
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
                        {/* 왼쪽 정보 영역 */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {/* 회사명 (호버시 진해짐) */}
                            <h4
                              className={`transition-all ${
                                hoveredId === offer.id
                                  ? "text-xl font-bold text-gray-900"
                                  : "text-lg font-semibold text-gray-800"
                              }`}
                            >
                              {offer.company}
                            </h4>
                            {/* 면접 상태 배지 */}
                            <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-100">
                              {offer.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {offer.position} | {offer.date}
                          </p>
                        </div>

                        {/* 오른쪽 쓰레기통 아이콘 */}
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
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
