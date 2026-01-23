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
  visibility?: string; // 공개 설정 추가 (PUBLIC, PRIVATE)
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

// AI 추천 요청
export interface AIRecommendRequest {
  id: string;
  target_role: string;
  resume_content: any;
}

// AI 추천 응답
export interface AIRecommendResponse {
  companies: Array<{
    name: string;
    score: number;
    position: string;
    match_reasons: string[];
  }>;
  ai_report: string;
}

// ✅ 이력서 목록 조회 (배열을 직접 받음)
export const getResumeList = async (
  userId: number
): Promise<ResumeListItem[]> => {
  console.log("📄 [API] 이력서 목록 조회 요청 (userId:", userId, ")");
  
  const response = await api.get<ResumeListItem[]>("/api/resume/list", {
    headers: {
      userId: userId.toString(),
    },
  });
  
  console.log("✅ [API] 이력서 목록:", response.data);
  
  // visibility 확인
  response.data.forEach((resume, index) => {
    console.log(`  이력서 ${index + 1}: ${resume.title} - visibility: ${resume.visibility}`);
  });
  
  return response.data;
};

// ✅ 이력서 상세 조회 (ResumeResponse를 직접 받음)
export const getResumeDetail = async (
  resumeId: number,
  userId: number
): Promise<ResumeResponse> => {
  const response = await api.get<ResumeResponse>(`/api/resume/${resumeId}`, {
    headers: {
      userId: userId.toString(),
    },
  });
  return response.data;
};

// ✅ 공개 이력서 조회 (기업회원용)
export const getPublicResumeDetail = async (
  resumeId: number,
  viewerId: number
): Promise<ResumeResponse> => {
  const response = await api.get<ResumeResponse>(`/api/resume/public/${resumeId}`, {
    headers: {
      userId: viewerId.toString(),
    },
  });
  return response.data;
};

// ✅ 이력서 생성 (백엔드 응답: {resumeId: number})
export const createResume = async (
  request: CreateResumeRequest,
  userId: number
): Promise<{ resumeId: number }> => {
  const payload = {
    title: request.title,
    jobCategory: request.jobCategory,
    skills: JSON.stringify(request.skills || []), // 스킬 추가
    visibility: request.visibility || "PUBLIC", // 공개 설정 추가
    sections: JSON.stringify(request.sections),
    status: request.status || "DRAFT",
  };

  console.log("🚀 [API] 이력서 생성 요청:", payload);
  console.log("🚀 [API] skills:", request.skills);
  console.log("🚀 [API] visibility:", payload.visibility);
  console.log("🚀 [API] skills:", payload.skills);

  const response = await api.post<{ resumeId: number }>(
    "/api/resume",
    payload,
    {
      headers: {
        userId: userId.toString(),
      },
    }
  );
  
  console.log("✅ [API] 이력서 생성 응답:", response.data);
  return response.data;
};

// ✅ 이력서 수정 (백엔드 응답: {resumeId: number})
export const updateResume = async (
  resumeId: number,
  request: CreateResumeRequest,
  userId: number
): Promise<{ resumeId: number }> => {
  const payload = {
    title: request.title,
    jobCategory: request.jobCategory,
    skills: JSON.stringify(request.skills || []), // 스킬 추가
    visibility: request.visibility || "PUBLIC", // 공개 설정 추가
    sections: JSON.stringify(request.sections),
    status: request.status || "DRAFT",
  };

  console.log("🔄 [API] 이력서 수정 요청 (ID:", resumeId, "):", payload);
  console.log("🔄 [API] skills:", request.skills);
  console.log("🔄 [API] visibility:", payload.visibility);
  console.log("🔄 [API] skills:", payload.skills);

  const response = await api.put<{ resumeId: number }>(
    `/api/resume/${resumeId}`,
    payload,
    {
      headers: {
        userId: userId.toString(),
      },
    }
  );
  
  console.log("✅ [API] 이력서 수정 응답:", response.data);
  return response.data;
};

// ✅ 이력서 삭제 (백엔드 응답: {message: string})
export const deleteResume = async (
  resumeId: number,
  userId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/api/resume/${resumeId}`,
    {
      headers: {
        userId: userId.toString(),
      },
    }
  );
  return response.data;
};

// ✅ 파일 업로드
export const uploadResumeFile = async (
  file: File,
  userId: number
): Promise<ResumeResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ResumeResponse>(
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

// ✅ AI 추천 기능
export const getAIRecommendation = async (
  request: AIRecommendRequest
): Promise<AIRecommendResponse> => {
  const response = await api.post<AIRecommendResponse>(
    "/api/ai/recommend",
    request
  );
  return response.data;
};
