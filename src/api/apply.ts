import api from "./axios";

// 지원자 목록 응답 타입
export interface ApplyListResponse {
  applyId: number;
  userId: number;
  jobId: number;
  userName: string;
  userAge: number;
  jobTitle: string;
  jobCategory: string;
  skills: string[];
  experience: string;
  status: string;
  aiScore: number;
  appliedAt: string;
}

// 지원자 상세 응답 타입
export interface ApplyDetailResponse {
  applyId: number;
  userId: number;
  jobId: number;
  resumeId: number;
  coverLetterId: number;
  userName: string;
  userAge: number;
  userEmail: string;
  userPhone: string;
  jobTitle: string;
  jobCategory: string;
  status: string;
  aiScore: number;
  notes: string;
  appliedAt: string;
  reviewedAt: string;
  updatedAt: string;
}

// 상태 변경 요청 타입
export interface ApplyStatusUpdateRequest {
  status: string; // PENDING, REVIEWING, ACCEPTED, REJECTED
  notes?: string;
}

// 지원 등록 요청 타입
export interface ApplyCreateRequest {
  jobId: number;
  resumeId: number;
  coverLetterId?: number;
}

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// 지원 등록 (개인회원용)
export const createApply = async (
  userId: number,
  request: ApplyCreateRequest
): Promise<ApplyDetailResponse> => {
  const response = await api.post("/api/applies", request, {
    headers: { userId },
  });
  return response.data;
};

// 지원자 목록 조회
export const getApplies = async (
  companyId: number,
  params?: {
    jobId?: number;
    page?: number;
    size?: number;
  }
): Promise<PageResponse<ApplyListResponse>> => {
  const response = await api.get("/api/applies", {
    params,
    headers: { companyId },
  });
  return response.data;
};

// 지원자 상세 조회
export const getApplyDetail = async (
  applyId: number,
  companyId: number
): Promise<ApplyDetailResponse> => {
  const response = await api.get(`/api/applies/${applyId}`, {
    headers: { companyId },
  });
  return response.data;
};

// 지원 상태 변경
export const updateApplyStatus = async (
  applyId: number,
  companyId: number,
  request: ApplyStatusUpdateRequest
): Promise<ApplyDetailResponse> => {
  const response = await api.put(
    `/api/applies/${applyId}/status`,
    request,
    { headers: { companyId } }
  );
  return response.data;
};
