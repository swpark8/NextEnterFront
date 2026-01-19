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

// 인재 검색
export const searchTalents = async (params?: {
  jobCategory?: string;
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<TalentSearchResponse>> => {
  const response = await api.get(`${API_BASE_URL}/search`, { params });
  return response.data;
};
