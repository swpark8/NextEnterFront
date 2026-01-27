import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import { useAuth } from "../../context/AuthContext";
import { getMyApplies, ApplyListResponse } from "../../api/apply";
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

  const { user } = useAuth();
  const [applies, setApplies] = useState<ApplyListResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // 백엔드에서 데이터 로드
  useEffect(() => {
    const loadApplies = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        const data = await getMyApplies(user.userId);
        // interviewStatus가 REJECTED인 것은 제외 (거절한 공고는 표시하지 않음)
        const filtered = data.filter(apply => apply.interviewStatus !== "REJECTED");
        setApplies(filtered);
      } catch (error) {
        console.error("지원 내역 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApplies();
  }, [user?.userId]);

  // 상태 변환 함수
  const getApplicationStatus = (apply: ApplyListResponse): string => {
    const { status, interviewStatus } = apply;

    // 서류심사 중
    if (status === "PENDING" && !interviewStatus) {
      return "서류심사 중";
    }
    // 서류합격
    if (interviewStatus === "REQUESTED" || interviewStatus === "ACCEPTED") {
      return "서류합격";
    }
    // 면접 심사 중
    if (interviewStatus === "ACCEPTED") {
      return "면접 심사 중";
    }
    // 합격
    if (status === "ACCEPTED") {
      return "합격";
    }
    // 불합격
    if (status === "REJECTED") {
      return "불합격";
    }
    return "서류심사 중";
  };

  const [period, setPeriod] = useState("3개월");
  const [status, setStatus] = useState("전체");
  const [businessType, setBusinessType] = useState("전체");
  const [industry, setIndustry] = useState("전체");
  const [startDate, setStartDate] = useState("2025-10-09");
  const [endDate, setEndDate] = useState("2026-01-07");
  const [searchKeyword, setSearchKeyword] = useState("");

  // ✅ 통계 계산 (실제 데이터 기반)
  const stats = useMemo(() => {
    const total = applies.length;
    const documentPass = applies.filter(app => 
      app.interviewStatus === "REQUESTED" || app.interviewStatus === "ACCEPTED"
    ).length;
    const pass = applies.filter(app => app.status === "ACCEPTED").length;
    const fail = applies.filter(app => app.status === "REJECTED").length;

    return { total, documentPass, pass, fail };
  }, [applies]);

  // ✅ 필터링된 지원 내역
  const filteredApplications = useMemo(() => {
    return applies.filter(app => {
      // 상태 필터
      if (status !== "전체") {
        const appStatus = getApplicationStatus(app);
        if (appStatus !== status) return false;
      }

      // 키워드 검색 (회사명, 포지션)
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchCompany = app.companyName?.toLowerCase().includes(keyword) || false;
        const matchPosition = app.jobTitle?.toLowerCase().includes(keyword) || false;
        if (!matchCompany && !matchPosition) return false;
      }

      return true;
    });
  }, [applies, status, searchKeyword]);

  const handleSearch = () => {
    console.log("검색 실행");
  };

  const handleViewResume = (resumeId: number) => {
    console.log(`이력서 ${resumeId} 보기`);
    // 이력서 페이지로 이동
    handleMenuClick("resume-sub-1");
  };

  const handleViewProgress = (applyId: number) => {
    console.log(`진행상태 ${applyId} 보기`);
  };

  const handleCancel = (applyId: number) => {
    if (window.confirm("정말 지원을 취소하시겠습니까?")) {
      // TODO: 취소 API 호출
      console.log(`지원 취소: ${applyId}`);
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
                <div className="flex items-center justify-center w-24 h-24 mb-3 text-4xl font-bold text-white bg-green-500 rounded-full">
                  {stats.documentPass}
                </div>
                <div className="text-lg font-semibold text-gray-700">서류합격</div>
              </div>

              <div className="flex flex-col items-center justify-center bg-white border-2 border-white p-9 rounded-2xl">
                <div className="flex items-center justify-center w-24 h-24 mb-3 text-4xl font-bold text-white bg-purple-500 rounded-full">
                  {stats.pass}
                </div>
                <div className="text-lg font-semibold text-gray-700">합격</div>
              </div>

              <div className="flex flex-col items-center justify-center bg-white border-2 border-white p-9 rounded-2xl">
                <div className="flex items-center justify-center w-24 h-24 mb-3 text-4xl font-bold text-white bg-red-500 rounded-full">
                  {stats.fail}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  불합격
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
                    <option value="서류심사 중">서류심사 중</option>
                    <option value="서류합격">서류합격</option>
                    <option value="면접 심사 중">면접 심사 중</option>
                    <option value="합격">합격</option>
                    <option value="불합격">불합격</option>
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
            {loading ? (
              <div className="p-12 text-center bg-white border-2 border-gray-200 rounded-2xl">
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : filteredApplications.length === 0 ? (
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
                        진행상태
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                        지원취소
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => {
                      const appStatus = getApplicationStatus(app);
                      const statusColor = 
                        appStatus === "합격" ? "bg-purple-100 text-purple-700" :
                        appStatus === "서류합격" ? "bg-green-100 text-green-700" :
                        appStatus === "불합격" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700";

                      return (
                        <tr key={app.applyId} className="border-b border-gray-200">
                          <td className="px-4 py-4 text-sm text-center text-gray-700">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm text-center text-gray-700">
                            {app.companyName || "알 수 없음"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            <div className="mb-1">{app.jobTitle}</div>
                            <div className="text-xs text-gray-500">
                              {app.jobCategory} | {app.location || "미지정"}
                            </div>
                            <div className="text-xs text-gray-400">
                              마감: {app.deadline || "미지정"}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                              {appStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {app.status === "PENDING" && (
                              <button
                                onClick={() => handleCancel(app.applyId)}
                                className="text-sm text-red-600 underline hover:text-red-700"
                              >
                                지원취소
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
