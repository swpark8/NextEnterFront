import { createContext, useContext, useState, ReactNode } from "react";
import { ResumeResponse, ResumeSections, PortfolioInfo } from "../api/resume";

// 이력서 타입 (기존 간단한 타입)
export interface Resume {
  id: number;
  title: string;
  industry: string;
  applications: number;
}

// ✅ 상세한 이력서 타입 (백엔드와 동기화)
export interface DetailedResume {
  resumeId: number;
  title: string;
  jobCategory: string;
  skills: string[];
  visibility: "PUBLIC" | "PRIVATE";
  sections: ResumeSections;
  portfolios?: PortfolioInfo[]; // ✅ 포트폴리오 정보 추가
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
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

// 지원 내역 타입
export interface JobApplication {
  id: number;
  jobId: number;
  resumeId: number;
  date: string;
  company: string;
  position: string;
  jobType: string;
  location: string;
  deadline: string;
  viewed: boolean;
  status: "지원완료" | "열람" | "미열람" | "지원취소";
  canCancel: boolean;
}

// ✅ 크레딧 충전 내역 타입
export interface CreditTransaction {
  id: number;
  date: string;
  amount: number;
  type: "충전" | "사용";
  description: string;
  balance: number; // 충전 후 잔액
}

// ✅ 쿠폰 타입
export interface Coupon {
  id: number;
  discount: string;
  label: string;
  expiryDate?: string;
  isUsed: boolean;
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
  // ✅ 상세 리포트 추가
  detailedReport?: {
    competency_scores: Record<string, number>;
    starr_coverage: Record<string, boolean>;
    strengths: string[];
    gaps: string[];
    feedback?: string;
  };
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

// 스카웃 제안 타입
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
  detailedResumes: DetailedResume[]; // ✅ 상세한 이력서 목록
  currentResume: DetailedResume | null; // ✅ 현재 편집 중인 이력서
  jobListings: JobListing[];
  businessJobs: BusinessJob[];
  jobApplications: JobApplication[];
  creditBalance: number;
  setCreditBalance: (balance: number) => void; // ✅ 추가
  creditTransactions: CreditTransaction[];
  coupons: Coupon[];
  matchingHistory: MatchingHistory[];
  interviewResults: InterviewResult[];
  interviewHistories: InterviewHistory[];
  positionOffers: PositionOffer[];
  interviewOffers: InterviewOffer[];
  addResume: (resume: Resume) => void;
  updateResume: (id: number, resume: Resume) => void;
  deleteResume: (id: number) => void;
  setResumes: (resumes: Resume[]) => void;
  setDetailedResumes: (resumes: DetailedResume[]) => void; // ✅ 상세 이력서 목록 설정
  addDetailedResume: (resume: DetailedResume) => void; // ✅ 상세 이력서 추가
  updateDetailedResume: (resumeId: number, resume: DetailedResume) => void; // ✅ 상세 이력서 수정
  deleteDetailedResume: (resumeId: number) => void; // ✅ 상세 이력서 삭제
  setCurrentResume: (resume: DetailedResume | null) => void; // ✅ 현재 이력서 설정
  setJobListings: (jobs: JobListing[]) => void;
  addBusinessJob: (job: BusinessJob) => void;
  updateBusinessJob: (id: number, job: BusinessJob) => void;
  deleteBusinessJob: (id: number) => void;
  setBusinessJobs: (jobs: BusinessJob[]) => void;
  addJobApplication: (application: JobApplication) => void;
  cancelJobApplication: (id: number) => void;
  addCreditTransaction: (
    transaction: Omit<CreditTransaction, "id" | "balance">,
  ) => void;
  useCoupon: (id: number) => void;
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
      const savedResumes = localStorage.getItem("nextenter_resumes");
      if (savedResumes) {
        return JSON.parse(savedResumes);
      }
    } catch (error) {
      console.error("이력서 데이터 로드 실패:", error);
    }
    return [];
  };

  const [resumes, setResumesState] = useState<Resume[]>(
    loadResumesFromStorage(),
  );

  // ✅ 상세한 이력서 데이터 관리
  const loadDetailedResumesFromStorage = () => {
    try {
      const savedResumes = localStorage.getItem("nextenter_detailed_resumes");
      if (savedResumes) {
        return JSON.parse(savedResumes);
      }
    } catch (error) {
      console.error("상세 이력서 데이터 로드 실패:", error);
    }
    return [];
  };

  const [detailedResumes, setDetailedResumesState] = useState<DetailedResume[]>(
    loadDetailedResumesFromStorage(),
  );
  const [currentResume, setCurrentResumeState] =
    useState<DetailedResume | null>(null);

  const [jobListings, setJobListingsState] = useState<JobListing[]>([]);

  // 기업 공고 데이터
  const loadBusinessJobsFromStorage = () => {
    try {
      const savedJobs = localStorage.getItem("nextenter_business_jobs");
      if (savedJobs) {
        return JSON.parse(savedJobs);
      }
    } catch (error) {
      console.error("기업 공고 로드 실패:", error);
    }
    return [];
  };

  const [businessJobs, setBusinessJobsState] = useState<BusinessJob[]>(
    loadBusinessJobsFromStorage(),
  );

  // 지원 내역 데이터
  const loadJobApplicationsFromStorage = () => {
    try {
      const savedApplications = localStorage.getItem(
        "nextenter_job_applications",
      );
      if (savedApplications) {
        return JSON.parse(savedApplications);
      }
    } catch (error) {
      console.error("지원 내역 로드 실패:", error);
    }
    return [];
  };

  const [jobApplications, setJobApplicationsState] = useState<JobApplication[]>(
    loadJobApplicationsFromStorage(),
  );

  // ✅ 크레딧 잔액
  const loadCreditBalanceFromStorage = () => {
    try {
      const savedBalance = localStorage.getItem("nextenter_credit_balance");
      if (savedBalance) {
        return parseInt(savedBalance);
      }
    } catch (error) {
      console.error("크레딧 잔액 로드 실패:", error);
    }
    return 0; // 초기 크레딧 0
  };

  const [creditBalance, setCreditBalanceState] = useState<number>(
    loadCreditBalanceFromStorage(),
  );

  // ✅ 크레딧 잔액 설정 함수
  const setCreditBalance = (balance: number) => {
    setCreditBalanceState(balance);
    try {
      localStorage.setItem("nextenter_credit_balance", balance.toString());
    } catch (error) {
      console.error("크레딧 잔액 저장 실패:", error);
    }
  };

  // ✅ 크레딧 거래 내역
  const loadCreditTransactionsFromStorage = () => {
    try {
      const savedTransactions = localStorage.getItem(
        "nextenter_credit_transactions",
      );
      if (savedTransactions) {
        return JSON.parse(savedTransactions);
      }
    } catch (error) {
      console.error("크레딧 거래 내역 로드 실패:", error);
    }
    return [];
  };

  const [creditTransactions, setCreditTransactionsState] = useState<
    CreditTransaction[]
  >(loadCreditTransactionsFromStorage());

  // ✅ 쿠폰 목록
  const loadCouponsFromStorage = () => {
    try {
      const savedCoupons = localStorage.getItem("nextenter_coupons");
      if (savedCoupons) {
        return JSON.parse(savedCoupons);
      }
    } catch (error) {
      console.error("쿠폰 로드 실패:", error);
    }
    return [];
  };

  const [coupons, setCouponsState] = useState<Coupon[]>(
    loadCouponsFromStorage(),
  );

  // 매칭 히스토리 데이터
  const loadMatchingHistoryFromStorage = () => {
    try {
      const savedHistory = localStorage.getItem("nextenter_matching_history");
      if (savedHistory) {
        return JSON.parse(savedHistory);
      }
    } catch (error) {
      console.error("매칭 히스토리 로드 실패:", error);
    }
    return [];
  };

  const [matchingHistory, setMatchingHistoryState] = useState<
    MatchingHistory[]
  >(loadMatchingHistoryFromStorage());

  // 면접 결과 데이터
  const loadInterviewResultsFromStorage = () => {
    try {
      const savedResults = localStorage.getItem("nextenter_interview_results");
      if (savedResults) {
        return JSON.parse(savedResults);
      }
    } catch (error) {
      console.error("면접 결과 로드 실패:", error);
    }
    return [];
  };

  const [interviewResults, setInterviewResultsState] = useState<
    InterviewResult[]
  >(loadInterviewResultsFromStorage());

  // 면접 히스토리 데이터
  const loadInterviewHistoriesFromStorage = () => {
    try {
      const savedHistories = localStorage.getItem(
        "nextenter_interview_histories",
      );
      if (savedHistories) {
        return JSON.parse(savedHistories);
      }
    } catch (error) {
      console.error("면접 히스토리 로드 실패:", error);
    }
    return [];
  };

  const [interviewHistories, setInterviewHistoriesState] = useState<
    InterviewHistory[]
  >(loadInterviewHistoriesFromStorage());

  // 포지션 제안 데이터
  const loadPositionOffersFromStorage = () => {
    try {
      const savedOffers = localStorage.getItem("nextenter_position_offers");
      if (savedOffers) {
        return JSON.parse(savedOffers);
      }
    } catch (error) {
      console.error("포지션 제안 로드 실패:", error);
    }
    return [];
  };

  const [positionOffers, setPositionOffersState] = useState<PositionOffer[]>(
    loadPositionOffersFromStorage(),
  );

  // 스카웃 제안 데이터
  const loadInterviewOffersFromStorage = () => {
    try {
      const savedOffers = localStorage.getItem("nextenter_interview_offers");
      if (savedOffers) {
        return JSON.parse(savedOffers);
      }
    } catch (error) {
      console.error("스카웃 제안 로드 실패:", error);
    }
    return [];
  };

  const [interviewOffers, setInterviewOffersState] = useState<InterviewOffer[]>(
    loadInterviewOffersFromStorage(),
  );

  const addResume = (resume: Resume) => {
    setResumesState((prev) => {
      const updated = [...prev, resume];
      try {
        localStorage.setItem("nextenter_resumes", JSON.stringify(updated));
      } catch (error) {
        console.error("이력서 저장 실패:", error);
      }
      return updated;
    });
  };

  const updateResume = (id: number, resume: Resume) => {
    setResumesState((prev) => {
      const updated = prev.map((r) => (r.id === id ? resume : r));
      try {
        localStorage.setItem("nextenter_resumes", JSON.stringify(updated));
      } catch (error) {
        console.error("이력서 업데이트 실패:", error);
      }
      return updated;
    });
  };

  const deleteResume = (id: number) => {
    setResumesState((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem("nextenter_resumes", JSON.stringify(updated));
      } catch (error) {
        console.error("이력서 삭제 실패:", error);
      }
      return updated;
    });
  };

  const setResumes = (resumes: Resume[]) => {
    setResumesState(resumes);
    try {
      localStorage.setItem("nextenter_resumes", JSON.stringify(resumes));
    } catch (error) {
      console.error("이력서 저장 실패:", error);
    }
  };

  // ✅ 상세 이력서 관리 함수들
  const setDetailedResumes = (resumes: DetailedResume[]) => {
    setDetailedResumesState(resumes);
    try {
      localStorage.setItem(
        "nextenter_detailed_resumes",
        JSON.stringify(resumes),
      );
    } catch (error) {
      console.error("상세 이력서 저장 실패:", error);
    }
  };

  const addDetailedResume = (resume: DetailedResume) => {
    setDetailedResumesState((prev) => {
      const updated = [...prev, resume];
      try {
        localStorage.setItem(
          "nextenter_detailed_resumes",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("상세 이력서 추가 실패:", error);
      }
      return updated;
    });
  };

  const updateDetailedResume = (resumeId: number, resume: DetailedResume) => {
    setDetailedResumesState((prev) => {
      const updated = prev.map((r) => (r.resumeId === resumeId ? resume : r));
      try {
        localStorage.setItem(
          "nextenter_detailed_resumes",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("상세 이력서 업데이트 실패:", error);
      }
      return updated;
    });
  };

  const deleteDetailedResume = (resumeId: number) => {
    setDetailedResumesState((prev) => {
      const updated = prev.filter((r) => r.resumeId !== resumeId);
      try {
        localStorage.setItem(
          "nextenter_detailed_resumes",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("상세 이력서 삭제 실패:", error);
      }
      return updated;
    });
  };

  const setCurrentResume = (resume: DetailedResume | null) => {
    setCurrentResumeState(resume);
  };

  const setJobListings = (jobs: JobListing[]) => {
    setJobListingsState(jobs);
  };

  const addBusinessJob = (job: BusinessJob) => {
    setBusinessJobsState((prev) => {
      const updated = [...prev, job];
      try {
        localStorage.setItem(
          "nextenter_business_jobs",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("기업 공고 저장 실패:", error);
      }
      return updated;
    });
  };

  const updateBusinessJob = (id: number, job: BusinessJob) => {
    setBusinessJobsState((prev) => {
      const updated = prev.map((j) => (j.id === id ? job : j));
      try {
        localStorage.setItem(
          "nextenter_business_jobs",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("기업 공고 업데이트 실패:", error);
      }
      return updated;
    });
  };

  const deleteBusinessJob = (id: number) => {
    setBusinessJobsState((prev) => {
      const updated = prev.filter((j) => j.id !== id);
      try {
        localStorage.setItem(
          "nextenter_business_jobs",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("기업 공고 삭제 실패:", error);
      }
      return updated;
    });
  };

  const setBusinessJobs = (jobs: BusinessJob[]) => {
    setBusinessJobsState(jobs);
    try {
      localStorage.setItem("nextenter_business_jobs", JSON.stringify(jobs));
    } catch (error) {
      console.error("기업 공고 저장 실패:", error);
    }
  };

  // 지원 내역 추가
  const addJobApplication = (application: JobApplication) => {
    setJobApplicationsState((prev) => {
      const updated = [application, ...prev];
      try {
        localStorage.setItem(
          "nextenter_job_applications",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("지원 내역 저장 실패:", error);
      }
      return updated;
    });
  };

  // 지원 취소
  const cancelJobApplication = (id: number) => {
    setJobApplicationsState((prev) => {
      const updated = prev.map((app) =>
        app.id === id
          ? { ...app, status: "지원취소" as const, canCancel: false }
          : app,
      );
      try {
        localStorage.setItem(
          "nextenter_job_applications",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("지원 취소 실패:", error);
      }
      return updated;
    });
  };

  // ✅ 크레딧 거래 추가 (충전 또는 사용)
  const addCreditTransaction = (
    transaction: Omit<CreditTransaction, "id" | "balance">,
  ) => {
    const newBalance = creditBalance + transaction.amount;
    const newTransaction: CreditTransaction = {
      ...transaction,
      id: Date.now(),
      balance: newBalance,
    };

    setCreditTransactionsState((prev) => {
      const updated = [newTransaction, ...prev];
      try {
        localStorage.setItem(
          "nextenter_credit_transactions",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("크레딧 거래 저장 실패:", error);
      }
      return updated;
    });

    setCreditBalance(newBalance);
  };

  // ✅ 쿠폰 사용
  const useCoupon = (id: number) => {
    setCouponsState((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, isUsed: true } : c,
      );
      try {
        localStorage.setItem("nextenter_coupons", JSON.stringify(updated));
      } catch (error) {
        console.error("쿠폰 사용 저장 실패:", error);
      }
      return updated;
    });
  };

  const addMatchingHistory = (history: MatchingHistory) => {
    setMatchingHistoryState((prev) => {
      const updated = [history, ...prev];
      try {
        localStorage.setItem(
          "nextenter_matching_history",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("매칭 히스토리 저장 실패:", error);
      }
      return updated;
    });
  };

  const clearMatchingHistory = () => {
    setMatchingHistoryState([]);
    try {
      localStorage.removeItem("nextenter_matching_history");
    } catch (error) {
      console.error("매칭 히스토리 삭제 실패:", error);
    }
  };

  const addInterviewResult = (result: InterviewResult) => {
    setInterviewResultsState((prev) => {
      const updated = [result, ...prev];
      try {
        localStorage.setItem(
          "nextenter_interview_results",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("면접 결과 저장 실패:", error);
      }
      return updated;
    });
  };

  const clearInterviewResults = () => {
    setInterviewResultsState([]);
    try {
      localStorage.removeItem("nextenter_interview_results");
    } catch (error) {
      console.error("면접 결과 삭제 실패:", error);
    }
  };

  const addInterviewHistory = (history: InterviewHistory) => {
    setInterviewHistoriesState((prev) => {
      const updated = [history, ...prev];
      try {
        localStorage.setItem(
          "nextenter_interview_histories",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("면접 히스토리 저장 실패:", error);
      }
      return updated;
    });
  };

  const clearInterviewHistories = () => {
    setInterviewHistoriesState([]);
    try {
      localStorage.removeItem("nextenter_interview_histories");
    } catch (error) {
      console.error("면접 히스토리 삭제 실패:", error);
    }
  };

  const addPositionOffer = (offer: PositionOffer) => {
    setPositionOffersState((prev) => {
      const updated = [offer, ...prev];
      try {
        localStorage.setItem(
          "nextenter_position_offers",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("포지션 제안 저장 실패:", error);
      }
      return updated;
    });
  };

  const deletePositionOffer = (id: number) => {
    setPositionOffersState((prev) => {
      const updated = prev.filter((o) => o.id !== id);
      try {
        localStorage.setItem(
          "nextenter_position_offers",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("포지션 제안 삭제 실패:", error);
      }
      return updated;
    });
  };

  const addInterviewOffer = (offer: InterviewOffer) => {
    setInterviewOffersState((prev) => {
      const updated = [offer, ...prev];
      try {
        localStorage.setItem(
          "nextenter_interview_offers",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("스카웃 제안 저장 실패:", error);
      }
      return updated;
    });
  };

  const deleteInterviewOffer = (id: number) => {
    setInterviewOffersState((prev) => {
      const updated = prev.filter((o) => o.id !== id);
      try {
        localStorage.setItem(
          "nextenter_interview_offers",
          JSON.stringify(updated),
        );
      } catch (error) {
        console.error("스카웃 제안 삭제 실패:", error);
      }
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        resumes,
        detailedResumes, // ✅ 상세 이력서 목록
        currentResume, // ✅ 현재 이력서
        jobListings,
        businessJobs,
        jobApplications,
        creditBalance,
        setCreditBalance, // ✅ 추가
        creditTransactions,
        coupons,
        matchingHistory,
        interviewResults,
        interviewHistories,
        positionOffers,
        interviewOffers,
        addResume,
        updateResume,
        deleteResume,
        setResumes,
        setDetailedResumes, // ✅ 상세 이력서 목록 설정
        addDetailedResume, // ✅ 상세 이력서 추가
        updateDetailedResume, // ✅ 상세 이력서 업데이트
        deleteDetailedResume, // ✅ 상세 이력서 삭제
        setCurrentResume, // ✅ 현재 이력서 설정
        setJobListings,
        addBusinessJob,
        updateBusinessJob,
        deleteBusinessJob,
        setBusinessJobs,
        addJobApplication,
        cancelJobApplication,
        addCreditTransaction,
        useCoupon,
        addMatchingHistory,
        clearMatchingHistory,
        addInterviewResult,
        clearInterviewResults,
        addInterviewHistory,
        clearInterviewHistories,
        addPositionOffer,
        deletePositionOffer,
        addInterviewOffer,
        deleteInterviewOffer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
