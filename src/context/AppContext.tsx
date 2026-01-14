import { createContext, useContext, useState, ReactNode } from 'react';

// 이력서 타입
export interface Resume {
  id: number;
  title: string;
  industry: string;
  applications: number;
}

// 채용공고 타입 (일반 사용자용)
export interface JobListing {
  id: number;
  company: string;
  title: string;
  requirements: string[];
  tags: string[];
  location: string;
  deadline: string;
  daysLeft: number;
}

// 기업 공고 타입
export interface BusinessJob {
  id: number;
  title: string;
  status: "ACTIVE" | "CLOSED" | "EXPIRED";
  job_category: string;
  location: string;
  experience_min?: number;
  experience_max?: number;
  salary_min?: number;
  salary_max?: number;
  deadline: string;
  view_count: number;
  applicant_count: number;
  bookmark_count: number;
  created_at: string;
}

// 매칭 히스토리 타입
export interface MatchingHistory {
  id: number;
  date: string;
  time: string;
  resume: string;
  resumeId: number;
  company: string;
  position: string;
  jobId: number;
  score: number;
  suitable: boolean;
  techMatch: { [key: string]: number };
  strengths: string[];
  improvements: string[];
}

interface AppContextType {
  resumes: Resume[];
  jobListings: JobListing[];
  businessJobs: BusinessJob[];
  matchingHistory: MatchingHistory[];
  addResume: (resume: Resume) => void;
  updateResume: (id: number, resume: Resume) => void;
  deleteResume: (id: number) => void;
  setResumes: (resumes: Resume[]) => void;
  setJobListings: (jobs: JobListing[]) => void;
  addBusinessJob: (job: BusinessJob) => void;
  updateBusinessJob: (id: number, job: BusinessJob) => void;
  deleteBusinessJob: (id: number) => void;
  setBusinessJobs: (jobs: BusinessJob[]) => void;
  addMatchingHistory: (history: MatchingHistory) => void;
  clearMatchingHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // localStorage에서 이력서 데이터 불러오기
  const loadResumesFromStorage = () => {
    try {
      const savedResumes = localStorage.getItem('nextenter_resumes');
      if (savedResumes) {
        return JSON.parse(savedResumes);
      }
    } catch (error) {
      console.error('이력서 데이터 로드 실패:', error);
    }
    // 빈 배열로 시작 - 실제로 작성한 이력서만 저장됨
    return [];
  };

  const [resumes, setResumesState] = useState<Resume[]>(loadResumesFromStorage());

  const [jobListings, setJobListingsState] = useState<JobListing[]>([
    {
      id: 1,
      company: "(주)스포츠와이드넷",
      title: "경제통계팀(천연가스 사업자) (주)스포츠와이드넷 안내포스 직원 모집",
      requirements: ["인턴/수습", "고졸이상", "경력무관", "정규직/계약직"],
      tags: ["세후", "주휴 급여"],
      location: "서울 강북구",
      deadline: "~ 01.31(금)",
      daysLeft: 20,
    },
    {
      id: 2,
      company: "24시간다줌홈빌",
      title: "[주4일/아파트 경비원캐디/파트타임종합판매] 본사 직영사 모집 공고",
      requirements: ["인턴/수습", "정규직/계약"],
      tags: ["1일(근무)시간", "19개월 주 휴무"],
      location: "서울 마포구",
      deadline: "~ 02.14(금)",
      daysLeft: 39,
    },
    {
      id: 3,
      company: "(주)비에이치씨",
      title: "[삼성전자 수리/서비스] 서비스센터 매뉴얼집 제공자님",
      requirements: ["프로필", "학력", "사회", "경험없어도 무관"],
      tags: ["일주 4-5일 근무 금일고", "내일고 주 휴무"],
      location: "경기 화성",
      deadline: "~ 02.11(화)",
      daysLeft: 34,
    },
    {
      id: 4,
      company: "(주)테크솔루션",
      title: "백엔드 개발자 (Java/Spring) 경력 3년 이상",
      requirements: ["경력 3년↑", "대졸이상", "정규직"],
      tags: ["4대보험", "연봉협상"],
      location: "서울 강남구",
      deadline: "~ 02.28(금)",
      daysLeft: 45,
    },
    {
      id: 5,
      company: "네이버",
      title: "프론트엔드 개발자 (React/TypeScript)",
      requirements: ["경력 2년↑", "대졸이상", "정규직"],
      tags: ["4대보험", "연봉상위"],
      location: "경기 성남시",
      deadline: "~ 03.15(금)",
      daysLeft: 60,
    },
    {
      id: 6,
      company: "카카오",
      title: "React 개발자 신입/경력",
      requirements: ["신입/경력", "대졸이상", "정규직"],
      tags: ["스톡옵션", "자율출퇴근"],
      location: "경기 성남시",
      deadline: "~ 03.31(화)",
      daysLeft: 76,
    },
    {
      id: 7,
      company: "토스",
      title: "풀스택 엔지니어 (React/Node.js)",
      requirements: ["경력 3년↑", "대졸이상", "정규직"],
      tags: ["고연봉", "성과급"],
      location: "서울 강남구",
      deadline: "~ 02.20(목)",
      daysLeft: 37,
    },
    {
      id: 8,
      company: "당근마켓",
      title: "웹 개발자 (프론트엔드)",
      requirements: ["경력 1년↑", "학력무관", "정규직"],
      tags: ["재택근무", "유연근무"],
      location: "서울 강남구",
      deadline: "~ 03.10(월)",
      daysLeft: 55,
    },
    {
      id: 9,
      company: "쿠팡",
      title: "Frontend Developer (React)",
      requirements: ["경력 2년↑", "대졸이상", "정규직"],
      tags: ["4대보험", "식대지원"],
      location: "서울 송파구",
      deadline: "~ 03.25(화)",
      daysLeft: 70,
    },
  ]);

