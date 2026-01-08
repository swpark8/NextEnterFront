import { useState } from "react";
import CreditSidebar from "./components/CreditSidebar";

export default function CreditPage() {
  const [currentCredit] = useState(505);
  const [expiringMileage] = useState(0);
  const [activeTab, setActiveTab] = useState("coupon");
  const [activeMenu, setActiveMenu] = useState("credit");

  const coupons = [
    { id: 1, discount: "10%", label: "10% 할인 쿠폰" },
    { id: 2, discount: "7%", label: "7% 할인 쿠폰" },
    { id: 3, discount: "5%", label: "5% 할인 쿠폰" },
  ];

  const handleCouponClick = (id: number) => {
    console.log(`쿠폰 ${id} 클릭됨`);
  };

  const handlePromote = () => {
    console.log("홍보하기 클릭됨");
  };

  const handleJobClick = () => {
    console.log("삼성전자 공고 클릭됨");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white text-xl">
              💳
            </div>
            <h1 className="text-2xl font-bold">보유 크레딧</h1>
          </div>
          <button
            onClick={handlePromote}
            className="px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
          >
            <span>+</span>
            <span>충전하기</span>
          </button>
        </div>

        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <CreditSidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            {/* 크레딧 카드 */}
            <div className="bg-gradient-to-r from-purple-500 via-purple-400 to-cyan-400 rounded-2xl p-8 mb-6 text-white">
              <h2 className="text-xl mb-6">김유연님의 현재 사용 가능 크레딧</h2>
              <div className="flex items-center justify-end gap-3 mb-4">
                <span className="text-6xl font-bold">{currentCredit}</span>
                <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-2xl">
                  💳
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-white/90 text-gray-700 px-4 py-2 rounded-full text-sm">
                  30일 이내 소멸 가능 마일리지 {expiringMileage}M
                </div>
              </div>
            </div>

            {/* 탭 */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
              <div className="flex border-b-2 border-gray-200">
                <button
                  onClick={() => setActiveTab("coupon")}
                  className={`flex-1 py-4 font-semibold transition ${
                    activeTab === "coupon"
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  쿠폰 목록
                </button>
                <button
                  onClick={() => setActiveTab("usage")}
                  className={`flex-1 py-4 font-semibold transition ${
                    activeTab === "usage"
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  쿠폰 이용 내역
                </button>
                <button
                  onClick={() => setActiveTab("mileage")}
                  className={`flex-1 py-4 font-semibold transition ${
                    activeTab === "mileage"
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  마일리지 내역
                </button>
              </div>

              <div className="p-6">
                {/* 쿠폰 목록 */}
                {activeTab === "coupon" && (
                  <div className="space-y-3">
                    {coupons.map((coupon) => (
                      <button
                        key={coupon.id}
                        onClick={() => handleCouponClick(coupon.id)}
                        className="w-full px-6 py-4 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition text-left"
                      >
                        {coupon.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* 쿠폰 이용 내역 */}
                {activeTab === "usage" && (
                  <div className="text-center py-12 text-gray-500">
                    최근 사용 목록이 없습니다
                  </div>
                )}

                {/* 마일리지 내역 */}
                {activeTab === "mileage" && (
                  <div className="py-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <span className="text-gray-600">총</span>
                      <span className="text-2xl font-bold text-blue-600 mx-2">
                        4.5
                      </span>
                      <span className="text-gray-600">적립</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-6 bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="border-l-4 border-red-400 pl-4 mb-4">
                <h3 className="font-bold text-lg">
                  크레딧은 어디에 쓸 수 있나요?
                </h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>AI 이력서 분석 및 개선 제안</li>
                <li>매칭 분석 서비스 이용</li>
                <li>AI 모의 면접 진행</li>
              </ol>
            </div>
          </div>

          {/* 오른쪽 사이드 - 지금 뜨는 공고 */}
          <div className="w-80">
            <div className="bg-white rounded-2xl border-2 border-blue-400 p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <span>⭐</span>
                <h3 className="font-bold text-lg">지금 뜨는 공고 바로 지원</h3>
              </div>

              <button
                onClick={handleJobClick}
                className="w-full border-2 border-blue-300 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="border-2 border-dashed border-blue-300 rounded-lg h-40 flex items-center justify-center mb-4">
                  <span className="text-4xl">🏢</span>
                </div>
                <h4 className="font-bold text-xl text-center mb-4">삼성전자</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    어쩌고 저쩌고 구릅니다 사람 지원 명이 블라드크럽으
                    하라라라랄
                  </div>
                  <div className="mt-3 space-y-1">
                    <div>당일자 : 000</div>
                    <div>연락처 : 000</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
