import { useState } from "react";
import InterviewSidebar from "./components/InterviewSidebar";
import InterviewChatPage from "./components/InterviewChatPage";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import MockInterviewResultPage from "./components/MockInterviewResultPage";
import MockInterviewHistoryPage from "./components/MockInterviewHistoryPage";

interface InterviewPageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function InterviewPage({
  initialMenu,
  onNavigate,
}: InterviewPageProps) {
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "interview",
    initialMenu,
    onNavigate
  );
  const [selectedLevel, setSelectedLevel] = useState<"junior" | "senior">(
    "junior"
  );
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentCredit, setCurrentCredit] = useState(200);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleCreditClick = () => {
    console.log("보유 크레딧 클릭됨");
  };

  const handleStartInterview = () => {
    const requiredCredit = selectedLevel === "junior" ? 10 : 20;
    if (currentCredit < requiredCredit) {
      alert("크레딧이 부족합니다!");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmInterview = () => {
    const creditCost = selectedLevel === "junior" ? 10 : 20;
    console.log(
      `${selectedLevel} 면접 시작하기 클릭됨, 크레딧 ${creditCost} 차감`
    );
    setCurrentCredit(currentCredit - creditCost);
    setIsInterviewStarted(true);
    setShowConfirmDialog(false);
  };

  const handleCancelInterview = () => {
    setShowConfirmDialog(false);
  };

  const handleLevelClick = (level: "junior" | "senior") => {
    setSelectedLevel(level);
    console.log(`${level} 선택됨`);
  };

  const handleCreditUsageClick = (id: number) => {
    console.log(`크레딧 사용 내역 ${id} 클릭됨`);
  };

  const creditUsages = [
    { id: 1, title: "AI 모의 면접 (주니어 차감 - 10)", date: "2025.12.15" },
    { id: 2, title: "AI 모의 면접 (시니어 차감 - 20)", date: "2024.12.10" },
  ];

  const recentInterviews = [
    {
      id: 1,
      title: "Frontend 개발자 모의 면접",
      color: "text-blue-600",
      date: "2025.12.20",
    },
    {
      id: 2,
      title: "Backend 개발자 모의 면접",
      color: "text-green-600",
      date: "2025.12.18",
    },
  ];

  // ============================================
  // 서브메뉴별 페이지 렌더링
  // ============================================

  // interview-sub-2: 모의면접 진행 (채팅 화면)
  if (activeMenu === "interview-sub-2" || isInterviewStarted) {
    return (
      <InterviewChatPage
        onBack={() => {
          setIsInterviewStarted(false);
          handleMenuClick("interview-sub-1");
        }}
        level={selectedLevel}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
      />
    );
  }

  // interview-sub-3: 면접 결과 (통계 + 점수 목록)
  if (activeMenu === "interview-sub-3") {
    return (
      <MockInterviewResultPage
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        onNavigateToInterview={() => handleMenuClick("interview-sub-1")}
      />
    );
  }

  // interview-sub-4: 면접 히스토리 (Q&A 상세)
  if (activeMenu === "interview-sub-4") {
    return (
      <MockInterviewHistoryPage
        interviewId={1}
        onBack={() => handleMenuClick("interview-sub-3")}
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
      />
    );
  }

  // interview-sub-1 또는 기본: 모의면접 시작
  return (
    <>
      {/* 확인 다이얼로그 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-2xl">
            <div className="mb-6 text-center">
              <div className="mb-4 text-5xl">💳</div>
              <h3 className="mb-4 text-2xl font-bold">
                정말 크레딧을 사용하시겠습니까?
              </h3>
              <p className="mt-2 text-gray-500">
                {selectedLevel === "junior" ? "주니어" : "시니어"} 면접에 크레딧{" "}
                {selectedLevel === "junior" ? "10" : "20"}이 차감됩니다.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelInterview}
                className="flex-1 px-6 py-3 font-semibold text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                아니요
              </button>
              <button
                onClick={handleConfirmInterview}
                className="flex-1 px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h2 className="inline-block mb-6 text-2xl font-bold">모의면접</h2>

        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <InterviewSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            {/* 면접 설정 카드 */}
            <div className="p-10 bg-white border-2 border-blue-400 rounded-2xl">
              <h3 className="mb-8 text-2xl font-bold">면접 설정</h3>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <button
                  onClick={() => handleLevelClick("junior")}
                  className={`p-10 rounded-xl border-2 transition ${
                    selectedLevel === "junior"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  <div className="mb-3 text-2xl font-bold">주니어</div>
                  <div className="mb-2 text-base text-gray-600">0~3년 경력</div>
                  <div className="text-base text-blue-600">
                    (- 10 크레딧 차감)
                  </div>
                </button>

                <button
                  onClick={() => handleLevelClick("senior")}
                  className={`p-10 rounded-xl border-2 transition ${
                    selectedLevel === "senior"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  <div className="mb-3 text-2xl font-bold">시니어</div>
                  <div className="mb-2 text-base text-gray-600">
                    4년 이상 경력
                  </div>
                  <div className="text-base text-blue-600">
                    (- 20 크레딧 차감)
                  </div>
                </button>
              </div>

              {/* 면접 시작 박스 */}
              <div className="p-12 text-center text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
                <div className="mb-6">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-white/20">
                    <span className="text-5xl">💬</span>
                  </div>
                </div>
                <p className="mb-8 text-xl leading-relaxed">
                  AI 면접관과 실전 같은 면접을 경험하세요
                  <br />
                  난이도를 선택하고 시작 버튼을 눌러주세요
                </p>
                <button
                  onClick={handleStartInterview}
                  className="px-10 py-4 text-xl font-bold text-blue-600 transition bg-white rounded-full hover:bg-blue-50"
                >
                  면접 시작하기
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* 크레딧 사용 내역 */}
              <div className="p-8 bg-white border-2 border-blue-400 rounded-2xl">
                <h3 className="mb-6 text-xl font-bold">크레딧 사용 내역</h3>
                <div className="space-y-4">
                  {creditUsages.map((usage) => (
                    <button
                      key={usage.id}
                      onClick={() => handleCreditUsageClick(usage.id)}
                      className="w-full p-5 text-left transition border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50"
                    >
                      <div className="mb-2 text-base font-semibold">
                        {usage.title}
                      </div>
                      <div className="text-sm text-gray-500">{usage.date}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 최근 면접 기록 */}
              <div className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
                <h3 className="mb-6 text-xl font-bold">최근 면접 기록</h3>
                <div className="space-y-3">
                  {recentInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-5 transition border-2 border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div
                        className={`font-bold text-lg mb-1 ${interview.color}`}
                      >
                        {interview.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {interview.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
