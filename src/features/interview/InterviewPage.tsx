import { useState } from "react";
import Footer from "../../components/Footer";
import InterviewSidebar from "./components/InterviewSidebar";
import InterviewChatPage from "./components/InterviewChatPage";

export default function InterviewPage() {
  const [activeMenu, setActiveMenu] = useState("interview");
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
    // 확인 다이얼로그 표시
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

  const handleBackToPreparation = () => {
    setIsInterviewStarted(false);
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
    { id: 1, title: "1회차 - 주니어 합격(93점)", color: "text-green-600" },
    { id: 2, title: "1회차 - 주니어 합격(88점)", color: "text-green-600" },
    { id: 3, title: "1회차 - 시니어 불합격(67점)", color: "text-red-600" },
    { id: 4, title: "1회차 - 주니어 합격(79점)", color: "text-green-600" },
  ];

  // 면접이 시작되면 채팅 화면 표시
  if (isInterviewStarted) {
    return (
      <InterviewChatPage
        onBack={handleBackToPreparation}
        level={selectedLevel}
      />
    );
  }

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

      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          {/* 목록 헤더 및 크레딧 표시 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="inline-block pb-2 text-2xl font-bold text-blue-600 border-b-4 border-blue-600">
              목록
            </h1>
            <button
              onClick={handleCreditClick}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
            >
              <span>💳</span>
              <span>보유 크레딧 : {currentCredit}</span>
            </button>
          </div>

          {/* AI 모의 면접 타이틀 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
              <span className="text-2xl">🎤</span>
            </div>
            <h2 className="text-2xl font-bold">AI 모의 면접</h2>
          </div>

          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <InterviewSidebar
              activeMenu={activeMenu}
              onMenuClick={setActiveMenu}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 space-y-6">
              {/* 면접 설정 카드 */}
              <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                <h3 className="mb-4 text-lg font-bold">면접 설정</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => handleLevelClick("junior")}
                    className={`p-6 rounded-xl border-2 transition ${
                      selectedLevel === "junior"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    <div className="mb-1 text-lg font-bold">주니어</div>
                    <div className="text-sm text-gray-600">0~3년 경력</div>
                    <div className="text-sm text-blue-600">
                      (- 10 크레딧 차감)
                    </div>
                  </button>

                  <button
                    onClick={() => handleLevelClick("senior")}
                    className={`p-6 rounded-xl border-2 transition ${
                      selectedLevel === "senior"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    <div className="mb-1 text-lg font-bold">시니어</div>
                    <div className="text-sm text-gray-600">4년 이상 경력</div>
                    <div className="text-sm text-blue-600">
                      (- 20 크레딧 차감)
                    </div>
                  </button>
                </div>

                {/* 면접 시작 박스 */}
                <div className="p-8 text-center text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
                  <div className="mb-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/20">
                      <span className="text-4xl">💬</span>
                    </div>
                  </div>
                  <p className="mb-6 text-lg leading-relaxed">
                    AI 면접관과 실전 같은 면접을 경험하세요
                    <br />
                    난이도를 선택하고 시작 버튼을 눌러주세요
                  </p>
                  <button
                    onClick={handleStartInterview}
                    className="px-8 py-3 text-lg font-bold text-blue-600 transition bg-white rounded-full hover:bg-blue-50"
                  >
                    면접 시작하기
                  </button>
                </div>
              </div>

              {/* 크레딧 사용 내역 */}
              <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                <h3 className="mb-4 text-lg font-bold">크레딧 사용 내역</h3>
                <div className="space-y-3">
                  {creditUsages.map((usage) => (
                    <button
                      key={usage.id}
                      onClick={() => handleCreditUsageClick(usage.id)}
                      className="w-full p-4 text-left transition border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50"
                    >
                      <div className="mb-1 font-semibold">{usage.title}</div>
                      <div className="text-sm text-gray-500">{usage.date}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 오른쪽 사이드 */}
            <div className="space-y-6 w-80">
              {/* 면접 통계 */}
              <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                <h3 className="mb-4 text-lg font-bold">면접 통계</h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-4 text-center border-2 border-blue-300 rounded-lg">
                    <div className="mb-1 text-sm text-gray-600">최고 점수</div>
                    <div className="text-3xl font-bold text-green-600">
                      93점
                    </div>
                  </div>
                  <div className="p-4 text-center border-2 border-blue-300 rounded-lg">
                    <div className="mb-1 text-sm text-gray-600">최저 점수</div>
                    <div className="text-3xl font-bold text-red-600">67점</div>
                  </div>
                </div>

                <div className="p-4 text-center border-2 border-blue-300 rounded-lg">
                  <div className="mb-1 text-sm text-gray-600">평균 점수</div>
                  <div className="text-3xl font-bold text-blue-600">82점</div>
                </div>
              </div>

              {/* 최근 면접 기록 */}
              <div className="p-6 bg-white border-2 border-blue-400 rounded-2xl">
                <h3 className="mb-4 text-lg font-bold">최근 면접 기록</h3>

                <div className="space-y-3">
                  {recentInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-3 border-2 border-gray-200 rounded-lg"
                    >
                      <div className={`font-medium ${interview.color}`}>
                        {interview.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
