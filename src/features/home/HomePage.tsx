import { useState } from "react";

type JobCategory = {
  id: number;
  icon: string; // 이미지 경로
  label: string;
  color: string; // 지금은 안 쓰지만 유지
};

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [selectedLocation, setSelectedLocation] = useState("서울 전체");
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);

  const handleJobClick = (id: number) => {
    console.log(`공고 ${id} 클릭됨`);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    console.log("로그인 완료");
  };

  const handleShiftToggle = (shift: string) => {
    if (selectedShifts.includes(shift)) {
      setSelectedShifts(selectedShifts.filter((s) => s !== shift));
    } else {
      setSelectedShifts([...selectedShifts, shift]);
    }
  };

  const jobCategories: JobCategory[] = [
    {
      id: 1,
      icon: "/images/react.png",
      label: "프론트",
      color: "bg-purple-100",
    },
    {
      id: 2,
      icon: "/images/spring boot.png",
      label: "백엔드",
      color: "bg-blue-100",
    },
    {
      id: 3,
      icon: "/images/html, css.png",
      label: "퍼블리셔",
      color: "bg-yellow-100",
    },
    { id: 4, icon: "/images/풀스텍.png", label: "풀스택", color: "bg-red-100" },
    {
      id: 5,
      icon: "/images/Figma.png",
      label: "디자이너",
      color: "bg-orange-100",
    },
    { id: 6, icon: "/images/notion.png", label: "PM", color: "bg-gray-100" },
    {
      id: 7,
      icon: "/images/python.png",
      label: "데이터 분석가",
      color: "bg-green-100",
    },
    {
      id: 8,
      icon: "/icons/ai.png",
      label: "AI 엔지니어",
      color: "bg-cyan-100",
    },
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: "프론트엔드 개발자",
      company: "테크 컴퍼니",
      location: "서울 강남",
      salary: "연봉 4000만원~6000만원",
    },
    {
      id: 2,
      title: "백엔드 개발자",
      company: "스타트업",
      location: "서울 판교",
      salary: "연봉 5000만원~7000만원",
    },
    {
      id: 3,
      title: "풀스택 개발자",
      company: "IT 기업",
      location: "서울 마포",
      salary: "연봉 4500만원~6500만원",
    },
    {
      id: 4,
      title: "DevOps 엔지니어",
      company: "핀테크",
      location: "서울 강남",
      salary: "연봉 5500만원~7500만원",
    },
  ];

  // 아이콘 크기 통일용 "프레임" 클래스
  const ICON_FRAME_CLASS = "w-16 h-16 flex items-center justify-center";
  const ICON_IMG_CLASS = "w-full h-full object-contain";

  return (
    <main className="px-6 py-8 mx-auto max-w-[1600px]">
      <div className="flex gap-8">
        {/* 왼쪽: 일자리 빠르게 찾기 */}
        <aside className="w-80">
          <div className="p-8 text-white bg-blue-500 shadow-lg rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold">일자리 빠르게 찾기</h2>

            {/* 지역 선택 */}
            <div className="mb-6">
              <label className="block mb-3 text-sm font-semibold">
                서울 전체
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-white rounded-lg focus:outline-none"
              >
                <option value="서울 전체">서울 전체</option>
                <option value="서울 강남구">서울 강남구</option>
                <option value="서울 강북구">서울 강북구</option>
                <option value="서울 송파구">서울 송파구</option>
                <option value="서울 마포구">서울 마포구</option>
              </select>
            </div>

            {/* 근무시간 선택 */}
            <div className="mb-6 space-y-3">
              {["정규", "오전", "오후", "저녁", "새벽"].map((shift) => (
                <label
                  key={shift}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedShifts.includes(shift)}
                    onChange={() => handleShiftToggle(shift)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-medium text-white">{shift}</span>
                </label>
              ))}
            </div>

            {/* 검색하기 버튼 */}
            <button className="w-full px-6 py-3 font-bold text-blue-600 transition bg-white rounded-lg hover:bg-gray-100">
              검색하기
            </button>
          </div>
        </aside>

        {/* 중앙: 업직종별 + 추천 공고 */}
        <div className="flex-1 space-y-8">
          {/* 업직종별 */}
          <section>
            <h2 className="mb-6 text-2xl font-bold">업직종별</h2>
            <div className="p-8 bg-white shadow-lg rounded-2xl">
              <div className="grid grid-cols-4 gap-6">
                {jobCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleJobClick(category.id)}
                    className="flex flex-col items-center p-6 space-y-3 transition bg-white border-2 border-blue-500 rounded-xl hover:shadow-lg"
                  >
                    {/* ✅ 모든 아이콘을 같은 프레임에 넣어서 크기 통일 */}
                    <div className={ICON_FRAME_CLASS}>
                      <img
                        src={category.icon}
                        alt={category.label}
                        className={ICON_IMG_CLASS}
                        loading="lazy"
                      />
                    </div>

                    <span className="font-semibold text-gray-800">
                      {category.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 추천 공고 (로그인 시에만 표시) */}
          {isLoggedIn && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="mr-3 text-3xl">🎉</span>
                  <h2 className="text-2xl font-bold">
                    회원님을 위한 추천 공고
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {recommendedJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobClick(job.id)}
                    className="flex flex-col h-64 p-8 transition bg-white border-2 border-blue-500 cursor-pointer rounded-xl hover:shadow-xl"
                  >
                    <div className="flex-1">
                      <h4 className="mb-3 text-2xl font-bold">{job.title}</h4>
                      <p className="mb-2 text-base text-gray-600">
                        {job.company}
                      </p>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                    <div className="pt-3 border-t-2 border-gray-200">
                      <p className="text-lg font-bold text-blue-600">
                        {job.salary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 로그인 안내 (로그아웃 상태) */}
          {!isLoggedIn && (
            <section>
              <div className="p-12 text-center text-white shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <h3 className="mb-4 text-3xl font-bold">
                  로그인하고 맞춤 공고를 확인하세요!
                </h3>
                <p className="mb-8 text-lg">
                  회원님께 딱 맞는 일자리를 추천해드립니다
                </p>
                <button
                  onClick={handleLogin}
                  className="px-8 py-4 text-lg font-bold text-blue-600 transition bg-white rounded-lg hover:bg-gray-100"
                >
                  로그인하기
                </button>
              </div>
            </section>
          )}
        </div>

        {/* 오른쪽: 광고 */}
        <aside className="space-y-6 w-80">
          {/* 아이디/비밀번호 찾기 + 회원가입 */}
          {!isLoggedIn && (
            <div className="p-6 text-center bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
              <p className="mb-4 text-gray-600">
                아이디 · 비밀번호 찾기 | 회원가입
              </p>
              <button
                onClick={handleLogin}
                className="w-full px-6 py-3 font-bold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                로그인
              </button>
              <div className="mt-4 text-sm text-gray-500">간편로그인</div>
              <div className="flex justify-center mt-3 space-x-4">
                <button className="flex items-center justify-center w-10 h-10 font-bold text-white bg-green-500 rounded-full">
                  N
                </button>
                <button className="flex items-center justify-center w-10 h-10 font-bold text-black bg-yellow-400 rounded-full">
                  K
                </button>
                <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full">
                  G
                </button>
                <button className="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full"></button>
              </div>
            </div>
          )}

          {/* 광고 1 */}
          <div className="relative p-8 overflow-hidden text-white shadow-lg bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl">
            <h3 className="mb-2 text-xl font-bold">구직자 대상</h3>
            <h3 className="mb-6 text-xl font-bold">
              해외 취업 사기에 주의하세요!
            </h3>
            <button className="px-4 py-2 text-white transition bg-white rounded-lg bg-opacity-20 hover:bg-opacity-30">
              바로가기 →
            </button>
            <div className="absolute text-sm bottom-2 right-2">5/5</div>
          </div>

          {/* 광고 2 */}
          <div className="p-8 text-white shadow-lg bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl">
            <h3 className="mb-2 text-lg font-bold">쿠팡로지스틱스</h3>
            <h3 className="mb-4 text-xl font-bold">
              쿠팡 CLS 플렉스 어시스턴트 채용
            </h3>
            <div className="mb-4 text-2xl font-bold">coupang</div>
            <div className="text-sm">logistics services</div>
            <div className="absolute text-sm bottom-2 right-2">5/8</div>
          </div>

          {/* 광고 3 */}
          <div className="relative p-6 bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
            <h3 className="mb-2 text-lg font-bold">SK 하이닉스 채용 공고</h3>
            <p className="mb-4 text-sm text-gray-600">연봉 5500만원~7500만원</p>
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center justify-center w-16 h-16 font-bold text-white bg-purple-600 rounded-full">
                SK
              </div>
            </div>
            <div className="absolute text-xs text-gray-500 bottom-2 right-2">
              1/6
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
