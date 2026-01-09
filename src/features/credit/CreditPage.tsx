import { useState } from "react";
import CreditSidebar from "./components/CreditSidebar";

interface CreditPageProps {
  onLogoClick?: () => void;
  onCharge?: () => void;
}

export default function CreditPage({ onLogoClick, onCharge }: CreditPageProps) {
  const [currentCredit] = useState(505);
  const [expiringMileage] = useState(0);
  const [activeTab, setActiveTab] = useState<"coupon" | "usage" | "mileage">(
    "coupon"
  );
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
    console.log("충전하기 클릭됨");
    if (onCharge) {
      onCharge();
    }
  };

  const handleJobClick = () => {
    console.log("삼성전자 공고 클릭됨");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 text-xl text-white bg-orange-400 rounded-full">
              💳
            </div>
            <h1 className="text-2xl font-bold">보유 크레딧</h1>
          </div>
          <button
            onClick={handlePromote}
            className="flex items-center gap-2 px-6 py-2 text-blue-600 transition border-2 border-blue-500 rounded-lg hover:bg-blue-50"
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
            <div className="p-8 mb-6 text-white bg-gradient-to-r from-purple-500 via-purple-400 to-cyan-400 rounded-2xl">
              <h2 className="mb-6 text-xl">김유연님의 현재 사용 가능 크레딧</h2>
              <div className="flex items-center justify-end gap-3 mb-4">
                <span className="text-6xl font-bold">{currentCredit}</span>
                <div className="flex items-center justify-center w-12 h-12 text-2xl bg-orange-400 rounded-full">
                  💳
                </div>
              </div>
              <div className="flex justify-end">
                <div className="px-4 py-2 text-sm text-gray-700 rounded-full bg-white/90">
                  30일 이내 소멸 가능 마일리지 {expiringMileage}M
                </div>
              </div>
            </div>

            {/* 탭 */}
            <div className="overflow-hidden bg-white border-2 border-gray-200 rounded-2xl">
              <div className="flex border-b-2 border-gray-200">
                {["coupon", "usage", "mileage"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() =>
                      setActiveTab(tab as "coupon" | "usage" | "mileage")
                    }
                    className={`flex-1 py-4 font-semibold transition ${
                      activeTab === tab
                        ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab === "coupon" && "쿠폰 목록"}
                    {tab === "usage" && "쿠폰 이용 내역"}
                    {tab === "mileage" && "마일리지 내역"}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "coupon" && (
                  <div className="space-y-3">
                    {coupons.map((coupon) => (
                      <button
                        key={coupon.id}
                        onClick={() => handleCouponClick(coupon.id)}
                        className="w-full px-6 py-4 font-semibold text-left text-blue-600 transition bg-blue-100 rounded-lg hover:bg-blue-200"
                      >
                        {coupon.label}
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === "usage" && (
                  <div className="py-12 text-center text-gray-500">
                    최근 사용 목록이 없습니다
                  </div>
                )}

                {activeTab === "mileage" && (
                  <div className="py-6">
                    <div className="p-4 text-center rounded-lg bg-gray-50">
                      <span className="text-gray-600">총</span>
                      <span className="mx-2 text-2xl font-bold text-blue-600">
                        4.5
                      </span>
                      <span className="text-gray-600">적립</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div className="p-6 mt-6 bg-white border-2 border-gray-200 rounded-2xl">
              <div className="pl-4 mb-4 border-l-4 border-red-400">
                <h3 className="text-lg font-bold">
                  크레딧은 어디에 쓸 수 있나요?
                </h3>
              </div>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>AI 이력서 분석 및 개선 제안</li>
                <li>매칭 분석 서비스 이용</li>
                <li>AI 모의 면접 진행</li>
              </ol>
            </div>
          </div>

          {/* 오른쪽 사이드 */}
          <div className="w-80">
            <div className="sticky p-6 bg-white border-2 border-blue-400 rounded-2xl top-8">
              <div className="flex items-center gap-2 mb-4">
                <span>⭐</span>
                <h3 className="text-lg font-bold">지금 뜨는 공고 바로 지원</h3>
              </div>

              <button
                onClick={handleJobClick}
                className="w-full p-6 transition border-2 border-blue-300 rounded-xl hover:shadow-lg"
              >
                <div className="flex items-center justify-center h-40 mb-4 border-2 border-blue-300 border-dashed rounded-lg">
                  <span className="text-4xl">🏢</span>
                </div>
                <h4 className="mb-4 text-xl font-bold text-center">삼성전자</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>
                    어쩌고 저쩌고 구릅니다 사람 지원 명이 블라드크럽으
                    하라라라랄
                  </div>
                  <div className="mt-3 space-y-1">
                    <div>당담자 : 송진우</div>
                    <div>연락처 : 010-1234-5678</div>
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
