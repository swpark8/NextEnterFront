import { useState } from "react";
import Footer from "../components/Footer";

interface BusinessCreditPageProps {
  onLogoClick?: () => void;
  onChargeClick?: () => void;
}

export default function BusinessCreditPage({ onLogoClick, onChargeClick }: BusinessCreditPageProps) {
  const [currentCredit] = useState(4200);

  const recommendedApplicants = [
    { name: "김0연", age: "23세", field: "무경력", cost: 50 },
    { name: "송0서", age: "30세", field: "2년", cost: 110 },
    { name: "유0현", age: "28세", field: "1년", cost: 80 },
    { name: "서0민", age: "36세", field: "7년", cost: 400 }
  ];

  const appliedCandidates = [
    { name: "이0영", age: "32세", status: "신입의 마음가짐으로..." },
    { name: "고0영", age: "41세", status: "15년 이상의 경력..." }
  ];

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      console.log("메인 페이지로 이동");
    }
  };

  const handleChargeClick = () => {
    if (onChargeClick) {
      onChargeClick();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold text-blue-600">Next </span>
              <span className="text-2xl font-bold text-blue-800">Enter</span>
            </div>

            {/* 네비게이션 */}
            <nav className="flex space-x-8">
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">■ 채용공고</button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">자료</button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">홍보</button>
            </nav>

            {/* 오른쪽 버튼 */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">로그인</button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">회원가입</button>
              <button
                onClick={handleLogoClick}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-4 py-8 mx-auto max-w-7xl">
        {/* 타이틀 & 충전 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xl">
              🪙
            </div>
            <h1 className="text-3xl font-bold text-blue-600">보유 크레딧</h1>
          </div>
          <button 
            onClick={handleChargeClick}
            className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center space-x-2"
          >
            <span>+</span>
            <span>충전하기</span>
          </button>
        </div>

        {/* 크레딧 카드 */}
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="text-xl font-semibold mb-2">NEXT ENTER님의 현재 사용 가능 크레딧</div>
            </div>
            <div className="bg-white rounded-full px-10 py-5 flex items-center space-x-3 shadow-lg">
              <span className="text-5xl font-bold text-gray-900">{currentCredit.toLocaleString()}</span>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl">
                🪙
              </div>
            </div>
          </div>
        </div>

        {/* 그리드 레이아웃 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 왼쪽 상단: 추천 지원자에게 연락 보내기 */}
          <div className="bg-white border-3 border-blue-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl">⭐</span>
              <h2 className="text-xl font-bold text-gray-900">추천 지원자에게 연락 보내기</h2>
            </div>
            <div className="overflow-hidden border-2 border-blue-300 rounded-xl">
              <table className="w-full">
                <tbody className="divide-y divide-blue-200">
                  {recommendedApplicants.map((candidate, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">{candidate.name}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700">{candidate.age}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700">{candidate.field}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xl">🪙</span>
                          <span className="font-bold text-gray-900 text-lg">{candidate.cost}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 오른쪽 상단: 내가 올린 공고 보기 */}
          <div className="bg-white border-3 border-blue-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <h2 className="text-xl font-bold text-gray-900">내가 올린 공고 보기</h2>
              </div>
              <button className="text-purple-600 text-3xl font-bold hover:text-purple-700">+</button>
            </div>
            <div className="bg-gray-50 border-3 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">NEXT ENTER 인재 공고</h3>
              </div>
              <div className="text-gray-500 text-base">
                내용
              </div>
            </div>
          </div>

          {/* 왼쪽 하단: 크레딧은 어디에 쓸 수 있나요? */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="border-l-4 border-red-500 pl-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900">크레딧은 어디에 쓸 수 있나요?</h3>
            </div>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base">
              <li></li>
              <li></li>
              <li></li>
            </ol>
          </div>

          {/* 오른쪽 하단: 지원한 인재 */}
          <div className="bg-white border-3 border-blue-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl">👤</span>
              <h2 className="text-xl font-bold text-gray-900">지원한 인재</h2>
            </div>
            <div className="overflow-hidden border-2 border-blue-300 rounded-xl">
              <table className="w-full">
                <tbody className="divide-y divide-blue-200">
                  {appliedCandidates.map((candidate, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">{candidate.name}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700">{candidate.age}</td>
                      <td className="px-6 py-4 text-gray-700 truncate max-w-xs">{candidate.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
