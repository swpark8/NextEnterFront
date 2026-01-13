import { useState } from "react";
import Footer from "../components/Footer";

interface BusinessServicePageProps {
  onJobManagementClick?: () => void;
  onLogoClick?: () => void;
  onApplicantManagementClick?: () => void;
  onCreditManagementClick?: () => void;
  onAdvertisementManagementClick?: () => void;
}

export default function BusinessServicePage({ onJobManagementClick, onLogoClick, onApplicantManagementClick, onCreditManagementClick, onAdvertisementManagementClick }: BusinessServicePageProps) {
  const [activeService, setActiveService] = useState<string>("");

  const services = [
    {
      id: "announcement",
      icon: "📄",
      title: "공고 등록",
      description: "채용 정보",
      features: ["지원 확인", "지원 예약", "지원 예약"],
      onClick: onJobManagementClick
    },
    {
      id: "talent",
      icon: "👥",
      title: "인재 검색",
      description: "지원 확인",
      features: ["지원 확인", "지원 예약", "지원 예약"],
      onClick: onApplicantManagementClick
    },
    {
      id: "service",
      icon: "⭐",
      title: "광고 관리",
      description: "지원 확인",
      features: ["지원 확인", "지원 예약", "지원 예약"],
      onClick: onAdvertisementManagementClick
    },
    {
      id: "credit",
      icon: "💳",
      title: "크레딧",
      description: "크레딧 충전 및 관리",
      features: ["크레딧 충전", "사용 내역", "충전 혜택"],
      onClick: onCreditManagementClick
    }
  ];

  const products = [
    {
      id: 1,
      badge: "회원 전용 장치 프로그",
      title: "최신식 노트북",
      description: "5세대 i5 이상 PC + 개발자용 IDE | 20만원 이하 노트북",
      tags: [
        "5세대 i7 이상 표준 구매 제품",
        "구간세가 완전 로드 포함",
        "전세계와 차액 보증 조건",
        "PC 자체별 로그 소지온 어려워 보증",
        "이용자 고객 승류 소요 공예"
      ],
      seller: "M.1X1 SSD Focus 칩셋",
      period: "시부크젠 + 2윌",
      price: "250,000원"
    },
    {
      id: 2,
      badge: "5세대 i7기사 + PC 개발자용 IDD",
      title: "최신식 노트북",
      description: "5세대 i5 이상 PC + 개발자용 IDE | 20만원 이하 노트북",
      tags: [
        "5세대 i7 이상 표준 구매 제품",
        "구간세가 완전 로드 포함",
        "전세계와 차액 보증 조건",
        "PC 자체별 로그 소지온 어려워 보증"
      ],
      seller: "M.2D1 Focus 칩셋",
      period: "시부크젠 + 2윌",
      price: "170,000원"
    },
    {
      id: 3,
      badge: "5세대 i7기사 + PC 개발자용 IDD",
      title: "최신식 노트북",
      description: "5세대 i5 이상 PC + 개발자용 IDE | 20만원 이하 노트북",
      tags: [
        "5세대 i7 이상 표준 구매 제품",
        "구간세가 완전 로드 포함",
        "전세계와 차액 보증 조건",
        "PC 자체별 로그 소지온 어려워 보증",
        "77호 소지 동의의 이용 20% 재발행탁"
      ],
      seller: "M.1X1 Google 칩셋",
      period: "시부크젠 + 2윌",
      price: "144,000원"
    }
  ];

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      console.log("기업 메인 페이지");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div 
              onClick={handleLogoClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
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


          </div>
        </div>
      </header>

      {/* 메인 배너 */}
      <div className="py-6 text-white bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="px-4 mx-auto text-center max-w-7xl">
          <h1 className="text-2xl font-bold">더 빠르게 초지오로 이해를 도와 실러더?</h1>
        </div>
      </div>

      {/* 서비스 카드 섹션 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setActiveService(service.id);
                if (service.onClick) {
                  service.onClick();
                }
              }}
              className={`p-6 bg-white border-2 rounded-xl hover:shadow-lg transition ${
                activeService === service.id ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="mb-2 text-4xl">{service.icon}</div>
              <h3 className="mb-1 text-lg font-bold">{service.title}</h3>
              <p className="mb-3 text-sm text-gray-600">{service.description}</p>
              <div className="space-y-1 text-xs text-left text-gray-500">
                {service.features.map((feature, idx) => (
                  <div key={idx}>{feature}</div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* 추천상품 섹션 */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">추천상품</h2>
          <div className="grid grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="overflow-hidden bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition">
                {/* 상품 배지 */}
                {product.badge && (
                  <div className="px-3 py-2 text-sm font-bold text-white bg-orange-500">
                    ⚡ {product.badge}
                  </div>
                )}
                
                {/* 상품 내용 */}
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-bold">{product.title}</h3>
                  
                  {/* 상품 설명 */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">{product.description}</p>
                  </div>

                  {/* 태그들 */}
                  <div className="mb-4 space-y-1">
                    {product.tags.map((tag, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 mt-1 text-blue-600">•</span>
                        <span className="text-xs text-gray-600">{tag}</span>
                      </div>
                    ))}
                  </div>

                  {/* 판매자 정보 */}
                  <div className="pt-3 mb-3 text-sm border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{product.seller}</span>
                      <span className="px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded">
                        {product.period}
                      </span>
                    </div>
                  </div>

                  {/* 가격 및 버튼 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">{product.price}</span>
                    <button className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                      신청하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
