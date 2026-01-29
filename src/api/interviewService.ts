import api from "./axios";

export interface InterviewReaction {
  type: string | null;
  text: string | null;
}

export interface InterviewRealtime {
  next_question: string;
  reaction: InterviewReaction;
  probe_goal: string;
  requested_evidence: string[];
  report?: InterviewReport;
}

export interface InterviewReport {
  role: string;
  competency_scores: Record<string, number>;
  // ... other fields are less critical for typing strictly if dynamic, but good to keep
  feedback_comment: string;
}

// Backend InterviewQuestionResponse mapping
export interface InterviewResponse {
  interviewId: number;
  currentTurn: number;
  question: string;
  isCompleted: boolean;
  finalScore?: number;
  finalFeedback?: string;

  // Rich AI Metadata (Mapped from Backend DTO)
  reactionType?: string;
  reactionText?: string;
  aiSystemReport?: any; // Map<String, Object>
  aiEvaluation?: any;
  requestedEvidence?: string[];
  probeGoal?: string;

  // Adapter helper (to keep UI compatible if needed, or we adapt UI)
  realtime?: InterviewRealtime;
}

export interface InterviewRequestPayload {
  resumeId: number; // Changed to number
  jobCategory: string;
  difficulty: "JUNIOR" | "SENIOR";
  totalTurns?: number;

  // Proxy Fields
  resumeContent?: any;
  portfolio?: any;
  portfolioFiles?: string[];

  // For Answer
  interviewId?: number;
  answer?: string;
}

export const interviewService = {
  startInterview: async (
    userId: number,
    payload: InterviewRequestPayload,
  ): Promise<InterviewResponse> => {
    const response = await api.post<InterviewResponse>(
      "/api/interview/start",
      {
        resumeId: payload.resumeId,
        jobCategory: payload.jobCategory,
        difficulty: payload.difficulty,
        totalTurns: payload.totalTurns,
        // Proxy
        resumeContent: payload.resumeContent,
        portfolio: payload.portfolio,
        portfolioFiles: payload.portfolioFiles,
      },
      {
        params: { userId },
      },
    );
    return adaptResponse(response.data);
  },

  submitAnswer: async (
    userId: number,
    payload: InterviewRequestPayload,
  ): Promise<InterviewResponse> => {
    console.log("🚀 [Service Debug] Submitting Answer Payload:", payload);
    const response = await api.post<InterviewResponse>(
      "/api/interview/answer",
      {
        interviewId: payload.interviewId,
        answer: payload.answer,
        // Proxy - Send context again for persistence
        resumeContent: payload.resumeContent,
        portfolio: payload.portfolio,
        portfolioFiles: payload.portfolioFiles,
      },
      {
        params: { userId },
      },
    );
    return adaptResponse(response.data);
  },
};

// Adapter to match existing UI expectation if possible, or we update UI.
// UI expects 'realtime' object. Let's synthesise it.
function adaptResponse(serverData: InterviewResponse): InterviewResponse {
  serverData.realtime = {
    next_question: serverData.question,
    reaction: {
      type: serverData.reactionType || null,
      text: serverData.reactionText || null,
    },
    probe_goal: serverData.probeGoal || "",
    requested_evidence: serverData.requestedEvidence || [],
    report: serverData.aiSystemReport as InterviewReport,
  };
  return serverData;
}