  // 기업 공고 데이터 (기업 서비스용)
  const loadBusinessJobsFromStorage = () => {
    try {
      const savedJobs = localStorage.getItem('nextenter_business_jobs');
      if (savedJobs) {
        return JSON.parse(savedJobs);
      }
    } catch (error) {
      console.error('기업 공고 로드 실패:', error);
    }
    // 기본 샘플 데이터
    return [
      {
        id: 1,
        title: "프론트엔드 개발자",
        status: "ACTIVE" as const,
        job_category: "프론트엔드 개발자",
        location: "서울 강남구",
        experience_min: 5,
        experience_max: undefined,
        salary_min: 6000,
        salary_max: 6000,
        deadline: "2024-12-31",
        view_count: 120,
        applicant_count: 42,
        bookmark_count: 15,
        created_at: "2024-12-01",
      },
      {
        id: 2,
        title: "백엔드 개발자",
        status: "ACTIVE" as const,
        job_category: "백엔드 개발자",
        location: "서울 강북구",
        experience_min: 3,
        experience_max: undefined,
        salary_min: 5000,
        salary_max: 7000,
        deadline: "2024-12-28",
        view_count: 98,
        applicant_count: 38,
        bookmark_count: 12,
        created_at: "2024-11-28",
      },
      {
        id: 3,
        title: "풀스택 개발자",
        status: "ACTIVE" as const,
        job_category: "풀스택 개발자",
        location: "서울 송파구",
        experience_min: 3,
        experience_max: undefined,
        salary_min: 4500,
        salary_max: 6500,
        deadline: "2024-12-25",
        view_count: 156,
        applicant_count: 29,
        bookmark_count: 20,
        created_at: "2024-11-20",
      },
      {
        id: 4,
        title: "DevOps 엔지니어",
        status: "CLOSED" as const,
        job_category: "DevOps",
        location: "서울 마포구",
        experience_min: 5,
        experience_max: undefined,
        salary_min: 6500,
        salary_max: 8500,
        deadline: "2024-11-30",
        view_count: 245,
        applicant_count: 67,
        bookmark_count: 32,
        created_at: "2024-11-15",
      },
    ];
  };

  const [businessJobs, setBusinessJobsState] = useState<BusinessJob[]>(loadBusinessJobsFromStorage());

  // 매칭 히스토리 데이터
  const loadMatchingHistoryFromStorage = () => {
    try {
      const savedHistory = localStorage.getItem('nextenter_matching_history');
      if (savedHistory) {
        return JSON.parse(savedHistory);
      }
    } catch (error) {
      console.error('매칭 히스토리 로드 실패:', error);
    }
    return [];
  };

