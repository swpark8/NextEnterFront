import { useState, useEffect } from "react";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";
import { searchTalents, TalentSearchResponse, saveTalent, unsaveTalent } from "../../api/talent";
import { createInterviewRequest } from "../../api/apply";
import { getCompanyJobPostings, JobPostingListResponse } from "../../api/job";
import TalentResumeDetailPage from "./TalentResumeDetailPage";
import JobSelectionModal from "./components/JobSelectionModal";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";

export default function TalentSearchPage() {
  const { user } = useAuth();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation("talent", "talent-sub-1");
  const [searchParams] = useSearchParams(); // ✅ URL 파라미터 감지

  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // ✅ 검색 입력창 별도 관리
  const [selectedPosition, setSelectedPosition] = useState("전체");
  const [selectedExperience, setSelectedExperience] = useState("전체");
  const [talents, setTalents] = useState<TalentSearchResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // ✅ 기업 공고 목록
  const [myJobs, setMyJobs] = useState<JobPostingListResponse[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [pendingTalent, setPendingTalent] = useState<TalentSearchResponse | null>(null);
  
  // ✅ 상세보기 상태 추가
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  // 이력서 데이터 로드
  useEffect(() => {
    loadTalents();
  }, [selectedPosition, selectedExperience, searchQuery, currentPage]); // searchQuery로 변경

  // ✅ 기업 공고 로드
  useEffect(() => {
    const loadMyJobs = async () => {
      if (!user?.userId) return;

      try {
        console.log("=== 공고 로드 시작 ===");
        console.log("회사 ID:", user.userId);
        
        const jobs = await getCompanyJobPostings(user.userId);
        console.log("로드된 전체 공고:", jobs);
        console.log("공고 수:", jobs.length);
        
        if (jobs.length > 0) {
          jobs.forEach((job, idx) => {
            console.log(`공고 ${idx + 1}:`, {
              jobId: job.jobId,
              title: job.title,
              status: job.status,
              deadline: job.deadline
            });
          });
        }
        
        // 활성화된 공고 + 마감일이 지나지 않은 공고
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const availableJobs = jobs.filter(job => {
          // CLOSED나 EXPIRED가 아닌 공고
          if (job.status === "CLOSED" || job.status === "EXPIRED") {
            return false;
          }
          
          // 마감일이 있는 경우 마감일 확인
          if (job.deadline) {
            const deadline = new Date(job.deadline);
            deadline.setHours(0, 0, 0, 0);
            return deadline >= today;
          }
          
          // 마감일이 없으면 포함
          return true;
        });
        
        console.log("사용 가능한 공고:", availableJobs);
        console.log("사용 가능한 공고 수:", availableJobs.length);
        
        setMyJobs(availableJobs);
        if (availableJobs.length > 0) {
          setSelectedJobId(availableJobs[0].jobId);
          console.log("선택된 기본 공고 ID:", availableJobs[0].jobId);
        }
      } catch (error) {
        console.error("공고 로드 실패:", error);
      }
    };

    loadMyJobs();
  }, [user?.userId]);

  // ✅ URL reload 파라미터 변경 감지 - 같은 메뉴 클릭 시 새로고침
  useEffect(() => {
    const reloadParam = searchParams.get("reload");
    if (reloadParam) {
      loadTalents();
    }
  }, [searchParams.get("reload")]);

  // ✅ 검색 실행 함수
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(0); // 검색 시 페이지 초기화
  };

  // ✅ Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const loadTalents = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        size: 20,
      };

      // ✅ 기업 ID 추가
      if (user?.userId) {
        params.companyUserId = user.userId;
      }

      // 포지션 필터
      if (selectedPosition !== "전체") {
        params.jobCategory = selectedPosition;
      }

      // 검색어 필터
      if (searchQuery.trim()) {
        params.keyword = searchQuery.trim();
      }

      const response = await searchTalents(params);
      setTalents(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("인재 검색 오류:", error);
      setTalents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 경력 필터링 (프론트엔드에서 처리)
  const filteredTalents = talents.filter((talent) => {
    if (selectedExperience === "전체") return true;
    const years = talent.experienceYears;
    
    if (selectedExperience === "신입" && years === 0) return true;
    if (selectedExperience === "3년 이하" && years > 0 && years <= 3) return true;
    if (selectedExperience === "3-5년" && years > 3 && years <= 5) return true;
    if (selectedExperience === "5년 이상" && years > 5) return true;
    
    return false;
  });

  const handleInterviewRequest = async (resumeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 면접 요청 할 인재 정보 찾기
    const talent = talents.find(t => t.resumeId === resumeId);
    if (!talent) {
      alert("인재 정보를 찾을 수 없습니다.");
      return;
    }

    // 사용 가능한 공고가 없는 경우
    if (myJobs.length === 0) {
      alert("사용 가능한 공고가 없습니다.\n채용공고를 등록하거나 마감일이 지나지 않은 공고를 확인해주세요.");
      return;
    }

    // 모달 열기
    setPendingTalent(talent);
    setShowJobModal(true);
  };

  // 공고 선택 후 면접 요청 실행
  const handleJobSelect = async (jobId: number) => {
    if (!user?.userId || !pendingTalent) return;

    setShowJobModal(false);

    try {
      await createInterviewRequest(user.userId, pendingTalent.userId, jobId);
      alert("면접 요청이 전송되었습니다!");
      loadTalents();
    } catch (error: any) {
      console.error("면접 요청 오류:", error);
      alert(error.response?.data?.message || "면접 요청에 실패했습니다.");
    } finally {
      setPendingTalent(null);
    }
  };

  const handleSave = async (talentId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ 카드 클릭 이벤트 방지
    
    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    try {
      const response = await saveTalent(talentId, user.userId);
      if (response.success) {
        alert("인재가 스크랩되었습니다!");
      } else {
        alert("이미 스크랩된 인재입니다.");
      }
    } catch (error: any) {
      console.error("인재 스크랩 오류:", error);
      alert(error.response?.data?.message || "인재 스크랩에 실패했습니다.");
    }
  };
  
  // ✅ 인재 클릭 시 상세보기
  const handleTalentClick = (resumeId: number) => {
    setSelectedResumeId(resumeId);
  };
  
  // ✅ 상세보기에서 돌아오기
  const handleBackToList = () => {
    setSelectedResumeId(null);
    loadTalents(); // 목록 새로고침
  };
  
  // ✅ 상세보기 페이지 표시
  if (selectedResumeId) {
    return <TalentResumeDetailPage resumeId={selectedResumeId} onBack={handleBackToList} />;
  }

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
          <div className="mb-6">
            <h1 className="text-2xl font-bold">인재 검색</h1>
            <p className="mt-2 text-gray-600">최적의 인재를 찾아보세요</p>
          </div>

          {/* 필터 섹션 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                포지션
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="전체">전체</option>
                <option value="프론트엔드">프론트엔드</option>
                <option value="백엔드">백엔드</option>
                <option value="풀스택">풀스택</option>
                <option value="PM">PM</option>
                <option value="데이터 분석가">데이터 분석가</option>
                <option value="디자이너">디자이너</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                경력
              </label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="전체">전체</option>
                <option value="신입">신입</option>
                <option value="3년 이하">3년 이하</option>
                <option value="3-5년">3-5년</option>
                <option value="5년 이상">5년 이상</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                검색
              </label>
              <input
                type="text"
                placeholder="기술 스택으로 검색"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* 검색 버튼 */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleSearch}
              className="px-8 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              검색
            </button>
          </div>

          {/* 인재 목록 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTalents.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <p className="mb-2 text-lg">검색 결과가 없습니다.</p>
              <p className="text-sm">다른 조건으로 검색해보세요.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                총 <span className="font-semibold text-purple-600">{filteredTalents.length}</span>명의 인재를 찾았습니다.
              </div>
              <div className="space-y-4">
                {filteredTalents.map((talent) => (
                  <div
                    key={talent.resumeId}
                    onClick={() => handleTalentClick(talent.resumeId)}
                    className="p-6 transition bg-white border border-gray-200 cursor-pointer rounded-xl hover:shadow-lg hover:border-purple-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold">{talent.name}</h3>
                          <span className="px-3 py-1 text-sm font-medium text-purple-600 bg-purple-100 rounded">
                            {talent.jobCategory}
                          </span>
                          {talent.contactStatus === "ACCEPTED" ? (
                            <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded">
                              면접 요청이 수락되었습니다
                            </span>
                          ) : talent.contactStatus === "PENDING" ? (
                            <span className="px-3 py-1 text-sm font-medium text-yellow-600 bg-yellow-100 rounded">
                              연락 대기중
                            </span>
                          ) : talent.contactStatus === "REJECTED" ? (
                            <span className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded">
                              연락 거절됨
                            </span>
                          ) : talent.isAvailable ? (
                            <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded">
                              연락 가능
                            </span>
                          ) : null}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">경력:</span>
                            <span className="ml-2 font-medium">
                              {talent.experienceYears === 0 ? '신입' : `${talent.experienceYears}년`}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">지역:</span>
                            <span className="ml-2 font-medium">
                              {talent.location || '미지정'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">희망연봉:</span>
                            <span className="ml-2 font-medium">{talent.salaryRange || '협의'}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {talent.skills && talent.skills.length > 0 ? (
                            talent.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-sm text-purple-700 bg-purple-50 rounded-full"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">기술 스택 정보 없음</span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span>조회수: {talent.viewCount}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4 ml-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            {Math.round(talent.matchScore)}
                          </div>
                          <div className="text-sm text-gray-500">매칭 점수</div>
                        </div>

                        <div className="flex flex-col w-32 gap-2">
                          {/* ✅ 연락 상태에 따라 버튼 표시/비활성화 */}
                          {!talent.contactStatus || talent.contactStatus === "" ? (
                            // 연락하지 않은 경우 - 면접 요청 버튼 표시
                            <button
                              onClick={(e) => handleInterviewRequest(talent.resumeId, e)}
                              className="px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                            >
                              면접 요청
                            </button>
                          ) : talent.contactStatus === "ACCEPTED" ? (
                            // 수락된 경우 - 비활성화된 버튼
                            <button
                              disabled
                              className="px-4 py-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                            >
                              수락됨
                            </button>
                          ) : talent.contactStatus === "PENDING" ? (
                            // 대기중인 경우 - 비활성화된 버튼
                            <button
                              disabled
                              className="px-4 py-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                            >
                              대기중
                            </button>
                          ) : talent.contactStatus === "REJECTED" ? (
                            // 거절된 경우 - 비활성화된 버튼
                            <button
                              disabled
                              className="px-4 py-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                            >
                              거절됨
                            </button>
                          ) : null}
                          <button
                            onClick={(e) => handleSave(talent.resumeId, e)}
                            className="px-4 py-2 text-purple-700 transition bg-purple-50 rounded-lg hover:bg-purple-100"
                          >
                            스크랩
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 공고 선택 모달 */}
      <JobSelectionModal
        isOpen={showJobModal}
        onClose={() => {
          setShowJobModal(false);
          setPendingTalent(null);
        }}
        jobs={myJobs.map(job => ({
          jobId: job.jobId,
          title: job.title,
          jobCategory: job.jobCategory,
          deadline: job.deadline,
          status: job.status
        }))}
        onSelectJob={handleJobSelect}
        talentName={pendingTalent?.name || ""}
      />
    </div>
  );
}
