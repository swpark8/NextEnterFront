import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import OfferSidebar from "./components/OfferSidebar";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useAuth } from "../../context/AuthContext";
import {
  getMyOffers,
  acceptOffer,
  rejectOffer,
  deleteOffer,
  deleteOffersBulk,
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
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // 페이지네이션 및 선택 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.userId) loadOffers();
  }, [user?.userId, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]); // 필터 바뀌면 선택 초기화
  }, [filterStatus, itemsPerPage]);

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) setSelectedOfferId(Number(idParam));
    else setSelectedOfferId(null);
  }, [searchParams]);

  const loadOffers = async () => {
    if (!user?.userId) return;
    const scrollPosition = listContainerRef.current?.scrollTop || 0;
    setIsLoading(true);
    try {
      const includeDeleted = filterStatus === "DELETED" ? true : undefined;
      const data = await getMyOffers(user.userId, includeDeleted);
      setOffers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (listContainerRef.current)
          listContainerRef.current.scrollTop = scrollPosition;
      }, 0);
    }
  };

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

  // 상세 화면 액션 핸들러
  const handleAccept = async (offerId: number) => {
    if (!user?.userId) return;
    if (window.confirm("면접 제안을 수락하시겠습니까?")) {
      try {
        await acceptOffer(offerId, user.userId);
        alert("수락했습니다.");
        loadOffers();
        handleBackToList();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleReject = async (offerId: number) => {
    if (!user?.userId) return;
    if (window.confirm("면접 제안을 거절하시겠습니까?")) {
      try {
        await rejectOffer(offerId, user.userId);
        alert("거절했습니다.");
        loadOffers();
        handleBackToList();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 개별 삭제
  const handleDelete = async (offerId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.userId) return;
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await deleteOffer(offerId, user.userId);
        alert("삭제되었습니다.");
        loadOffers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 일괄 삭제
  const handleBulkDelete = async () => {
    if (!user?.userId || selectedIds.length === 0) return;
    if (window.confirm(`선택한 ${selectedIds.length}개를 삭제하시겠습니까?`)) {
      try {
        await deleteOffersBulk(selectedIds, user.userId);
        alert("일괄 삭제되었습니다.");
        setSelectedIds([]);
        loadOffers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 체크박스 토글
  const toggleSelect = (offerId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(offerId)
        ? prev.filter((id) => id !== offerId)
        : [...prev, offerId],
    );
  };

  // 전체 선택
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentIds = currentOffers.map((o) => o.offerId);
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentIds])));
    } else {
      const currentIds = currentOffers.map((o) => o.offerId);
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    }
  };

  // 데이터 필터링 & 페이지네이션
  const filteredOffers = offers.filter((offer) => {
    if (filterStatus === "DELETED") return offer.deleted === true;
    if (filterStatus === "ALL") return offer.deleted !== true;
    return offer.interviewStatus === filterStatus && offer.deleted !== true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const selectedOffer = offers.find((o) => o.offerId === selectedOfferId);

  // UI 헬퍼 함수
  const getStatusText = (status: string, finalResult?: string) => {
    switch (status) {
      case "OFFERED":
        return "면접 제안됨";
      case "ACCEPTED":
        return "면접 수락";
      case "REJECTED":
        return "거절함";
      case "SCHEDULED":
        return "결과 대기";
      case "COMPLETED":
        return finalResult === "PASSED"
          ? "합격"
          : finalResult === "REJECTED"
            ? "불합격"
            : "면접완료";
      case "CANCELED":
        return "제안취소";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string, finalResult?: string) => {
    switch (status) {
      case "OFFERED":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "ACCEPTED":
        return "text-green-700 bg-green-50 border-green-200";
      case "REJECTED":
        return "text-red-700 bg-red-50 border-red-200";
      case "SCHEDULED":
        return "text-purple-700 bg-purple-50 border-purple-200";
      default:
        return "text-gray-500 bg-gray-100 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDday = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / 86400000,
    );
    if (diff < 0) return { text: "마감", color: "text-gray-500" };
    if (diff <= 3)
      return {
        text: `D-${diff === 0 ? "day" : diff}`,
        color: "text-red-600 font-bold",
      };
    return { text: `D-${diff}`, color: "text-gray-600" };
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <h2 className="inline-block mb-6 text-2xl font-bold">제안 현황</h2>
      <div className="flex gap-6">
        <OfferSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-blue-600">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-blue-600">
                  받은 면접 제안{" "}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    총 {filteredOffers.length}건
                  </span>
                </h3>
                {selectedIds.length > 0 && !selectedOfferId && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 text-sm font-bold text-red-600 transition-colors bg-red-100 rounded hover:bg-red-200"
                  >
                    선택 삭제 ({selectedIds.length})
                  </button>
                )}
              </div>

              {!selectedOfferId && (
                <div className="flex gap-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                  >
                    <option value={10}>10개씩</option>
                    <option value={20}>20개씩</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                  >
                    <option value="ALL">전체 보기</option>
                    <option value="OFFERED">대기중</option>
                    <option value="ACCEPTED">수락함</option>
                    <option value="REJECTED">거절함</option>
                    <option value="DELETED">휴지통</option>
                  </select>
                </div>
              )}
            </div>

            {/* 전체 선택 바 (목록에서만 보임) */}
            {!selectedOfferId && currentOffers.length > 0 && (
              <div className="flex items-center px-4 py-2 mb-2 border border-gray-200 rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
                  checked={
                    currentOffers.length > 0 &&
                    currentOffers.every((o) => selectedIds.includes(o.offerId))
                  }
                  onChange={handleSelectAll}
                />
                <span className="ml-3 text-sm text-gray-600">전체 선택</span>
              </div>
            )}

            {selectedOfferId && selectedOffer ? (
              // 🟦 상세 화면 (복구됨!)
              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">
                        {selectedOffer.companyName} - {selectedOffer.jobTitle}
                      </h2>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedOffer.interviewStatus, selectedOffer.finalResult)}`}
                      >
                        {getStatusText(
                          selectedOffer.interviewStatus,
                          selectedOffer.finalResult,
                        )}
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
                    <h3 className="mb-2 font-bold text-gray-900">면접 제안</h3>
                    <p className="leading-relaxed text-gray-700">
                      {selectedOffer.companyName}에서 귀하에게 면접 기회를
                      제안합니다.{" "}
                      {selectedOffer.offerType === "FROM_APPLICATION"
                        ? "지원하신 공고에 대한 면접을 진행하고자 합니다."
                        : "인재검색을 통해 귀하의 프로필을 보고 면접을 제안합니다."}
                    </p>
                  </div>
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
                        {getStatusText(
                          selectedOffer.interviewStatus,
                          selectedOffer.finalResult,
                        )}
                      </span>
                    </div>
                    {selectedOffer.deadline && (
                      <div className="p-4 border rounded-lg">
                        <span className="block mb-1 text-sm text-gray-500">
                          마감일
                        </span>
                        <span className="font-medium">
                          {selectedOffer.deadline} (
                          {getDday(selectedOffer.deadline)?.text})
                        </span>
                      </div>
                    )}
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
                      {getStatusText(
                        selectedOffer.interviewStatus,
                        selectedOffer.finalResult,
                      )}{" "}
                      상태입니다.
                    </p>
                  )}
                </div>
              </section>
            ) : (
              // 🟦 목록 화면 (체크박스 포함)
              <section
                ref={listContainerRef}
                className="p-8 bg-white border-2 border-gray-200 rounded-2xl min-h-[500px] flex flex-col justify-between"
              >
                <div>
                  {isLoading ? (
                    <div className="py-12 text-center">로딩중...</div>
                  ) : (
                    <div className="space-y-4">
                      {currentOffers.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 border-2 border-dashed rounded-xl">
                          제안이 없습니다.
                        </div>
                      ) : (
                        currentOffers.map((offer) => (
                          <div
                            key={offer.offerId}
                            onClick={() => handleOfferClick(offer.offerId)}
                            onMouseEnter={() => setHoveredId(offer.offerId)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`p-4 bg-white border-2 rounded-lg cursor-pointer transition-all flex gap-4 items-center ${
                              hoveredId === offer.offerId
                                ? "border-blue-500 shadow-md transform scale-[1.01]"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {/* ✅ 왼쪽 체크박스 */}
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center"
                            >
                              <input
                                type="checkbox"
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
                                checked={selectedIds.includes(offer.offerId)}
                                onChange={(e) =>
                                  toggleSelect(offer.offerId, e as any)
                                }
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4
                                  className={`transition-all ${hoveredId === offer.offerId ? "text-xl font-bold text-gray-900" : "text-lg font-semibold text-gray-800"}`}
                                >
                                  {offer.companyName} - {offer.jobTitle}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getStatusColor(offer.interviewStatus, offer.finalResult)}`}
                                >
                                  {getStatusText(
                                    offer.interviewStatus,
                                    offer.finalResult,
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="font-medium">
                                  {offer.jobCategory}
                                </span>
                                <span className="text-gray-400">|</span>
                                <span>
                                  제안일: {formatDate(offer.offeredAt)}
                                </span>
                                {offer.deadline && getDday(offer.deadline) && (
                                  <span
                                    className={getDday(offer.deadline)?.color}
                                  >
                                    {" "}
                                    | 마감 {getDday(offer.deadline)?.text}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* 오른쪽 개별 삭제 */}
                            {!offer.deleted && (
                              <button
                                onClick={(e) => handleDelete(offer.offerId, e)}
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
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* 페이지네이션 */}
                {filteredOffers.length > 0 && (
                  <div className="flex items-center justify-center gap-2 pt-4 mt-8 border-t border-gray-100">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded border ${currentPage === page ? "bg-blue-600 text-white" : "bg-white"}`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      다음
                    </button>
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
