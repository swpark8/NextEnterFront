import { useState } from "react";

interface BusinessServicePageProps {
  onLogoClick?: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export default function BusinessServicePage({
  onLogoClick,
  onLoginClick,
  onSignupClick,
}: BusinessServicePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      icon: "📝",
      title: "공고 등록",
      items: ["채용 대행", "직무 매핑", "직무 매핑", "직무 매핑"],
    },
    {
      icon: "📊",
      title: "인재 검색",
      items: ["직무 매핑", "직무 매핑", "직무 매핑", "직무 매핑"],
    },
    {
      icon: "⭐",
      title: "서비스 대리기",
      items: ["직무 매핑", "직무 매핑", "직무 매핑", "직무 매핑"],
    },
  ];

  const services = [
    {
      id: 1,
      badge: "현재 광고 중",
      badgeColor: "bg-orange-500",
      title: "최신 PC + PC 시장에 대한",
      subtitle: "최신단 노동",
      tag1: "온라인+오프",
      tag1Color: "bg-blue-500",
      tag2: "100회/케이터",
      tag2Color: "bg-blue-500",
      features: [
        "인터뷰+상담 포트폴리오",
        "전략적이고 오픈 소스 교육",
        "PC 개발용 문법 스터디 노트",
        "실제 코드 포트폴리오 관리",
      ],
      stats: [
        "공급자+웹 20개 글상담",
        "최고 회 합+의사 주 문제열",
        "최고 회 합+수업 주 합격자",
      ],
      instructor: "NL 시에 (개인소개 참여)",
      duration: "시거매끄럽+ 김",
      price: "250,000원",
    },
    {
      id: 2,
      title: "실리콘 PC + PC 자바랭 언어",
      subtitle: "랭귀 노드응",
      tag1: "온라인+오프",
      tag1Color: "bg-orange-500",
      features: [
        "인터뷰+상담 포트 소스 교육",
        "전략적이고 오픈 소스 교육",
        "PC 개발용 스터디 실제 노트",
        "실제 코드 포트폴리오 관리",
      ],
      stats: [
        "공급자+웹 20개 글상담",
        "최고 회 합 주 문제열",
        "최고 회 합 주 합격자",
      ],
      instructor: "M 지에 (개인소개 참여)",
      duration: "시거매끄럽+ 김",
      price: "170,000원",
    },
    {
      id: 3,
      title: "실리콘 PC + PC 자바랭 언어",
      subtitle: "랭귀 노드응",
      tag1: "온라인+오프",
      tag1Color: "bg-orange-500",
      features: [
        "인터뷰+상담 포트 소스 교육",
        "전략적이고 오픈 소스 교육",
        "PC 개발용 스터디 실제 노트",
        "실제 코드 포트폴리오 관리",
      ],
      stats: [
        "공급자+웹 20개 글상담",
        "최고 회 합 주 문제열",
        "최고 회 합 주 합격자",
      ],
      instructor: "M 지에 (개인소개 참여)",
      duration: "시거매끄럽+ 김",
      price: "164,800원",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div
              onClick={onLogoClick}
              className="transition cursor-pointer hover:opacity-80"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-purple-600">
                  &lt; codeQuery /&gt;
                </span>
              </div>
            </div>

            {/* 네비게이션 */}
            <nav className="items-center hidden space-x-8 md:flex">
              <a href="#" className="text-gray-700 hover:text-purple-600">
                채용정보
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600">
                자료실
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600">
                통계
              </a>
            </nav>

            {/* 로그인/회원가입 버튼 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onLoginClick}
                className="px-4 py-2 text-gray-700 hover:text-purple-600"
              >
                로그인
              </button>
              <button
                onClick={onSignupClick}
                className="px-4 py-2 text-gray-700 hover:text-purple-600"
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 배너 */}
      <div className="py-6 text-white bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="px-4 mx-auto text-center max-w-7xl">
          <h1 className="text-2xl font-bold">
            더 빨리한 조직으로 이동을 보고 싶다면?
          </h1>
        </div>
      </div>

      {/* 카테고리 섹션 */}
      <div className="py-8 bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.title)}
                className={`p-6 border-2 rounded-xl transition hover:border-purple-400 hover:shadow-md ${
                  selectedCategory === category.title
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200"
                }`}
              >
                <div className="mb-3 text-4xl">{category.icon}</div>
                <h3 className="mb-2 text-lg font-bold">{category.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {category.items.map((item, idx) => (
                    <div key={idx}>{item}</div>
                  ))}
                </div>
              </button>
            ))}
            <div className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
              <div className="mb-2 text-sm text-gray-600">
                좋은 서비스들이{" "}
                <span className="font-bold text-blue-600">무료</span>로 계속
                업로드됩니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 서비스 목록 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold">서울상품</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden transition bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg"
            >
              {/* 카드 헤더 */}
              <div className="p-4 border-b border-gray-200">
                {service.badge && (
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full mb-2 ${service.badgeColor}`}
                  >
                    {service.badge}
                  </span>
                )}
                <h3 className="mb-1 text-lg font-bold">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.subtitle}</p>
              </div>

              {/* 태그 */}
              <div className="flex gap-2 px-4 py-2">
                <span
                  className={`px-2 py-1 text-xs text-white rounded ${service.tag1Color}`}
                >
                  {service.tag1}
                </span>
                {service.tag2 && (
                  <span
                    className={`px-2 py-1 text-xs text-white rounded ${service.tag2Color}`}
                  >
                    {service.tag2}
                  </span>
                )}
              </div>

              {/* 특징 */}
              <div className="px-4 py-3 space-y-2">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="mt-1 text-purple-500">•</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* 통계 */}
              <div className="px-4 py-3 space-y-1 bg-gray-50">
                {service.stats.map((stat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-500">✓</span>
                    <span className="text-xs text-gray-600">{stat}</span>
                  </div>
                ))}
              </div>

              {/* 하단 정보 */}
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="mb-2 text-sm text-gray-600">
                  {service.instructor}
                </div>
                <div className="mb-3 text-sm text-gray-600">
                  {service.duration}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">{service.price}</span>
                  <button className="px-6 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700">
                    신청하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
