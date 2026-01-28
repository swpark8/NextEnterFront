import axios from "axios";

// AI 엔진 전용 Axios 인스턴스 (Port 8000)
const aiApi = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 20000, // AI 응답 대기 시간 20초로 넉넉하게 설정
  headers: {
    "Content-Type": "application/json",
  },
});

export interface InterviewReaction {
  type: "clarify" | "paraphrase" | "reflect";
  text: string;
}

export interface InterviewRealtime {
  next_question: string;
  reaction: InterviewReaction;
  probe_goal: string;
  requested_evidence: string[];
  report?: InterviewReport; // 매 턴마다 리포트가 올 수도 있음
}

export interface InterviewReport {
  role: string;
  competency_scores: Record<string, number>;
  starr_coverage: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
    reflection: boolean;
  };
  individual_contribution: "clear" | "mixed" | "unclear";
  strengths: string[];
  gaps: string[];
  feedback_level: "High" | "Mid" | "Low";
  feedback_comment: string;
  evidence_clips: string[];
}

export interface InterviewResponse {
  status: string;
  resume_id: string;
  target_role: string;
  realtime: InterviewRealtime;
}

export interface InterviewRequest {
  id?: string;
  target_role?: string;
  classification?: {
    predicted_role?: string;
  };
  evaluation?: {
    grade?: string;
  };
  resume_content?: {
    skills?: {
      essential?: string[];
      additional?: string[];
    };
    professional_experience?: Array<{
      role: string;
      period: string;
      key_tasks: string[];
    }>;
    project_experience?: Array<{
      project_title: string;
      description: string;
    }>;
    education?: Array<{
      major: string;
    }>;
  };
  portfolio?: {
    links?: string[];
    highlights?: string[];
    projects?: Array<{
      title: string;
      stack: string[];
      impact: string;
      details: string;
    }>;
  };
  last_answer?: string;
}

export const interviewService = {
  /**
   * 다음 면접 질문을 요청합니다.
   * - 첫 요청 시: last_answer 없이 호출 (Seed Question 요청)
   * - 이후 요청 시: last_answer 포함하여 호출 (답변 분석 및 꼬리질문 요청)
   */
  getNextQuestion: async (
    data: InterviewRequest,
  ): Promise<InterviewResponse> => {
    const response = await aiApi.post<InterviewResponse>(
      "/api/v1/interview/next",
      data,
    );
    return response.data;
  },
};
