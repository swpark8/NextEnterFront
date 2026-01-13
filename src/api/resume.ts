import api from "./axios";

// 인적사항 인터페이스
export interface PersonalInfo {
  name: string;
  gender: string;
  birthDate: string;
  email: string;
  address: string;
  profileImage?: string;
}

// 경험/활동/교육 인터페이스
export interface Experience {
  title: string;
  period: string;
}

// 자격증/어학/수상 인터페이스
export interface Certificate {
  title: string;
  date: string;
}

// 학력 인터페이스
export interface Education {
  school: string;
  period: string;
}

// 경력 인터페이스
export interface Career {
  company: string;
  period: string;
}

// 포트폴리오 인터페이스
export interface Portfolio {
  filename: string;
  url?: string;
}

// 자기소개서 인터페이스
export interface CoverLetter {
  title: string;
  content: string;
  files?: string[];
}

// 이력서 섹션 데이터
export interface ResumeSections {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  certificates: Certificate[];
  educations: Education[];
  careers: Career[];
  portfolios: Portfolio[];
  coverLetter: CoverLetter;
}

// 이력서 생성 요청
export interface CreateResumeRequest {
  title: string;
  jobCategory: string;
  skills?: string[];
  sections: ResumeSections;
  status?: string;
}

// 이력서 응답
export interface ResumeResponse {
  resumeId: number;
  title: string;
  jobCategory: string;
  skills?: string;
  structuredData?: string;
  filePath?: string;
  fileType?: string;
  isMain: boolean;
  visibility: string;
  viewCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 이력서 목록 응답
export interface ResumeListItem {
  resumeId: number;
  title: string;
  jobCategory: string;
  isMain: boolean;
  visibility: string;
  viewCount: number;
  status: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ✅ 이력서 목록 조회 (userId를 헤더로 전송)
export const getResumeList = async (
  userId: number
): Promise<ApiResponse<ResumeListItem[]>> => {
  const response = await api.get<ApiResponse<ResumeListItem[]>>(
    "/api/resume/list",
    {
      headers: {
        userId: userId.toString(),
      },
    }
  );
  return response.data;
};

// ✅ 이력서 상세 조회 (userId를 헤더로 전송)
export const getResumeDetail = async (
  resumeId: number,
  userId: number
): Promise<ApiResponse<ResumeResponse>> => {
  const response = await api.get<ApiResponse<ResumeResponse>>(
    `/api/resume/${resumeId}`,
    {
      headers: {
        userId: userId.toString(),
      },
    }
  );
  return response.data;
};

// ✅ 이력서 생성 (userId를 헤더로 전송)
export const createResume = async (
  request: CreateResumeRequest,
  userId: number
): Promise<ApiResponse<{ resumeId: number }>> => {
  // sections를 JSON 문자열로 변환
  const payload = {
    title: request.title,
    jobCategory: request.jobCategory,
    sections: JSON.stringify(request.sections),
    status: request.status || "DRAFT",
  };

  const response = await api.post<ApiResponse<{ resumeId: number }>>(
    "/api/resume",
    payload,
    {
      headers: {
        userId: userId.toString(),
      },
    }
  );
  return response.data;
};

// ✅ 이력서 수정 (userId를 헤더로 전송)
export const updateResume = async (
  resumeId: number,
  request: CreateResumeRequest,
  userId: number
): Promise<ApiResponse<{ resumeId: number }>> => {
  // sections를 JSON 문자열로 변환
  const payload = {
    title: request.title,
    jobCategory: request.jobCategory,
    sections: JSON.stringify(request.sections),
    status: request.status || "DRAFT",
  };

  const response = await api.put<ApiResponse<{ resumeId: number }>>(
    `/api/resume/${resumeId}`,
    payload,
    {
      headers: {
        userId: userId.toString(),
      },
    }
  );
  return response.data;
};

// ✅ 이력서 삭제 (userId를 헤더로 전송)
export const deleteResume = async (
  resumeId: number,
  userId: number
): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete<ApiResponse<{ message: string }>>(
    `/api/resume/${resumeId}`,
    {
      headers: {
        userId: userId.toString(),
      },
    }
  );
  return response.data;
};

// ✅ 파일 업로드 (userId를 헤더로 전송)
export const uploadResumeFile = async (
  file: File,
  userId: number
): Promise<ApiResponse<ResumeResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ApiResponse<ResumeResponse>>(
    "/api/resume/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        userId: userId.toString(),
      },
    }
  );
  return response.data;
};
