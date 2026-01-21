import api from "./axios";

const API_BASE_URL = "/api/resume";

// 인재 검색 응답 타입
export interface TalentSearchResponse {
  resumeId: number;
  userId: number;
  name: string; // 마스킹된 이름
  jobCategory: string;
  skills: string[];
  location: string;
  experienceYears: number;
  salaryRange: string;
  matchScore: number;
  isAvailable: boolean;
  viewCount: number;
}

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// ✅ 인재 검색 - 공개된 이력서만 가져오기
export const searchTalents = async (params?: {
  jobCategory?: string;
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<TalentSearchResponse>> => {
  console.log("🔍 [인재검색] 검색 파라미터:", params);
  
  // 백엔드 /api/resume/search 엔드포인트 호출
  console.log("🚀 [인재검색] /api/resume/search 호출 시도...");
  const response = await api.get(`${API_BASE_URL}/search`, { params });
  console.log("✅ [인재검색] 검색 결과:", response.data);
  return response.data;
};

// ✅ 인재 저장 (북마크)
export const saveTalent = async (resumeId: number, companyUserId: number) => {
  const response = await api.post(`${API_BASE_URL}/save/${resumeId}`, null, {
    headers: {
      userId: companyUserId.toString(),
    },
  });
  return response.data;
};

// ✅ 인재 저장 취소
export const unsaveTalent = async (resumeId: number, companyUserId: number) => {
  const response = await api.delete(`${API_BASE_URL}/save/${resumeId}`, {
    headers: {
      userId: companyUserId.toString(),
    },
  });
  return response.data;
};

// ✅ 인재 저장 여부 확인
export const checkSavedTalent = async (resumeId: number, companyUserId: number) => {
  const response = await api.get(`${API_BASE_URL}/save/check/${resumeId}`, {
    headers: {
      userId: companyUserId.toString(),
    },
  });
  return response.data;
};

// ✅ 인재 연락하기
export const contactTalent = async (resumeId: number, message: string, companyUserId: number) => {
  const response = await api.post(
    `${API_BASE_URL}/contact`,
    { resumeId, message },
    {
      headers: {
        userId: companyUserId.toString(),
      },
    }
  );
  return response.data;
};
