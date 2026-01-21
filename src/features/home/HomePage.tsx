import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

type JobCategory = {
  id: number;
  icon: string;
  label: string;
  color: string;
};

interface HomePageProps {
  onLoginClick?: () => void;
}

export default function HomePage({ onLoginClick }: HomePageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("서울 전체");
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);

  const handleJobClick = (id: number) => {
    console.log(`공고 ${id} 클릭됨`);
  };

  const handleLogin = () => {
    onLoginClick?.();
  };

  // ✅ 소셜 로그인 핸들러 추가
  const handleSocialLogin = (provider: "naver" | "kakao" | "google") => {
    const backendUrl = "http://localhost:8080";
    window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
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
    { id: 4, icon: "/images/풀스텍.png", label: "풀스택", color: "bg-red-100" },
    { id: 6, icon: "/images/notion.png", label: "PM", color: "bg-gray-100" },
    {
      id: 8,
      icon: "/images/AI.png",
      label: "AI 엔지니어",
      color: "bg-cyan-100",
    },
    {
      id: 5,
      icon: "/images/Figma.png",
      label: "디자이너",
      color: "bg-orange-100",
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

  const ICON_FRAME_CLASS = "w-16 h-16 flex items-center justify-center";
  const ICON_IMG_CLASS = "w-full h-full object-contain";

  return (
    <>
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
                  <option value="서울 강동구">서울 강동구</option>
                  <option value="서울 강북구">서울 강북구</option>
                  <option value="서울 강서구">서울 강서구</option>
                  <option value="서울 관악구">서울 관악구</option>
                  <option value="서울 광진구">서울 광진구</option>
                  <option value="서울 구로구">서울 구로구</option>
                  <option value="서울 금천구">서울 금천구</option>
                  <option value="서울 노원구">서울 노원구</option>
                  <option value="서울 도봉구">서울 도봉구</option>
                  <option value="서울 동대문구">서울 동대문구</option>
                  <option value="서울 동작구">서울 동작구</option>
                  <option value="서울 마포구">서울 마포구</option>
                  <option value="서울 서대문구">서울 서대문구</option>
                  <option value="서울 서초구">서울 서초구</option>
                  <option value="서울 성동구">서울 성동구</option>
                  <option value="서울 성북구">서울 성북구</option>
                  <option value="서울 송파구">서울 송파구</option>
                  <option value="서울 양천구">서울 양천구</option>
                  <option value="서울 영등포구">서울 영등포구</option>
                  <option value="서울 용산구">서울 용산구</option>
                  <option value="서울 은평구">서울 은평구</option>
                  <option value="서울 종로구">서울 종로구</option>
                  <option value="서울 중구">서울 중구</option>
                  <option value="서울 중랑구">서울 중랑구</option>
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
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <div className="flex gap-6">
                  {/* 왼쪽 세로 배너 - 광고용 */}
                  <div className="w-44">
                    <div className="flex flex-col justify-between h-full p-4 text-white bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl">
                      <div>
                        <div className="mb-2 text-2xl">🎯</div>
                        <h3 className="mb-1 text-lg font-bold">특별 채용</h3>
                        <h3 className="mb-3 text-base font-bold">공고</h3>
                      </div>

                      <div className="space-y-2">
                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                          <p className="text-xs font-semibold mb-0.5">
                            프리미엄 기업
                          </p>
                          <p className="text-[10px]">지금 바로 지원하세요</p>
                        </div>

                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                          <p className="text-xs font-semibold mb-0.5">
                            신입 대환영
                          </p>
                          <p className="text-[10px]">성장 기회를 잡으세요</p>
                        </div>

                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                          <p className="text-xs font-semibold mb-0.5">
                            연봉 UP
                          </p>
                          <p className="text-[10px]">최고 대우 보장</p>
                        </div>
                      </div>

                      <button className="w-full px-3 py-2 mt-3 text-sm font-bold text-purple-600 transition bg-white rounded-lg hover:bg-gray-100">
                        자세히 보기 →
                      </button>
                    </div>
                  </div>

                  {/* 오른쪽 직무 카드들 */}
                  <div className="grid flex-1 grid-cols-3 gap-4">
                    {jobCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleJobClick(category.id)}
                        className="flex flex-col items-center p-4 space-y-2 transition bg-white border-2 border-blue-500 rounded-xl hover:shadow-lg"
                      >
                        <div className={ICON_FRAME_CLASS}>
                          <img
                            src={category.icon}
                            alt={category.label}
                            className={ICON_IMG_CLASS}
                            loading="lazy"
                          />
                        </div>

                        <span className="text-sm font-semibold text-gray-800">
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 추천 공고 (로그인 시에만 표시) */}
            {isAuthenticated && (
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
            {!isAuthenticated && (
              <section>
                <div className="p-12 text-center text-white shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <h3 className="mb-4 text-3xl font-bold">
                    로그인하고 맞춤 공고를 확인하세요!
                  </h3>
                  <p className="mb-8 text-lg">
                    회원님께 딱 맞는 일자리를 추천해드립니다
                  </p>
                  <button
                    onClick={() => navigate("/user/login")}
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
            {!isAuthenticated && (
              <div className="p-6 text-center bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
                <p className="mb-4 text-gray-600">
                  아이디 · 비밀번호 찾기 |{" "}
                  <span
                    onClick={() => navigate("/user/signup")}
                    className="text-gray-600 cursor-pointer hover:text-blue-600 hover:underline"
                  >
                    회원가입
                  </span>
                </p>
                <button
                  onClick={() => navigate("/user/login")}
                  className="w-full px-6 py-3 font-bold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  로그인
                </button>
                <div className="mt-4 text-sm text-gray-500">간편로그인</div>

                {/* 소셜 로그인 버튼들 - 이미지 사용 */}
                <div className="flex justify-center mt-3 space-x-4">
                  {/* 네이버 */}
                  <button
                    onClick={() => handleSocialLogin("naver")}
                    className="flex items-center justify-center w-10 h-10 overflow-hidden transition-opacity rounded-full shadow-md hover:opacity-80"
                    title="네이버 로그인"
                  >
                    <img
                      src="/images/naver-icon.png"
                      alt="네이버 로그인"
                      className="object-cover w-full h-full"
                    />
                  </button>

                  {/* 카카오 로그인 - 노란색 배경 */}
                  <button
                    onClick={() => handleSocialLogin("kakao")}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FEE500] hover:opacity-80 transition-opacity shadow-md"
                    title="카카오 로그인"
                  >
                    <img
                      src="/images/kakao-icon.png"
                      alt="카카오 로그인"
                      className="object-contain w-12 h-12"
                    />
                  </button>

                  {/* 구글 */}
                  <button
                    onClick={() => handleSocialLogin("google")}
                    className="flex items-center justify-center w-10 h-10 overflow-hidden transition-opacity rounded-full shadow-md hover:opacity-80"
                    title="구글 로그인"
                  >
                    <img
                      src="/images/google-icon.png"
                      alt="구글 로그인"
                      className="object-cover w-full h-full"
                    />
                  </button>
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
              <p className="mb-4 text-sm text-gray-600">
                연봉 5500만원~7500만원
              </p>
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
    </>
  );
}
