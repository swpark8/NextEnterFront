import api from "./axios";

// 면접 제안 응답 타입
export interface InterviewOfferResponse {
  offerId: number;
  userId: number;
  jobId: number;
  companyId: number;
  applyId?: number;
  // 공고 정보
  jobTitle: string;
  jobCategory: string;
  companyName: string;
  companyLogoUrl?: string;
  // 사용자 정보
  userName: string;
  userAge?: number;
  // 상태 정보
  offerType: string; // "COMPANY_INITIATED" | "FROM_APPLICATION"
  interviewStatus: string; // "OFFERED" | "ACCEPTED" | "REJECTED" | "SCHEDULED" | "COMPLETED" | "CANCELED"
  finalResult?: string; // "PASSED" | "REJECTED"
  // 날짜 정보
  offeredAt: string;
  respondedAt?: string;
  scheduledAt?: string;
  updatedAt: string;
}

// 면접 제안 생성 요청 타입
export interface InterviewOfferRequest {
  userId: number;
  jobId: number;
  applyId?: number;
}

/**
 * 기업이 면접 제안 생성
 */
export const createInterviewOffer = async (
  companyId: number,
  request: InterviewOfferRequest
): Promise<InterviewOfferResponse> => {
  const response = await api.post("/api/interview-offers", request, {
    headers: { companyId },
  });
  return response.data;
};

/**
 * 사용자가 받은 면접 제안 목록 (OFFERED 상태만)
 */
export const getReceivedOffers = async (
  userId: number
): Promise<InterviewOfferResponse[]> => {
  const response = await api.get("/api/interview-offers/received", {
    headers: { userId },
  });
  return response.data;
};

/**
 * 사용자의 모든 면접 제안 조회
 */
export const getMyOffers = async (
  userId: number
): Promise<InterviewOfferResponse[]> => {
  const response = await api.get("/api/interview-offers/my", {
    headers: { userId },
  });
  return response.data;
};

/**
 * 기업의 면접 제안 목록
 */
export const getCompanyOffers = async (
  companyId: number,
  jobId?: number
): Promise<InterviewOfferResponse[]> => {
  const response = await api.get("/api/interview-offers/company", {
    params: { jobId },
    headers: { companyId },
  });
  return response.data;
};

/**
 * 면접 제안 수락
 */
export const acceptOffer = async (
  offerId: number,
  userId: number
): Promise<InterviewOfferResponse> => {
  const response = await api.post(
    `/api/interview-offers/${offerId}/accept`,
    null,
    {
      headers: { userId },
    }
  );
  return response.data;
};

/**
 * 면접 제안 거절
 */
export const rejectOffer = async (
  offerId: number,
  userId: number
): Promise<InterviewOfferResponse> => {
  const response = await api.post(
    `/api/interview-offers/${offerId}/reject`,
    null,
    {
      headers: { userId },
    }
  );
  return response.data;
};
