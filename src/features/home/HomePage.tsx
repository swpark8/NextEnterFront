import { useState } from "react";
import Sidebar from "./components/Sidebar";
import JobCard from "./components/JobCard";
import JobImageCard from "./components/JobImageCard";

export default function HomePage() {
  const [showMustSee, setShowMustSee] = useState(true);

  const handleJobClick = (id: number) => {
    console.log(`공고 ${id} 클릭됨`);
  };

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
  ];

  const mustSeeJobs = [
    { id: 1, isFavorite: true },
    { id: 2, isFavorite: false },
    { id: 3, isFavorite: false },
    { id: 4, isFavorite: false },
  ];

  return (
    <main className="px-4 py-8 mx-auto max-w-7xl">
      <div className="flex gap-8">
        <Sidebar />

        <div className="flex-1 space-y-8">
          <section>
            <div className="flex items-center mb-4">
              <span className="mr-2 text-2xl">🎉</span>
              <h2 className="text-xl font-bold">회원님을 위한 추천 공고</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <JobCard
                title="마감 임박"
                company="지금 지원하세요"
                location="마감일: D-3"
                salary="서두르세요!"
                onClick={() => handleJobClick(0)}
              />
              {recommendedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  salary={job.salary}
                  onClick={() => handleJobClick(job.id)}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="mustSee"
                checked={showMustSee}
                onChange={(e) => setShowMustSee(e.target.checked)}
                className="w-5 h-5 mr-2 text-green-500 rounded"
              />
              <label htmlFor="mustSee" className="text-lg font-semibold">
                회원님이 꼭 봐야 할 공고
              </label>
            </div>

            {showMustSee && (
              <div className="grid grid-cols-4 gap-4">
                {mustSeeJobs.map((job) => (
                  <JobImageCard
                    key={job.id}
                    isFavorite={job.isFavorite}
                    onClick={() => handleJobClick(job.id + 10)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="w-64">{/* 추가 컨텐츠 공간 */}</div>
      </div>
    </main>
  );
}
