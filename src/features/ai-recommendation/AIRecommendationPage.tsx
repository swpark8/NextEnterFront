import { useState } from 'react';
import AISidebar from './components/AISidebar';

export default function AIRecommendationPage() {
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedResume, setSelectedResume] = useState('');
  const [currentCredit, setCurrentCredit] = useState(200);
  const [hasRecommendations, setHasRecommendations] = useState(false);

  // 샘플 이력서 목록
  const resumes = [
    { id: '1', name: '김유연_2025 개발자 이력서' },
    { id: '2', name: '김유연_프론트엔드 포지션' },
    { id: '3', name: '김유연_풀스택 개발자' },
    { id: '4', name: '김유연_신입 개발자 이력서' },
  ];

  const handleCreditClick = () => {
    console.log('보유 크레딧 클릭됨');
  };

  const handleAIRecommend = () => {
    if (!selectedResume) {
      alert('이력서를 먼저 선택해주세요!');
      return;
    }
    if (currentCredit < 50) {
      alert('크레딧이 부족합니다!');
      return;
    }
    console.log('AI 추천 받기 클릭됨');
    setCurrentCredit(currentCredit - 50);
    setHasRecommendations(true);
    // 실제로는 API 호출
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <AISidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                  🎯
                </div>
                <h1 className="text-2xl font-bold">AI 추천 공고</h1>
              </div>
              <button
                onClick={handleCreditClick}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold flex items-center gap-2"
              >
                <span>💳</span>
                <span>보유 크레딧 : {currentCredit}</span>
              </button>
            </div>

            {/* AI 추천 카드 */}
            <div className="bg-white rounded-2xl border-2 border-blue-400 p-8 mb-6">
              <h2 className="text-xl font-bold mb-6">이력서 선택</h2>
              
              <div className="flex gap-4 items-end mb-6">
                {/* 이력서 드롭다운 */}
                <div className="flex-1">
                  <select
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl outline-none cursor-pointer text-gray-700 bg-white"
                  >
                    <option value="">이력서를 선택하세요</option>
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AI 추천 받기 버튼 */}
                <button
                  onClick={handleAIRecommend}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold flex items-center gap-2 whitespace-nowrap"
                >
                  <span>⭐</span>
                  <span>AI 추천 받기</span>
                  <span className="text-sm">(크레딧 50)</span>
                </button>
              </div>

              {/* 안내 메시지 */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-purple-700">
                  <span>💡</span>
                  <span className="font-medium">
                    선택하신 이력서를 기반으로 AI가 가장 적합한 공고 5개를 추천드립니다
                  </span>
                </div>
              </div>
            </div>

            {/* 추천 결과 영역 */}
            {!hasRecommendations ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-16 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">추천 공고가 없습니다</h3>
                <p className="text-gray-500">이력서를 선택하고 AI 추천 받기를 활용해 보세요</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">AI 추천 공고 (5개)</h2>
                
                {/* 샘플 추천 공고 카드들 */}
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        🏢
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                            매칭률 {95 - index * 2}%
                          </span>
                          <span className="text-gray-500 text-sm">추천 {index}순위</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">
                          {index === 1 && '프론트엔드 개발자 (React/TypeScript)'}
                          {index === 2 && '풀스택 개발자 (Next.js)'}
                          {index === 3 && 'React 개발자 (시니어급)'}
                          {index === 4 && 'UI/UX 엔지니어'}
                          {index === 5 && 'JavaScript 개발자'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>📍 서울 강남구</span>
                          <span>💰 연봉 4,000~6,000만원</span>
                          <span>👥 경력 3~5년</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
