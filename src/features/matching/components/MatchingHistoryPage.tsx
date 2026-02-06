import { useState, useEffect } from "react";
import LeftSidebar from "../../../components/LeftSidebar";
import { useAuth } from "../../../context/AuthContext";
import { getMatchingsByUserId, MatchingHistoryDTO } from "../../../api/matching";

interface MatchingHistoryPageProps {
  onBackToMatching: () => void;
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
}

export default function MatchingHistoryPage({
  onBackToMatching,
  activeMenu,
  onMenuClick,
}: MatchingHistoryPageProps) {
  const { user } = useAuth();
  
  // ✅ API에서 가져온 실제 히스토리 데이터
  const [matchingHistory, setMatchingHistory] = useState<MatchingHistoryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 페이지 진입 시 스크롤을 상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ✅ userId로 매칭 히스토리 조회
  useEffect(() => {
    const fetchMatchingHistory = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }

      try {
        const userIdNum = typeof user.userId === "string" 
          ? parseInt(user.userId) 
          : user.userId;

        console.log(`🔍 [MatchingHistory] 사용자 매칭 히스토리 조회 - userId: ${userIdNum}`);
        
        const data = await getMatchingsByUserId(userIdNum);
        
        console.log(`✅ [MatchingHistory] 조회 완료 - ${data.length}개의 히스토리`);
        setMatchingHistory(data);
      } catch (error) {
        console.error("❌ [MatchingHistory] 조회 실패:", error);
        setMatchingHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingHistory();
  }, [user?.userId]);

  const getSuitabilityColor = (grade: string) => {
    switch (grade) {
      case "S":
      case "A":
        return "bg-blue-600";
      case "B":
        return "bg-yellow-600";
      case "C":
      case "F":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getSuitabilityText = (grade: string) => {
    switch (grade) {
      case "S":
        return "최우수 매칭";
      case "A":
        return "우수 매칭";
      case "B":
        return "보통 매칭";
      case "C":
        return "낮은 매칭";
      case "F":
        return "부적합";
      default:
        return "등급 미정";
    }
  };

  const getSuitabilityEmoji = (grade: string) => {
    switch (grade) {
      case "S":
      case "A":
        return "🎉";
      case "B":
        return "👍";
      case "C":
      case "F":
        return "⚠️";
      default:
        return "❓";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">매칭 히스토리</h1>
          </div>
          <div className="flex gap-6">
            <LeftSidebar activeMenu={activeMenu} onMenuClick={onMenuClick} />
            <div className="flex-1">
              <div className="p-16 text-center">
                <div className="mb-4 text-6xl">⏳</div>
                <p className="text-xl font-bold text-gray-500">로딩 중...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          {/* 상단 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">매칭 히스토리</h1>
            </div>
          </div>

          <div className="flex gap-6">
            {/* 왼쪽 사이드바 */}
            <LeftSidebar
              activeMenu={activeMenu}
              onMenuClick={onMenuClick}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 space-y-6">
              {/* 안내 메시지 */}
              <div className="p-6 border-2 border-blue-200 bg-blue-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h3 className="mb-1 font-bold text-blue-900">
                      총 {matchingHistory.length}개의 매칭 분석 기록
                    </h3>
                    <p className="text-sm text-blue-700">
                      이력서와 공고의 매칭 결과를 확인하세요
                    </p>
                  </div>
                </div>
              </div>

              {/* 히스토리 목록 - 스크롤 가능 */}
              {matchingHistory.length === 0 ? (
                <div className="p-16 text-center bg-white border-2 border-gray-200 rounded-2xl">
                  <div className="mb-4 text-6xl">📄</div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-400">
                    분석 내역이 없습니다
                  </h3>
                  <p className="mb-6 text-gray-500">
                    AI 매칭 분석을 시작하여 히스토리를 쌓아보세요
                  </p>
                  <button
                    onClick={onBackToMatching}
                    className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    AI 매칭 분석 시작하기
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                  {matchingHistory.map((history) => (
                    <div
                      key={history.matchingId}
                      className="p-6 transition bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-lg"
                    >
                      {/* 헤더 */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              매칭 ID: {history.matchingId}
                            </h3>
                            <span
                              className={`px-4 py-1 text-white text-sm font-bold rounded-full ${getSuitabilityColor(
                                history.grade
                              )}`}
                            >
                              {getSuitabilityEmoji(history.grade)}{" "}
                              {getSuitabilityText(history.grade)}
                            </span>
                            <span className="px-3 py-1 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full">
                              {history.matchingType === "AI_RECOMMEND" ? "AI 추천" : "수동 매칭"}
                            </span>
                          </div>
                          <p className="mb-2 text-sm text-gray-600">
                            이력서 ID: {history.resumeId} | 공고 ID: {history.jobId}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>📅 {formatDate(history.createdAt)}</span>
                            <span>🕐 {formatTime(history.createdAt)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="mb-1 text-sm text-gray-600">
                            매칭 등급
                          </div>
                          <div
                            className={`text-4xl font-bold ${
                              history.grade === "S" || history.grade === "A"
                                ? "text-green-600"
                                : history.grade === "B"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {history.grade}
                          </div>
                        </div>
                      </div>

                      {/* 적합성 메시지 */}
                      <div
                        className={`p-4 mb-4 rounded-lg text-white font-semibold text-center ${getSuitabilityColor(
                          history.suitable
                        )}`}
                      >
                        이 공고에 지원하기{" "}
                        <span className="text-xl">
                          {getSuitabilityText(history.suitable)}
                        </span>
                        합니다!
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* 하단 버튼 - 히스토리가 있을 때만 표시 */}
              {matchingHistory.length > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={onBackToMatching}
                    className="px-8 py-4 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    AI 매칭 분석 시작 페이지로 돌아가기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}