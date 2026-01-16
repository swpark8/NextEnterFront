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

// 면접 결과 타입
export interface InterviewResult {
  id: number;
  date: string;
  time: string;
  level: "주니어" | "시니어";
  totalQuestions: number;
  goodAnswers: number;
  score: number;
  duration: string;
  result: "합격" | "불합격";
}

// 면접 질문-답변 타입
export interface InterviewQA {
  question: string;
  answer: string;
  score: number;
}

// 면접 히스토리 상세 타입
export interface InterviewHistory {
  id: number;
  date: string;
  time: string;
  level: "주니어" | "시니어";
  score: number;
  result: "합격" | "불합격";
  qaList: InterviewQA[];
}

// 포지션 제안 타입
export interface PositionOffer {
  id: number;
  company: string;
  sender: string;
  position: string;
  date: string;
  message: string;
  jobTitle: string;
  salary: string;
  location: string;
  tags: string[];
  jobId?: number;
}

// 면접 제안 타입
export interface InterviewOffer {
  id: number;
  company: string;
  position: string;
  date: string;
  status: string;
  content: string;
  location: string;
  jobId?: number;
}

interface AppContextType {
  resumes: Resume[];
  jobListings: JobListing[];
  businessJobs: BusinessJob[];
  matchingHistory: MatchingHistory[];
  interviewResults: InterviewResult[];
  interviewHistories: InterviewHistory[];
  positionOffers: PositionOffer[];
  interviewOffers: InterviewOffer[];
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
  addInterviewResult: (result: InterviewResult) => void;
  clearInterviewResults: () => void;
  addInterviewHistory: (history: InterviewHistory) => void;
  clearInterviewHistories: () => void;
  addPositionOffer: (offer: PositionOffer) => void;
  deletePositionOffer: (id: number) => void;
  addInterviewOffer: (offer: InterviewOffer) => void;
  deleteInterviewOffer: (id: number) => void;
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

  // 채용공고는 하드코딩 없이 빈 배열로 시작 (실제 API에서 가져오거나 사용자가 생성한 데이터만 표시)
  const [jobListings, setJobListingsState] = useState<JobListing[]>([]);

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
    // 하드코딩 제거 - 빈 배열로 시작 (사용자가 직접 등록한 공고만 표시)
    return [];
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

  // 면접 결과 데이터
  const loadInterviewResultsFromStorage = () => {
    try {
      const savedResults = localStorage.getItem('nextenter_interview_results');
      if (savedResults) {
        return JSON.parse(savedResults);
      }
    } catch (error) {
      console.error('면접 결과 로드 실패:', error);
    }
    return [];
  };

  const [interviewResults, setInterviewResultsState] = useState<InterviewResult[]>(loadInterviewResultsFromStorage());

  // 면접 히스토리 데이터 (질문-답변 포함)
  const loadInterviewHistoriesFromStorage = () => {
    try {
      const savedHistories = localStorage.getItem('nextenter_interview_histories');
      if (savedHistories) {
        return JSON.parse(savedHistories);
      }
    } catch (error) {
      console.error('면접 히스토리 로드 실패:', error);
    }
    return [];
  };

  const [interviewHistories, setInterviewHistoriesState] = useState<InterviewHistory[]>(loadInterviewHistoriesFromStorage());

  // 포지션 제안 데이터
  const loadPositionOffersFromStorage = () => {
    try {
      const savedOffers = localStorage.getItem('nextenter_position_offers');
      if (savedOffers) {
        return JSON.parse(savedOffers);
      }
    } catch (error) {
      console.error('포지션 제안 로드 실패:', error);
    }
    return [];
  };

  const [positionOffers, setPositionOffersState] = useState<PositionOffer[]>(loadPositionOffersFromStorage());

  // 면접 제안 데이터
  const loadInterviewOffersFromStorage = () => {
    try {
      const savedOffers = localStorage.getItem('nextenter_interview_offers');
      if (savedOffers) {
        return JSON.parse(savedOffers);
      }
    } catch (error) {
      console.error('면접 제안 로드 실패:', error);
    }
    return [];
  };

  const [interviewOffers, setInterviewOffersState] = useState<InterviewOffer[]>(loadInterviewOffersFromStorage());

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

  const addInterviewResult = (result: InterviewResult) => {
    setInterviewResultsState(prev => {
      const updated = [result, ...prev]; // 최신 기록이 맨 위로
      // localStorage에 저장
      try {
        localStorage.setItem('nextenter_interview_results', JSON.stringify(updated));
      } catch (error) {
        console.error('면접 결과 저장 실패:', error);
      }
      return updated;
    });
  };

  const clearInterviewResults = () => {
    setInterviewResultsState([]);
    // localStorage에서도 삭제
    try {
      localStorage.removeItem('nextenter_interview_results');
    } catch (error) {
      console.error('면접 결과 삭제 실패:', error);
    }
  };

  const addInterviewHistory = (history: InterviewHistory) => {
    setInterviewHistoriesState(prev => {
      const updated = [history, ...prev]; // 최신 기록이 맨 위로
      // localStorage에 저장
      try {
        localStorage.setItem('nextenter_interview_histories', JSON.stringify(updated));
      } catch (error) {
        console.error('면접 히스토리 저장 실패:', error);
      }
      return updated;
    });
  };

  const clearInterviewHistories = () => {
    setInterviewHistoriesState([]);
    // localStorage에서도 삭제
    try {
      localStorage.removeItem('nextenter_interview_histories');
    } catch (error) {
      console.error('면접 히스토리 삭제 실패:', error);
    }
  };

  const addPositionOffer = (offer: PositionOffer) => {
    setPositionOffersState(prev => {
      const updated = [offer, ...prev];
      try {
        localStorage.setItem('nextenter_position_offers', JSON.stringify(updated));
      } catch (error) {
        console.error('포지션 제안 저장 실패:', error);
      }
      return updated;
    });
  };

  const deletePositionOffer = (id: number) => {
    setPositionOffersState(prev => {
      const updated = prev.filter(o => o.id !== id);
      try {
        localStorage.setItem('nextenter_position_offers', JSON.stringify(updated));
      } catch (error) {
        console.error('포지션 제안 삭제 실패:', error);
      }
      return updated;
    });
  };

  const addInterviewOffer = (offer: InterviewOffer) => {
    setInterviewOffersState(prev => {
      const updated = [offer, ...prev];
      try {
        localStorage.setItem('nextenter_interview_offers', JSON.stringify(updated));
      } catch (error) {
        console.error('면접 제안 저장 실패:', error);
      }
      return updated;
    });
  };

  const deleteInterviewOffer = (id: number) => {
    setInterviewOffersState(prev => {
      const updated = prev.filter(o => o.id !== id);
      try {
        localStorage.setItem('nextenter_interview_offers', JSON.stringify(updated));
      } catch (error) {
        console.error('면접 제안 삭제 실패:', error);
      }
      return updated;
    });
  };

  return (
    <AppContext.Provider 
      value={{ 
        resumes, 
        jobListings,
        businessJobs,
        matchingHistory,
        interviewResults,
        interviewHistories,
        positionOffers,
        interviewOffers,
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
        clearMatchingHistory,
        addInterviewResult,
        clearInterviewResults,
        addInterviewHistory,
        clearInterviewHistories,
        addPositionOffer,
        deletePositionOffer,
        addInterviewOffer,
        deleteInterviewOffer
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
