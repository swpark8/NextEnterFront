import api from "./axios";

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
   * 
   * [변경] Python Direct -> Spring Proxy
   * Spring Backend가 중간에서 인증 및 데이터 저장을 처리하고 Python으로 토스합니다.
   */
  getNextQuestion: async (
    data: InterviewRequest,
  ): Promise<InterviewResponse> => {
    // Spring Backend Endpoint (Proxy)
    const response = await api.post<InterviewResponse>(
      "/api/interview/process",
      data,
    );
    return response.data;
  },
};
