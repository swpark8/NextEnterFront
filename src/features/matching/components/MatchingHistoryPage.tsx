import { useState } from "react";
import MatchingSidebar from "./MatchingSidebar";
import { useApp } from "../../../context/AppContext";

interface MatchingHistoryPageProps {
  onBackToMatching: () => void;
  activeMenu: string; // ⭐ 추가
  onMenuClick: (menuId: string) => void; // ⭐ 추가
}

export default function MatchingHistoryPage({
  onBackToMatching,
  activeMenu, // ⭐ props로 받음
  onMenuClick, // ⭐ props로 받음
}: MatchingHistoryPageProps) {
  // ❗ 삭제: const [activeMenu] = useState("history");

  // Context에서 실제 히스토리 데이터 가져오기
  const { matchingHistory } = useApp();

  const getSuitabilityColor = (suitable: boolean) => {
    return suitable ? "bg-blue-600" : "bg-red-600";
  };

  const getSuitabilityText = (suitable: boolean) => {
    return suitable ? "적합" : "부적합";
  };

  const getSuitabilityEmoji = (suitable: boolean) => {
    return suitable ? "🎉" : "⚠️";
  };

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
            <MatchingSidebar
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
                      key={history.id}
                      className="p-6 transition bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-lg"
                    >
                      {/* 헤더 */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {history.company} - {history.position}
                            </h3>
                            <span
                              className={`px-4 py-1 text-white text-sm font-bold rounded-full ${getSuitabilityColor(
                                history.suitable
                              )}`}
                            >
                              {getSuitabilityEmoji(history.suitable)}{" "}
                              {getSuitabilityText(history.suitable)}
                            </span>
                          </div>
                          <p className="mb-2 text-sm text-gray-600">
                            이력서: {history.resume}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>📅 {history.date}</span>
                            <span>🕐 {history.time}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="mb-1 text-sm text-gray-600">
                            매칭 점수
                          </div>
                          <div
                            className={`text-4xl font-bold ${
                              history.score >= 75
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {history.score}점
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

                      {/* 기술 스택 매칭 */}
                      <div className="p-4 mb-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-700">
                          💻 기술 스택 매칭률
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(history.techMatch).map(
                            ([tech, match]) => (
                              <div
                                key={tech}
                                className="flex items-center gap-2"
                              >
                                <div className="flex-1">
                                  <div className="flex justify-between mb-1 text-xs">
                                    <span className="font-medium">{tech}</span>
                                    <span
                                      className={`font-bold ${
                                        match >= 80
                                          ? "text-green-600"
                                          : match >= 60
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {match}%
                                    </span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-200 rounded-full">
                                    <div
                                      className={`h-2 rounded-full ${
                                        match >= 80
                                          ? "bg-green-500"
                                          : match >= 60
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{ width: `${match}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* 강점과 개선사항 */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* 강점 */}
                        <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                          <h4 className="flex items-center gap-2 mb-2 text-sm font-bold text-green-700">
                            ✅ 강점
                          </h4>
                          <ul className="space-y-1">
                            {history.strengths.map((strength, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-1 text-xs text-gray-700"
                              >
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 개선사항 */}
                        <div className="p-4 border-2 border-yellow-200 rounded-lg bg-yellow-50">
                          <h4 className="flex items-center gap-2 mb-2 text-sm font-bold text-yellow-700">
                            ⚠️ 개선사항
                          </h4>
                          <ul className="space-y-1">
                            {history.improvements.map((improvement, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-1 text-xs text-gray-700"
                              >
                                <span className="text-yellow-600 mt-0.5">
                                  •
                                </span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
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
