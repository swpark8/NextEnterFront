import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { searchTalents, type TalentSearchResponse } from "../api/talent";

export default function TalentSearchPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("전체");
  const [selectedExperience, setSelectedExperience] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [talents, setTalents] = useState<TalentSearchResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 인재 목록 로드
  useEffect(() => {
    const loadTalents = async () => {
      try {
        setLoading(true);
        
        // API 호출 파라미터 구성
        const params: any = {
          page: currentPage,
          size: 20,
        };

        // 직무 카테고리 필터
        if (selectedPosition !== "전체") {
          params.jobCategory = selectedPosition + " 개발자";
        }

        // 검색 키워드
        if (searchQuery) {
          params.keyword = searchQuery;
        }

        const response = await searchTalents(params);
        setTalents(response.content);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        console.error("인재 검색 실패:", error);
        alert(error.response?.data?.message || "인재 검색에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadTalents();
  }, [currentPage, selectedPosition, searchQuery]);

  const handleContact = (resumeId: number) => {
    console.log(`인재 ${resumeId} 연락하기`);
    alert("연락하기 기능은 준비 중입니다.");
  };

  const handleSave = (resumeId: number) => {
    console.log(`인재 ${resumeId} 저장하기`);
    alert("저장하기 기능은 준비 중입니다.");
  };

  const handleLogoClick = () => {
    navigate("/company");
  };

  // 클라이언트 측 경력 필터링
  const filteredTalents = talents.filter((talent) => {
    if (selectedExperience === "전체") return true;
    
    const exp = talent.experienceYears || 0;
    if (selectedExperience === "신입") return exp === 0;
    if (selectedExperience === "3년 이하") return exp > 0 && exp <= 3;
    if (selectedExperience === "3-5년") return exp > 3 && exp <= 5;
    if (selectedExperience === "5년 이상") return exp > 5;
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
      </div>
    );
  }

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
              <button 
                onClick={() => navigate("/company/jobs")}
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                ■ 채용공고
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">자료</button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">홍보</button>
            </nav>

            {/* 오른쪽 버튼 */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user?.userType === "company" ? (
                <>
                  <span className="text-gray-700 font-medium">
                    {user.companyName || user.name}님
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/company/login");
                    }}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/company/login")}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => navigate("/company/signup")}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    회원가입
                  </button>
                </>
              )}
              <button
                onClick={() => navigate("/user")}
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
        {/* 타이틀 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">인재 검색</h1>
          <p className="mt-2 text-gray-600">최적의 인재를 찾아보세요</p>
        </div>

        {/* 필터 섹션 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">포지션</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="프론트엔드">프론트엔드</option>
              <option value="백엔드">백엔드</option>
              <option value="풀스택">풀스택</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">경력</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="전체">전체</option>
              <option value="신입">신입</option>
              <option value="3년 이하">3년 이하</option>
              <option value="3-5년">3-5년</option>
              <option value="5년 이상">5년 이상</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">검색</label>
            <input
              type="text"
              placeholder="기술 스택으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 인재 목록 */}
        <div className="space-y-4">
          {filteredTalents.map((talent) => (
            <div key={talent.resumeId} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                {/* 왼쪽: 인재 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold">{talent.name}</h3>
                    <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded">
                      {talent.jobCategory}
                    </span>
                    {talent.isAvailable && (
                      <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded">
                        연락 가능
                      </span>
                    )}
                  </div>

                  {/* 상세 정보 */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">경력:</span>
                      <span className="ml-2 font-medium">
                        {talent.experienceYears === 0 ? "신입" : `${talent.experienceYears}년`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">지역:</span>
                      <span className="ml-2 font-medium">{talent.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">희망연봉:</span>
                      <span className="ml-2 font-medium">{talent.salaryRange}</span>
                    </div>
                  </div>

                  {/* 기술 스택 */}
                  <div className="flex flex-wrap gap-2">
                    {talent.skills && talent.skills.length > 0 ? (
                      talent.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">등록된 기술 스택이 없습니다</span>
                    )}
                  </div>
                </div>

                {/* 오른쪽: 매칭 점수 및 버튼 */}
                <div className="flex flex-col items-center gap-4 ml-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{talent.matchScore}</div>
                    <div className="text-sm text-gray-500">매칭 점수</div>
                  </div>

                  <div className="flex flex-col gap-2 w-32">
                    <button
                      onClick={() => handleContact(talent.resumeId)}
                      className="px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      연락하기
                    </button>
                    <button
                      onClick={() => handleSave(talent.resumeId)}
                      className="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      저장
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredTalents.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <div className="mb-4 text-4xl">🔍</div>
            <div className="text-lg font-medium">검색 결과가 없습니다</div>
            <div className="text-sm">다른 조건으로 검색해보세요</div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
