import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import OfferSidebar from "./components/OfferSidebar";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { getReceivedContacts, ContactMessage, updateContactStatus } from "../../api/contact";
import { getMyApplies, updateInterviewStatus, type ApplyListResponse } from "../../api/apply";

interface InterviewOfferPageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function InterviewOfferPage({
  initialMenu,
  onNavigate,
}: InterviewOfferPageProps) {
  // ✅ 2. URL 파라미터 훅 사용
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. 네비게이션 훅
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "offer",
    initialMenu || "offer-sub-2",
    onNavigate
  );

  // 2. 상태 관리
  const { user } = useAuth();
  const { interviewOffers, deleteInterviewOffer } = useApp();
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [interviewRequests, setInterviewRequests] = useState<ApplyListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 3. 연락 메시지 및 면접 요청 로드
  useEffect(() => {
    if (user?.userId) {
      loadContactMessages();
      loadInterviewRequests();
    }
  }, [user?.userId]);

  const loadContactMessages = async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    try {
      const data = await getReceivedContacts(user.userId);
      setContactMessages(data);
      console.log("연락 메시지 로드 성공:", data);
    } catch (error) {
      console.error("연락 메시지 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInterviewRequests = async () => {
    if (!user?.userId) return;

    try {
      const applies = await getMyApplies(user.userId);
      const requests = applies.filter(apply => apply.interviewStatus === "REQUESTED");
      setInterviewRequests(requests);
      console.log("면접 요청 로드 성공:", requests);
    } catch (error) {
      console.error("면접 요청 로드 실패:", error);
    }
  };

  // 4. 상태 관리
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // URL 변경 감지 -> 화면 전환 (목록 <-> 상세)
  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      setSelectedOfferId(Number(idParam));
    } else {
      setSelectedOfferId(null);
    }
  }, [searchParams]);

  // 클릭 시 URL에 id 추가
  const handleOfferClick = (id: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("id", id.toString());
    setSearchParams(newParams);
  };

  // 목록으로 돌아가기 (URL에서 id 제거)
  const handleBackToList = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("id");
    setSearchParams(newParams);
  };

  // 5. 핸들러
  const handleAcceptContact = async (contactId: number) => {
    if (!user?.userId) return;

    if (window.confirm("면접 제안을 수락하시겠습니까?")) {
      try {
        await updateContactStatus(contactId, "ACCEPTED", user.userId);
        alert("면접 제안을 수락했습니다.");
        loadContactMessages(); // 새로고침
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경에 실패했습니다.");
      }
    }
  };

  const handleRejectContact = async (contactId: number) => {
    if (!user?.userId) return;

    if (window.confirm("면접 제안을 거절하시겠습니까?")) {
      try {
        await updateContactStatus(contactId, "REJECTED", user.userId);
        alert("면접 제안을 거절했습니다.");
        loadContactMessages(); // 새로고침
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경에 실패했습니다.");
      }
    }
  };

  const handleAcceptInterview = async (applyId: number) => {
    if (!user?.userId) return;

    if (window.confirm("면접 요청을 수락하시겠습니까?")) {
      try {
        await updateInterviewStatus(applyId, user.userId, "ACCEPTED");
        alert("면접 요청을 수락했습니다.");
        loadInterviewRequests();
        handleBackToList();
      } catch (error) {
        console.error("면접 수락 실패:", error);
        alert("면접 수락에 실패했습니다.");
      }
    }
  };

  const handleRejectInterview = async (applyId: number) => {
    if (!user?.userId) return;

    if (window.confirm("면접 요청을 거절하시겠습니까?")) {
      try {
        await updateInterviewStatus(applyId, user.userId, "REJECTED");
        alert("면접 요청을 거절했습니다.");
        loadInterviewRequests();
        handleBackToList();
      } catch (error) {
        console.error("면접 거절 실패:", error);
        alert("면접 거절에 실패했습니다.");
      }
    }
  };

  const handleDelete = (id: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 카드 클릭 방지
    if (window.confirm("제안을 삭제하시겠습니까?")) {
      deleteInterviewOffer(id);
      // 만약 보고 있는 제안을 삭제했다면 목록으로 나가기
      if (selectedOfferId === id) {
        handleBackToList();
      }
    }
  };

  const selectedOffer = interviewOffers.find((o) => o.id === selectedOfferId);
  const selectedContact = contactMessages.find((c) => c.contactId === selectedOfferId);
  const selectedInterview = interviewRequests.find((r) => r.applyId === selectedOfferId);

  // 상태 한글 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "ACCEPTED":
        return "수락";
      case "REJECTED":
        return "거절";
      default:
        return status;
    }
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

            {selectedOfferId && (selectedOffer || selectedContact || selectedInterview) ? (
              // 🟦 상세 화면
              selectedContact ? (
                // 연락 메시지 상세
                <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold">기업 연락 제안</h2>
                        <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                          {getStatusText(selectedContact.status)}
                        </span>
                      </div>
                      <p className="text-gray-500">
                        {formatDate(selectedContact.createdAt)}
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
                        📩 연락 메시지
                      </h3>
                      <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <span className="block mb-1 text-sm text-gray-500">
                          제안일
                        </span>
                        <span className="font-medium">
                          {formatDate(selectedContact.createdAt)}
                        </span>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <span className="block mb-1 text-sm text-gray-500">
                          상태
                        </span>
                        <span className="font-medium">
                          {getStatusText(selectedContact.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    {selectedContact.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleRejectContact(selectedContact.contactId)}
                          className="px-6 py-3 font-semibold text-red-600 transition rounded-lg bg-red-50 hover:bg-red-100"
                        >
                          거절하기
                        </button>
                        <button
                          onClick={() => handleAcceptContact(selectedContact.contactId)}
                          className="px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                        >
                          수락하기
                        </button>
                      </>
                    )}
                    {selectedContact.status !== "PENDING" && (
                      <p className="text-gray-500">
                        이 제안은 이미 {getStatusText(selectedContact.status)}했습니다.
                      </p>
                    )}
                  </div>
                </section>
              ) : selectedInterview ? (
                // 면접 요청 상세
                <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold">
                          {selectedInterview.companyName} - {selectedInterview.jobTitle}
                        </h2>
                        <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                          면접 요청
                        </span>
                      </div>
                      <p className="text-gray-500">
                        {selectedInterview.jobCategory}
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
                    <div className="p-6 border border-blue-200 bg-blue-50 rounded-xl">
                      <h3 className="mb-2 font-bold text-gray-900">
                        💼 면접 제안
                      </h3>
                      <p className="leading-relaxed text-gray-700">
                        {selectedInterview.companyName}에서 귀하에게 면접 기회를 제안합니다. 지원하신 {selectedInterview.jobTitle} 포지션에 대한 면접을 진행하고자 합니다.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <span className="block mb-1 text-sm text-gray-500">
                          지원일
                        </span>
                        <span className="font-medium">{formatDate(selectedInterview.appliedAt)}</span>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <span className="block mb-1 text-sm text-gray-500">
                          직무
                        </span>
                        <span className="font-medium">
                          {selectedInterview.jobCategory}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 mb-6 text-sm text-gray-600 bg-white border border-blue-200 rounded-lg">
                    <p>💡 <strong>안내:</strong></p>
                    <ul className="pl-5 mt-2 space-y-1 list-disc">
                      <li>기업이 면접을 요청한 공고에 대해 수락/거절을 결정할 수 있습니다.</li>
                      <li>수락하면 기업에게 통보되며, 면접 일정이 지정됩니다.</li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => handleRejectInterview(selectedInterview.applyId)}
                      className="px-6 py-3 font-semibold text-red-600 transition rounded-lg bg-red-50 hover:bg-red-100"
                    >
                      거절하기
                    </button>
                    <button
                      onClick={() => handleAcceptInterview(selectedInterview.applyId)}
                      className="px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                    >
                      수락하기
                    </button>
                  </div>
                </section>
              ) : selectedOffer ? (
                // 기존 면접 제안 상세
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
              ) : null
            ) : (
              // 🟦 목록 화면
              <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.length === 0 && interviewOffers.length === 0 && interviewRequests.length === 0 ? (
                      <div className="py-12 text-center text-gray-500 border-2 border-dashed rounded-xl">
                        받은 면접 제안이 없습니다.
                      </div>
                    ) : (
                      <>
                        {/* 연락 메시지 목록 */}
                        {contactMessages.map((contact) => (
                          <div
                            key={`contact-${contact.contactId}`}
                            onClick={() => handleOfferClick(contact.contactId)}
                            onMouseEnter={() => setHoveredId(contact.contactId)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`p-4 bg-white border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                              hoveredId === contact.contactId
                                ? "border-blue-500 shadow-md transform scale-[1.01]"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4
                                  className={`transition-all ${
                                    hoveredId === contact.contactId
                                      ? "text-xl font-bold text-gray-900"
                                      : "text-lg font-semibold text-gray-800"
                                  }`}
                                >
                                  기업 연락 제안
                                </h4>
                                <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-100">
                                  {getStatusText(contact.status)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {formatDate(contact.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* 면접 요청 목록 */}
                        {interviewRequests.map((request) => (
                          <div
                            key={`interview-${request.applyId}`}
                            onClick={() => handleOfferClick(request.applyId)}
                            onMouseEnter={() => setHoveredId(request.applyId)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`p-4 bg-white border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                              hoveredId === request.applyId
                                ? "border-blue-500 shadow-md transform scale-[1.01]"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4
                                  className={`transition-all ${
                                    hoveredId === request.applyId
                                      ? "text-xl font-bold text-gray-900"
                                      : "text-lg font-semibold text-gray-800"
                                  }`}
                                >
                                  {request.companyName} - {request.jobTitle}
                                </h4>
                                <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-100">
                                  면접 요청
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {request.jobCategory} | {formatDate(request.appliedAt)}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* 기존 면접 제안 목록 */}
                        {interviewOffers.map((offer) => (
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
                            {/* 회사명 */}
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
                        ))}
                      </>
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