  const [matchingHistory, setMatchingHistoryState] = useState<MatchingHistory[]>(loadMatchingHistoryFromStorage());

  const addResume = (resume: Resume) => {
    setResumesState(prev => {
      const updated = [...prev, resume];
      // localStorage에 저장
      try {
        localStorage.setItem('nextenter_resumes', JSON.stringify(updated));
      } catch (error) {
        console.error('이력서 저장 실패:', error);
      }
      return updated;
    });
  };

  const updateResume = (id: number, resume: Resume) => {
    setResumesState(prev => {
      const updated = prev.map(r => r.id === id ? resume : r);
      // localStorage에 저장
      try {
        localStorage.setItem('nextenter_resumes', JSON.stringify(updated));
      } catch (error) {
        console.error('이력서 업데이트 실패:', error);
      }
      return updated;
    });
  };

  const deleteResume = (id: number) => {
    setResumesState(prev => {
      const updated = prev.filter(r => r.id !== id);
      // localStorage에 저장
      try {
        localStorage.setItem('nextenter_resumes', JSON.stringify(updated));
      } catch (error) {
        console.error('이력서 삭제 실패:', error);
      }
      return updated;
    });
  };

  const setResumes = (resumes: Resume[]) => {
    setResumesState(resumes);
    // localStorage에 저장
    try {
      localStorage.setItem('nextenter_resumes', JSON.stringify(resumes));
    } catch (error) {
      console.error('이력서 저장 실패:', error);
    }
  };

  const setJobListings = (jobs: JobListing[]) => {
    setJobListingsState(jobs);
  };

  const addBusinessJob = (job: BusinessJob) => {
    setBusinessJobsState(prev => {
      const updated = [...prev, job];
      // localStorage에 저장
      try {
        localStorage.setItem('nextenter_business_jobs', JSON.stringify(updated));
      } catch (error) {
        console.error('기업 공고 저장 실패:', error);
      }
      return updated;
    });
  };

  const updateBusinessJob = (id: number, job: BusinessJob) => {
    setBusinessJobsState(prev => {
      const updated = prev.map(j => j.id === id ? job : j);
      // localStorage에 저장
      try {
        localStorage.setItem('nextenter_business_jobs', JSON.stringify(updated));
      } catch (error) {
        console.error('기업 공고 업데이트 실패:', error);
      }
      return updated;
    });
  };

  const deleteBusinessJob = (id: number) => {
    setBusinessJobsState(prev => {
      const updated = prev.filter(j => j.id !== id);
      // localStorage에 저장
      try {
        localStorage.setItem('nextenter_business_jobs', JSON.stringify(updated));
      } catch (error) {
        console.error('기업 공고 삭제 실패:', error);
      }
      return updated;
    });
  };

  const setBusinessJobs = (jobs: BusinessJob[]) => {
    setBusinessJobsState(jobs);
    // localStorage에 저장
    try {
      localStorage.setItem('nextenter_business_jobs', JSON.stringify(jobs));
    } catch (error) {
      console.error('기업 공고 저장 실패:', error);
    }
  };

  const addMatchingHistory = (history: MatchingHistory) => {
    setMatchingHistoryState(prev => {
      const updated = [history, ...prev]; // 최신 기록이 맨 위로
      // localStorage에 저장
      try {
        localStorage.setItem('nextenter_matching_history', JSON.stringify(updated));
      } catch (error) {
        console.error('매칭 히스토리 저장 실패:', error);
      }
      return updated;
    });
  };

  const clearMatchingHistory = () => {
    setMatchingHistoryState([]);
    // localStorage에서도 삭제
    try {
      localStorage.removeItem('nextenter_matching_history');
    } catch (error) {
      console.error('매칭 히스토리 삭제 실패:', error);
    }
  };

  return (
    <AppContext.Provider 
      value={{ 
        resumes, 
        jobListings,
        businessJobs,
        matchingHistory,
        addResume, 
        updateResume, 
        deleteResume,
        setResumes,
        setJobListings,
        addBusinessJob,
        updateBusinessJob,
        deleteBusinessJob,
        setBusinessJobs,
        addMatchingHistory,
        clearMatchingHistory
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
