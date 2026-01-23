import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useApp } from "../../context/AppContext";
import ApplicationStautsSidebar from "./components/ApplicationStatusPageSidebar";

interface ApplicationStatusPageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function ApplicationStatusPage({
  initialMenu: _initialMenu,
  onNavigate: _onNavigate,
}: ApplicationStatusPageProps) {
  const [searchParams] = useSearchParams();
  const menuFromUrl = searchParams.get("menu") || "mypage-sub-3";
  
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "mypage",
    _initialMenu || menuFromUrl,
    _onNavigate
  );

  // ✅ AppContext에서 실제 지원 내역 가져오기
  const { jobApplications, cancelJobApplication } = useApp();

  const [period, setPeriod] = useState("3개월");
  const [status, setStatus] = useState("전체");
  const [businessType, setBusinessType] = useState("전체");
  const [industry, setIndustry] = useState("전체");
  const [startDate, setStartDate] = useState("2025-10-09");
  const [endDate, setEndDate] = useState("2026-01-07");
  const [searchKeyword, setSearchKeyword] = useState("");

  // ✅ 통계 계산 (실제 데이터 기반)
  const stats = useMemo(() => {
    const total = jobApplications.length;
    const viewed = jobApplications.filter(app => app.status === "열람").length;
    const notViewed = jobApplications.filter(app => app.status === "미열람").length;
    const cancelled = jobApplications.filter(app => app.status === "지원취소").length;

    return { total, viewed, notViewed, cancelled };
  }, [jobApplications]);

  // ✅ 필터링된 지원 내역
  const filteredApplications = useMemo(() => {
    return jobApplications.filter(app => {
      // 상태 필터
      if (status !== "전체" && app.status !== status) return false;

      // 키워드 검색 (회사명, 포지션)
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchCompany = app.company.toLowerCase().includes(keyword);
        const matchPosition = app.position.toLowerCase().includes(keyword);
        if (!matchCompany && !matchPosition) return false;
      }

      return true;
    });
  }, [jobApplications, status, searchKeyword]);

  const handleSearch = () => {
    console.log("검색 실행");
  };

  const handleViewResume = (id: number) => {
    console.log(`이력서 ${id} 보기`);
    // 이력서 페이지로 이동
    handleMenuClick("resume-sub-1");
  };

  const handleViewProgress = (id: number) => {
    console.log(`진행상태 ${id} 보기`);
  };

  const handleCancel = (id: number) => {
    if (window.confirm("정말 지원을 취소하시겠습니까?")) {
      cancelJobApplication(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold">지원 현황</h1>
        <div className="flex gap-6">
          <ApplicationStautsSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />

          <div className="flex-1">
            {/* 통계 카드 */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="flex flex-col items-center justify-center bg-white border-2 border-white p-9 rounded-2xl">
                <div className="flex items-center justify-center w-24 h-24 mb-3 text-4xl font-bold text-white bg-blue-500 rounded-full">
                  {stats.total}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  지원완료
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-white border-2 border-white p-9 rounded-2xl">
                <div className="flex items-center justify-center w-24 h-24 mb-3 text-4xl font-bold text-white bg-blue-500 rounded-full">
                  {stats.viewed}
                </div>
                <div className="text-lg font-semibold text-gray-700">열람</div>
              </div>

              <div className="flex flex-col items-center justify-center bg-white border-2 border-white p-9 rounded-2xl">
                <div className="flex items-center justify-center w-24 h-24 mb-3 text-4xl font-bold text-white bg-blue-500 rounded-full">
                  {stats.notViewed}
                </div>
                <div className="text-lg font-semibold text-gray-700">미열람</div>
              </div>

              <div className="flex flex-col items-center justify-center bg-white border-2 border-white p-9 rounded-2xl">
                <div className="flex items-center justify-center w-24 h-24 mb-3 text-4xl font-bold text-white bg-blue-500 rounded-full">
                  {stats.cancelled}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  지원취소
                </div>
              </div>
            </div>

            {/* 검색 필터 */}
            <div className="p-6 mb-6 bg-white border-2 border-gray-200 rounded-2xl">
              <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-200">
                <div className="w-20 font-medium text-gray-700">조회기간</div>
                <div className="flex gap-2">
                  {["1주일", "1개월", "2개월", "3개월", "날짜지정"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-2 text-sm rounded-lg transition ${
                        period === p
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <span className="text-gray-500">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="w-20 text-sm font-medium text-gray-700">
                    진행상태
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="전체">전체</option>
                    <option value="지원완료">지원완료</option>
                    <option value="열람">열람</option>
                    <option value="미열람">미열람</option>
                    <option value="지원취소">지원취소</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-20 text-sm font-medium text-gray-700">
                    영업여부
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="전체">전체</option>
                    <option value="영업중">영업중</option>
                    <option value="영업종료">영업종료</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-20 text-sm font-medium text-gray-700">
                    지원산업
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="전체">전체</option>
                    <option value="IT">IT</option>
                    <option value="제조">제조</option>
                    <option value="서비스">서비스</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="기업명, 채용제목"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleSearch}
                  className="px-8 py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  검색
                </button>
              </div>
            </div>

            {/* 지원 내역 테이블 */}
            {filteredApplications.length === 0 ? (
              <div className="p-12 text-center bg-white border-2 border-gray-200 rounded-2xl">
                <div className="mb-4 text-4xl">📋</div>
                <p className="mb-4 text-gray-600">지원 내역이 없습니다.</p>
                <button
                  onClick={() => handleMenuClick("job-sub-1")}
                  className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  채용공고 보러가기
                </button>
              </div>
            ) : (
              <div className="overflow-hidden bg-white border-2 border-gray-200 rounded-2xl">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                        지원일
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                        회사명
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                        지원내역
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                        열람여부 ▼
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                        지원취소
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                        진행상태
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="border-b border-gray-200">
                        <td className="px-4 py-4 text-sm text-center text-gray-700">
                          {app.date}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-700">
                          {app.company}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <div className="mb-1">{app.position}</div>
                          <div className="text-xs text-gray-500">
                            {app.jobType} | {app.location}
                          </div>
                          <div className="text-xs text-gray-400">
                            마감: {app.deadline}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                              app.status === "열람"
                                ? "bg-green-100 text-green-700"
                                : app.status === "지원취소"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {app.canCancel && (
                            <button
                              onClick={() => handleCancel(app.id)}
                              className="text-sm text-red-600 underline hover:text-red-700"
                            >
                              지원취소
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleViewResume(app.resumeId)}
                              className="text-xs text-blue-600 underline hover:text-blue-700"
                            >
                              서류확인 보기
                            </button>
                            <button
                              onClick={() => handleViewProgress(app.id)}
                              className="text-xs text-blue-600 underline hover:text-blue-700"
                            >
                              진행
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
