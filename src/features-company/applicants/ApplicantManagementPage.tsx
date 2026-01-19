import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";

interface Applicant {
  id: number;
  name: string;
  age: number;
  jobPosting: string;
  jobCategory: string;
  skills: string[];
  experience: string;
  score: number;
  appliedDate: string;
}

export default function ApplicantManagementPage() {
  const navigate = useNavigate();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation(
    "applicants",
    "applicants-sub-1"
  );

  const [selectedJobPosting, setSelectedJobPosting] = useState("전체");
  const [selectedJobCategory, setSelectedJobCategory] = useState("전체");
  const [experienceRange, setExperienceRange] = useState("전체");

  // 화면 맨 위로 올림
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const applicants: Applicant[] = [
    {
      id: 1,
      name: "김민준",
      age: 28,
      jobPosting: "시니어 프론트엔드 개발자 채용",
      jobCategory: "프론트엔드 개발자",
      skills: ["React", "TypeScript", "Node.js"],
      experience: "5년",
      score: 92,
      appliedDate: "2024.12.19",
    },
    {
      id: 2,
      name: "이서윤",
      age: 26,
      jobPosting: "주니어 프론트엔드 개발자",
      jobCategory: "프론트엔드 개발자",
      skills: ["Vue.js", "JavaScript", "CSS"],
      experience: "3년",
      score: 88,
      appliedDate: "2024.12.14",
    },
    {
      id: 3,
      name: "박지후",
      age: 32,
      jobPosting: "백엔드 개발자 (Node.js)",
      jobCategory: "백엔드 개발자",
      skills: ["React", "Next.js", "GraphQL"],
      experience: "7년",
      score: 95,
      appliedDate: "2024.12.13",
    },
    {
      id: 4,
      name: "최수아",
      age: 24,
      jobPosting: "주니어 프론트엔드 개발자",
      jobCategory: "프론트엔드 개발자",
      skills: ["React", "TypeScript", "Tailwind"],
      experience: "2년",
      score: 85,
      appliedDate: "2024.12.12",
    },
    {
      id: 5,
      name: "정현우",
      age: 29,
      jobPosting: "풀스택 개발자 (React + Spring)",
      jobCategory: "풀스택 개발자",
      skills: ["Angular", "TypeScript", "RxJS"],
      experience: "4년",
      score: 90,
      appliedDate: "2024.12.11",
    },
    {
      id: 6,
      name: "김예은",
      age: 27,
      jobPosting: "시니어 프론트엔드 개발자 채용",
      jobCategory: "프론트엔드 개발자",
      skills: ["React", "Redux", "Jest"],
      experience: "4년",
      score: 87,
      appliedDate: "2024.12.10",
    },
  ];

  const uniqueJobPostings = [
    "전체",
    ...Array.from(new Set(applicants.map((a) => a.jobPosting))),
  ];

  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
      "bg-teal-500",
      "bg-violet-500",
    ];
    return colors[id % colors.length];
  };

  const handleApplicantClick = (applicantId: number) => {
    navigate(`/company/applicants/${applicantId}`);
  };

  const handleJobPostingClick = (jobPosting: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJobPosting(jobPosting);
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const jobPostingMatch =
      selectedJobPosting === "전체" ||
      applicant.jobPosting === selectedJobPosting;

    const jobCategoryMatch =
      selectedJobCategory === "전체" ||
      applicant.jobCategory === selectedJobCategory;

    const experienceMatch =
      experienceRange === "전체" ||
      (experienceRange === "1-3년" &&
        parseInt(applicant.experience) >= 1 &&
        parseInt(applicant.experience) <= 3) ||
      (experienceRange === "3-5년" &&
        parseInt(applicant.experience) >= 3 &&
        parseInt(applicant.experience) <= 5) ||
      (experienceRange === "5년+" && parseInt(applicant.experience) >= 5);

    return jobPostingMatch && jobCategoryMatch && experienceMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ [수정 1] 화면 폭 확장: max-w-screen-2xl */}
      <div className="flex gap-10 px-6 py-8 mx-auto max-w-screen-2xl">
        {/* 왼쪽 사이드바 */}
        {/* ✅ flex-shrink-0: 사이드바 크기 절대 고정 */}
        <aside className="flex-shrink-0 hidden w-64 lg:block">
          <CompanyLeftSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />
        </aside>

        {/* 메인 컨텐츠 */}
        {/* ✅ min-w-0: 내용물이 넘쳐도 레이아웃 깨짐 방지 */}
        <main className="flex-1 min-w-0">
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            <h1 className="mb-8 text-2xl font-bold">지원자 관리</h1>

            {/* 필터 섹션 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  공고 선택
                </label>
                <select
                  value={selectedJobPosting}
                  onChange={(e) => setSelectedJobPosting(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  {uniqueJobPostings.map((posting, idx) => (
                    <option key={idx} value={posting}>
                      {posting}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  직무 선택
                </label>
                <select
                  value={selectedJobCategory}
                  onChange={(e) => setSelectedJobCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="전체">전체</option>
                  <option value="프론트엔드 개발자">프론트엔드 개발자</option>
                  <option value="백엔드 개발자">백엔드 개발자</option>
                  <option value="풀스택 개발자">풀스택 개발자</option>
                  <option value="PM">PM</option>
                  <option value="데이터 분석가">데이터 분석가</option>
                  <option value="디자이너">디자이너</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  경력 범위
                </label>
                <select
                  value={experienceRange}
                  onChange={(e) => setExperienceRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="전체">전체</option>
                  <option value="1-3년">1-3년</option>
                  <option value="3-5년">3-5년</option>
                  <option value="5년+">5년 이상</option>
                </select>
              </div>
            </div>

            {/* 지원자 테이블 */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {/* ✅ [수정 2] whitespace-nowrap 추가: 제목 줄바꿈 방지 */}
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      지원 공고
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      지원자
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      나이
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      주요 스킬
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      경력
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 whitespace-nowrap">
                      지원일
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      onClick={() => handleApplicantClick(applicant.id)}
                      className="transition cursor-pointer hover:bg-purple-50"
                    >
                      {/* ✅ [수정 3] 내용 줄바꿈 방지 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) =>
                            handleJobPostingClick(applicant.jobPosting, e)
                          }
                          className="px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                        >
                          {applicant.jobPosting}
                        </button>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full ${getAvatarColor(
                              applicant.id
                            )} flex items-center justify-center text-white font-bold shrink-0`}
                          >
                            {getInitials(applicant.name)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {applicant.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-purple-600">
                          {applicant.age}세
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {/* 스킬 태그는 칸이 모자르면 줄바꿈 되는게 자연스러워서 여기만 wrap 허용 */}
                        <div className="flex flex-wrap gap-2 min-w-[200px]">
                          {applicant.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full whitespace-nowrap"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-sm font-semibold text-white bg-purple-500 rounded-full">
                          {applicant.experience}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {applicant.appliedDate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredApplicants.length === 0 && (
              <div className="py-20 text-center text-gray-500">
                <div className="mb-4 text-4xl">📭</div>
                <div className="text-lg font-medium">
                  해당 조건의 지원자가 없습니다
                </div>
                <div className="text-sm">다른 조건으로 검색해보세요</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
