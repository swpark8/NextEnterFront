import { useState } from 'react';

export default function MyPage() {
  const [resumeCount] = useState(2);

  const handleClick = (item: string) => {
    console.log(`${item} 클릭됨`);
    // 여기에 각 항목에 대한 로직 추가
  };

  const mainCards = [
    { id: 1, title: '입사\n지원\n현황', icon: '📋' },
    { id: 2, title: '모의 면접', icon: '🎤' },
    { id: 3, title: '이력서\n열람', icon: '📄' },
    { id: 4, title: 'AI\n맞춤 알람', icon: '🔔' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <aside className="w-52">
            <div className="bg-white border-2 border-purple-500 rounded-lg p-6 space-y-4">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-20 h-20 bg-gray-200 rounded-full border-2 border-blue-400 flex items-center justify-center relative">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs">
                    ✏️
                  </button>
                </div>
                <div className="px-8 py-1 border-2 border-blue-400 rounded-full">
                  <span className="text-sm">이름</span>
                </div>
              </div>

              {/* 버튼들 */}
              <button
                onClick={() => handleClick('스크랩 현황')}
                className="w-full py-3 bg-white border-2 border-blue-400 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
              >
                <span>⭐</span>
                <span className="font-medium">스크랩 현황</span>
              </button>

              <button
                onClick={() => handleClick('관심 기업')}
                className="w-full py-3 bg-white border-2 border-blue-400 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
              >
                <span>🏢</span>
                <span className="font-medium">관심 기업</span>
              </button>
            </div>
          </aside>

          {/* 메인 컨텐츠 */}
          <main className="flex-1">
            {/* 이력서 섹션 */}
            <div className="bg-white border-2 border-blue-500 rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-center mb-6">이력서</h2>
              
              <div className="grid grid-cols-4 gap-4">
                {mainCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleClick(card.title.replace(/\n/g, ' '))}
                    className="bg-white border-2 border-blue-400 rounded-lg p-6 h-32 hover:shadow-lg transition flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-3xl mb-2">{card.icon}</span>
                    <span className="text-sm font-medium text-center whitespace-pre-line">
                      {card.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 내 이력서 섹션 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📁</span>
                <h3 className="text-lg font-bold">내 이력서 ({resumeCount}개) &gt;</h3>
              </div>

              <div className="space-y-4">
                {/* 이력서 목록 카드 1 */}
                <div className="bg-white border-2 border-blue-400 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold">이력서 목록</h4>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm">
                        수정
                      </button>
                      <button className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition">
                        이력서 공개
                      </button>
                    </div>
                  </div>
                </div>

                {/* 이력서 목록 카드 2 */}
                <div className="bg-white border-2 border-blue-400 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold">이력서 목록</h4>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm">
                        수정
                      </button>
                      <button className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition">
                        이력서 공개
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
