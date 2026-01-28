import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import OfferSidebar from "./components/OfferSidebar";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useAuth } from "../../context/AuthContext";
// ✅ [수정 1] getReceivedOffers -> getMyOffers로 변경 (전체 목록 조회용)
import {
  getMyOffers,
  acceptOffer,
  rejectOffer,
  type InterviewOfferResponse,
} from "../../api/interviewOffer";

interface InterviewOfferPageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function InterviewOfferPage({
  initialMenu,
  onNavigate,
}: InterviewOfferPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { activeMenu, handleMenuClick } = usePageNavigation(
    "offer",
    initialMenu || "offer-sub-2",
    onNavigate,
  );

  const { user } = useAuth();
  const [offers, setOffers] = useState<InterviewOfferResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ [수정 2] 필터 상태 추가 (기본값: 전체)
  const [filterStatus, setFilterStatus] = useState("ALL");

  // ✅ 면접 제안 로드 (전체 내역 가져오기)
  useEffect(() => {
    if (user?.userId) {
      loadOffers();
    }
  }, [user?.userId]);

  const loadOffers = async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    try {
      // ✅ [수정 3] getMyOffers 사용하여 모든 상태(수락/거절 포함)의 제안을 가져옴
      const data = await getMyOffers(user.userId);
      setOffers(data);
      console.log("면접 제안 로드 성공:", data);
    } catch (error) {
      console.error("면접 제안 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      setSelectedOfferId(Number(idParam));
    } else {
      setSelectedOfferId(null);
    }
  }, [searchParams]);

  const handleOfferClick = (id: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("id", id.toString());
    setSearchParams(newParams);
  };

  const handleBackToList = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("id");
    setSearchParams(newParams);
  };

  const handleAccept = async (offerId: number) => {
    if (!user?.userId) return;
    if (window.confirm("면접 제안을 수락하시겠습니까?")) {
      try {
        await acceptOffer(offerId, user.userId);
        alert("면접 제안을 수락했습니다.");
        loadOffers();
        handleBackToList();
      } catch (error) {
        console.error("면접 수락 실패:", error);
        alert("면접 수락에 실패했습니다.");
      }
    }
  };

  const handleReject = async (offerId: number) => {
    if (!user?.userId) return;
    if (window.confirm("면접 제안을 거절하시겠습니까?")) {
      try {
        await rejectOffer(offerId, user.userId);
        alert("면접 제안을 거절했습니다.");
        loadOffers();
        handleBackToList();
      } catch (error) {
        console.error("면접 거절 실패:", error);
        alert("면접 거절에 실패했습니다.");
      }
    }
  };

  const selectedOffer = offers.find((o) => o.offerId === selectedOfferId);

  const getStatusText = (status: string) => {
    switch (status) {
      case "OFFERED":
        return "제안됨";
      case "ACCEPTED":
        return "수락함";
      case "REJECTED":
        return "거절함";
      case "SCHEDULED":
        return "면접예정";
      case "COMPLETED":
        return "면접완료";
      case "CANCELED":
        return "제안취소";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ✅ [수정 4] 필터링 로직 구현
  const filteredOffers = offers.filter((offer) => {
    if (filterStatus === "ALL") return true;
    return offer.interviewStatus === filterStatus;
  });

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <h2 className="inline-block mb-6 text-2xl font-bold">제안 현황</h2>
      <div className="flex gap-6">
        <OfferSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        <div className="flex-1">
          <div className="mb-6">
            {/* ✅ [수정 5] 헤더에 드롭다운 필터 추가 */}
            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-blue-600">
              <h3 className="text-lg font-bold text-blue-600">
                받은 면접 제안
              </h3>

              {/* 목록 화면일 때만 필터 보여주기 */}
              {!selectedOfferId && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">전체 보기</option>
                  <option value="OFFERED">대기중 (제안됨)</option>
                  <option value="ACCEPTED">수락함</option>
                  <option value="REJECTED">거절함</option>
                </select>
              )}
            </div>

            {selectedOfferId && selectedOffer ? (
              // 🟦 상세 화면 (기존 코드 유지)
              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">
                        {selectedOffer.companyName} - {selectedOffer.jobTitle}
                      </h2>
                      <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                        {getStatusText(selectedOffer.interviewStatus)}
                      </span>
                    </div>
                    <p className="text-gray-500">{selectedOffer.jobCategory}</p>
                  </div>
                  <button
                    onClick={handleBackToList}
                    className="px-6 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    목록으로
                  </button>
                </div>

                <div className="mb-8 space-y-6">
                  <div className="p-6 border border-blue-200 bg-blue-50 rounded-xl">
                    <h3 className="mb-2 font-bold text-gray-900">
                      💼 면접 제안
                    </h3>
                    <p className="leading-relaxed text-gray-700">
                      {selectedOffer.companyName}에서 귀하에게 면접 기회를
                      제안합니다.{" "}
                      {selectedOffer.offerType === "FROM_APPLICATION"
                        ? "지원하신 공고에 대한 면접을 진행하고자 합니다."
                        : "인재검색을 통해 귀하의 프로필을 보고 면접을 제안합니다."}
                    </p>
                  </div>
                  {/* ... 상세 정보 표시 (기존 유지) ... */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <span className="block mb-1 text-sm text-gray-500">
                        제안일
                      </span>
                      <span className="font-medium">
                        {formatDate(selectedOffer.offeredAt)}
                      </span>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <span className="block mb-1 text-sm text-gray-500">
                        직무
                      </span>
                      <span className="font-medium">
                        {selectedOffer.jobCategory}
                      </span>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <span className="block mb-1 text-sm text-gray-500">
                        제안 유형
                      </span>
                      <span className="font-medium">
                        {selectedOffer.offerType === "FROM_APPLICATION"
                          ? "일반 지원 후 제안"
                          : "기업 먼저 제안"}
                      </span>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <span className="block mb-1 text-sm text-gray-500">
                        현재 상태
                      </span>
                      <span className="font-medium">
                        {getStatusText(selectedOffer.interviewStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  {selectedOffer.interviewStatus === "OFFERED" ? (
                    <>
                      <button
                        onClick={() => handleReject(selectedOffer.offerId)}
                        className="px-6 py-3 font-semibold text-red-600 transition rounded-lg bg-red-50 hover:bg-red-100"
                      >
                        거절하기
                      </button>
                      <button
                        onClick={() => handleAccept(selectedOffer.offerId)}
                        className="px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                      >
                        수락하기
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-500">
                      이 제안은 이미{" "}
                      {getStatusText(selectedOffer.interviewStatus)} 상태입니다.
                    </p>
                  )}
                </div>
              </section>
            ) : (
              // 🟦 목록 화면 (필터링 적용됨)
              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* ✅ [수정 6] filteredOffers 사용 */}
                    {filteredOffers.length === 0 ? (
                      <div className="py-12 text-center text-gray-500 border-2 border-dashed rounded-xl">
                        해당하는 면접 제안이 없습니다.
                      </div>
                    ) : (
                      filteredOffers.map((offer) => (
                        <div
                          key={offer.offerId}
                          onClick={() => handleOfferClick(offer.offerId)}
                          onMouseEnter={() => setHoveredId(offer.offerId)}
                          onMouseLeave={() => setHoveredId(null)}
                          className={`p-4 bg-white border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                            hoveredId === offer.offerId
                              ? "border-blue-500 shadow-md transform scale-[1.01]"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`transition-all ${
                                  hoveredId === offer.offerId
                                    ? "text-xl font-bold text-gray-900"
                                    : "text-lg font-semibold text-gray-800"
                                }`}
                              >
                                {offer.companyName} - {offer.jobTitle}
                              </h4>
                              <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-100">
                                {getStatusText(offer.interviewStatus)}
                              </span>
                              {offer.offerType === "COMPANY_INITIATED" && (
                                <span className="px-2 py-0.5 text-xs font-medium text-green-600 bg-green-50 rounded-md border border-green-100">
                                  기업 제안
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {offer.jobCategory} |{" "}
                              {formatDate(offer.offeredAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
