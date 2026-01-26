import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import { getCreditBalance } from "../../api/credit";
import { searchTalents, type TalentSearchResponse } from "../../api/talent";
import { getJobPostings, type JobPostingListResponse } from "../../api/job";
import { getApplies, type ApplyListResponse } from "../../api/apply";

export default function BusinessCreditPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "credit",
    "credit-sub-1",
  );

  const [currentCredit, setCurrentCredit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedApplicants, setRecommendedApplicants] = useState<
    TalentSearchResponse[]
  >([]);
  const [myJobPostings, setMyJobPostings] = useState<JobPostingListResponse[]>(
    [],
  );
  const [appliedCandidates, setAppliedCandidates] = useState<
    ApplyListResponse[]
  >([]);

  // 크레딧 잔액 조회
  useEffect(() => {
    const fetchCreditBalance = async () => {
      if (user?.companyId) {
        try {
          console.log("📡 기업 크레딧 잔액 조회:", user.companyId);
          const balance = await getCreditBalance(user.companyId);
          console.log("✅ 크레딧 잔액:", balance.balance);
          setCurrentCredit(balance.balance);
        } catch (error) {
          console.error("❌ 크레딧 잔액 조회 실패:", error);
          setCurrentCredit(0);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchCreditBalance();
  }, [user?.companyId]);

  // 추천 지원자 조회 (인재 검색 API 사용)
  useEffect(() => {
    const fetchRecommendedApplicants = async () => {
      if (user?.companyId) {
        try {
          const result = await searchTalents({
            page: 0,
            size: 4,
            companyUserId: user.companyId,
          });
          setRecommendedApplicants(result.content);
        } catch (error) {
          console.error("추천 지원자 조회 실패:", error);
        }
      }
    };

    fetchRecommendedApplicants();
  }, [user?.companyId]);

  // 내가 올린 공고 조회
  useEffect(() => {
    const fetchMyJobPostings = async () => {
      if (user?.companyId) {
        try {
          // API에서 제공하는 일반 공고 목록을 받아오고 클라이언트에서 회사 ID로 필터링
          const res = await getJobPostings({ page: 0, size: 20 });
          const postings = res?.content ?? [];
          // ACTIVE 상태의 공고 중 해당 회사의 게시물만 가져오고 최대 3개로 제한
          const activePostings = postings
            .filter(
              (p) => p.status === "ACTIVE" && p.companyId === user.companyId,
            )
            .slice(0, 3);
          setMyJobPostings(activePostings);
        } catch (error) {
          console.error("공고 목록 조회 실패:", error);
        }
      }
    };
    // test

    fetchMyJobPostings();
  }, [user?.companyId]);

  // 지원한 인재 조회
  useEffect(() => {
    const fetchAppliedCandidates = async () => {
      if (user?.companyId) {
        try {
          const result = await getApplies(user.companyId, {
            page: 0,
            size: 2,
          });
          setAppliedCandidates(result.content);
        } catch (error) {
          console.error("지원자 목록 조회 실패:", error);
        }
      }
    };

    fetchAppliedCandidates();
  }, [user?.companyId]);

  const handleChargeClick = () => {
    navigate("/company/credit/charge");
  };

  // 경력 포맷팅 함수
  const formatExperience = (years: number) => {
    if (years === 0) return "신입";
    if (years < 0) return "경력무관";
    return `${years}년`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex px-4 py-8 mx-auto max-w-7xl">
        {/* 왼쪽 사이드바 */}
        <CompanyLeftSidebar
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
        />

        {/* 메인 컨텐츠 */}
        <div className="flex-1 pl-6">
          {/* 타이틀 & 충전 버튼 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 text-xl text-white rounded-full bg-gradient-to-br from-yellow-400 to-orange-400">
                🪙
              </div>
              <h1 className="text-2xl font-bold text-purple-600">
                보유 크레딧
              </h1>
            </div>
            <button
              onClick={handleChargeClick}
              className="flex items-center px-6 py-2 space-x-2 font-semibold text-purple-600 transition bg-white border-2 border-purple-600 rounded-lg hover:bg-purple-50"
            >
              <span>+</span>
              <span>충전하기</span>
            </button>
          </div>

          {/* 크레딧 카드 */}
          <div className="p-8 mb-8 shadow-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="mb-2 text-xl font-semibold">
                  기업회원님의 현재 사용 가능 크레딧
                </div>
              </div>
              <div className="flex items-center px-10 py-5 space-x-3 bg-white rounded-full shadow-lg">
                {isLoading ? (
                  <span className="text-3xl text-gray-400">로딩 중...</span>
                ) : (
                  <>
                    <span className="text-5xl font-bold text-gray-900">
                      {currentCredit.toLocaleString()}
                    </span>
                    <div className="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-gradient-to-br from-yellow-400 to-orange-400">
                      🪙
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 그리드 레이아웃 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 왼쪽 상단: 추천 지원자에게 연락 보내기 */}
            <div className="p-6 bg-white border-2 border-purple-500 shadow-lg rounded-2xl">
              <div className="flex items-center mb-6 space-x-2">
                <span className="text-2xl">⭐</span>
                <h2 className="text-xl font-bold text-gray-900">
                  추천 지원자에게 연락 보내기
                </h2>
              </div>
              {recommendedApplicants.length > 0 ? (
                <div className="overflow-hidden border-2 border-purple-300 rounded-xl">
                  <table className="w-full">
                    <tbody className="divide-y divide-purple-200">
                      {recommendedApplicants.map((candidate, idx) => (
                        <tr
                          key={idx}
                          className="transition cursor-pointer hover:bg-purple-50"
                          onClick={() => navigate("/company/talent-search")}
                        >
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {candidate.name}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700">
                            {candidate.jobCategory}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700">
                            {formatExperience(candidate.experienceYears)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center space-x-2">
                              <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                                매칭 {candidate.matchScore}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-gray-300 border-dashed bg-gray-50 rounded-xl">
                  <p className="mb-4 text-gray-600">추천 지원자가 없습니다</p>
                  <button
                    onClick={() => navigate("/company/talent-search")}
                    className="px-6 py-2 text-purple-600 transition border-2 border-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    인재 검색하기
                  </button>
                </div>
              )}
            </div>

            {/* 오른쪽 상단: 내가 올린 공고 보기 */}
            <div className="p-6 bg-white border-2 border-purple-500 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📋</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    내가 올린 공고 보기
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/company/jobs/create")}
                  className="text-3xl font-bold text-purple-600 hover:text-purple-700"
                >
                  +
                </button>
              </div>
              {myJobPostings.length > 0 ? (
                <div className="space-y-3">
                  {myJobPostings.map((job) => (
                    <div
                      key={job.jobId}
                      className="p-4 transition border-2 border-purple-300 cursor-pointer rounded-xl hover:bg-purple-50"
                      onClick={() => navigate(`/company/jobs/${job.jobId}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-2 font-bold text-gray-900 line-clamp-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span>📍 {job.location}</span>
                            <span>•</span>
                            <span>
                              👁️ {job.viewCount} · 📝 {job.applicantCount}
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                          모집중
                        </span>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/company/jobs")}
                    className="w-full py-2 text-purple-600 transition border-2 border-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    전체 공고 보기
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-gray-300 border-dashed bg-gray-50 rounded-xl">
                  <div className="mb-4">
                    <h3 className="mb-4 text-xl font-bold text-gray-900">
                      등록된 공고가 없습니다
                    </h3>
                  </div>
                  <button
                    onClick={() => navigate("/company/jobs")}
                    className="px-6 py-2 text-purple-600 transition border-2 border-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    공고 관리 바로가기
                  </button>
                </div>
              )}
            </div>

            {/* 왼쪽 하단: 크레딧은 어디에 쓸 수 있나요? */}
            <div className="p-6 bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
              <div className="pl-4 mb-6 border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-gray-900">
                  크레딧은 어디에 쓸 수 있나요?
                </h3>
              </div>
              <ol className="space-y-3 text-base text-gray-700 list-decimal list-inside">
                <li>인재 검색 및 이력서 열람</li>
                <li>채용 공고 프리미엄 노출</li>
                <li>지원자에게 면접 제안 발송</li>
              </ol>
            </div>

            {/* 오른쪽 하단: 지원한 인재 */}
            <div className="p-6 bg-white border-2 border-purple-500 shadow-lg rounded-2xl">
              <div className="flex items-center mb-6 space-x-2">
                <span className="text-2xl">👤</span>
                <h2 className="text-xl font-bold text-gray-900">지원한 인재</h2>
              </div>
              {appliedCandidates.length > 0 ? (
                <div className="overflow-hidden border-2 border-purple-300 rounded-xl">
                  <table className="w-full">
                    <tbody className="divide-y divide-purple-200">
                      {appliedCandidates.map((candidate, idx) => (
                        <tr
                          key={idx}
                          className="transition cursor-pointer hover:bg-purple-50"
                          onClick={() =>
                            navigate(`/company/applicants/${candidate.applyId}`)
                          }
                        >
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {candidate.userName}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700">
                            {candidate.userAge}세
                          </td>
                          <td className="max-w-xs px-6 py-4 text-gray-700 truncate">
                            {candidate.jobTitle}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-gray-300 border-dashed bg-gray-50 rounded-xl">
                  <p className="mb-4 text-gray-600">지원자가 없습니다</p>
                  <button
                    onClick={() => navigate("/company/applicants")}
                    className="px-6 py-2 text-purple-600 transition border-2 border-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    지원자 관리 바로가기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
