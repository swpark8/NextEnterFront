import { MenuCategory } from "../types";

interface DropdownMenuProps {
  isOpen: boolean;
}

export default function DropdownMenu({ isOpen }: DropdownMenuProps) {
  const categories: MenuCategory[] = [
    {
      id: "category1",
      title: "채용정보",
      items: [
        { id: "1-1", label: "전체 공고" },
        { id: "1-2", label: "AI 추천 공고" },
        { id: "1-3", label: "직무별 공고" },
        { id: "1-4", label: "지역별 공고" },
      ],
    },
    {
      id: "category2",
      title: "이력서",
      items: [
        { id: "2-1", label: "이력서 관리" },
        { id: "2-2", label: "자소서 관리" },
        { id: "2-3", label: "" },
        { id: "2-4", label: "" },
      ],
    },
    {
      id: "category4",
      title: "매칭분석",
      items: [
        { id: "4-1", label: "매칭결과 리포트" },
        { id: "4-2", label: "매칭 히스토리" },
        { id: "4-3", label: "" },
        { id: "4-4", label: "" },
      ],
    },
    {
      id: "category5",
      title: "면접준비",
      items: [
        { id: "5-1", label: "모의면접 시작" },
        { id: "5-2", label: "모의면접 진행" },
        { id: "5-3", label: "면접 결과" },
        { id: "5-4", label: "면접 히스토리" },
      ],
    },
    {
      id: "category6",
      title: "마이페이지",
      items: [
        { id: "6-1", label: "나의 정보" },
        { id: "6-2", label: "프로필 수정" },
        { id: "6-3", label: "지원 내역" },
        { id: "6-4", label: "받은 제안" },
      ],
    },
    {
      id: "category7",
      title: "크레딧",
      items: [
        { id: "7-1", label: "내 크레딧" },
        { id: "7-2", label: "크레딧 충전" },
        { id: "7-3", label: "" },
        { id: "7-4", label: "" },
      ],
    },
  ];

  return (
    <div
      className={`absolute left-0 right-0 bg-gray-100 border-b border-gray-200 shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-50 ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="py-8 mx-auto max-w-7xl">
        <div className="ml-[35px] mr-16">
          <div className="grid grid-cols-7 gap-2 divide-x divide-gray-300">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`space-y-2 ${index > 0 ? "pl-4" : ""}`}
              >
                <h3 className="text-sm font-bold text-gray-900">
                  {category.title}
                </h3>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <button className="text-sm text-gray-600 transition hover:text-blue-600">
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
