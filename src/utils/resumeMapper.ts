import { AiRecommendRequest, ResumeContent } from "../api/ai";
import { ResumeResponse } from "../api/resume";

/**
 * 백엔드 이력서 데이터를 NextEnterAI 형식으로 변환
 */
export function mapResumeToAiFormat(
  resume: ResumeResponse,
  userId: number
): AiRecommendRequest {
  // structuredData JSON 파싱
  let parsedData: any = {};
  if (resume.structuredData) {
    try {
      parsedData = JSON.parse(resume.structuredData);
      console.log("🔍 [DEBUG] Parsed structuredData:", parsedData);
    } catch (error) {
      console.error("Failed to parse structuredData:", error);
    }
  }

  // skills 파싱 (문자열인 경우)
  let skillsArray: string[] = [];
  if (resume.skills) {
    if (typeof resume.skills === 'string') {
      try {
        skillsArray = JSON.parse(resume.skills);
      } catch {
        // JSON이 아니면 쉼표로 분리
        skillsArray = resume.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(resume.skills)) {
      skillsArray = resume.skills;
    }
  }

  // 백엔드 필드명 (educations, careers) → AI 서버 필드명 (education, professional_experience) 변환
  // 1. education 변환 (educations → education)
  const education = (parsedData.educations || [])
    .filter((edu: any) => edu && (edu.school || edu.period)) // 빈 값 필터링
    .map((edu: any) => ({
      degree: edu.school || edu.degree || "N/A",
      major: edu.period || edu.major || "전공 미상",
      status: edu.status || "Graduated",
    }));

  // 2. professional_experience 변환 (careers → professional_experience)
  const professional_experience = (parsedData.careers || [])
    .filter((career: any) => career && (career.company || career.period)) // 빈 값 필터링
    .map((career: any) => ({
      company: career.company || "N/A",
      period: career.period || "0개월",
      role: career.role || resume.jobCategory || "Developer",
      key_tasks: career.key_tasks || career.tasks || [],
    }));

  // 3. 빈 배열일 경우 기본값 설정 (AI 서버 스키마에 맞게)
  const finalEducation = education.length > 0 ? education : [{
    degree: "학력 정보 없음",
    major: "N/A",
    status: "N/A"
  }];

  // 이력서 컨텐츠 변환 (AI 서버 스키마에 맞게)
  const resumeContent: ResumeContent = {
    education: finalEducation,
    
    skills: {
      essential: skillsArray.length > 0 ? skillsArray : [],
      additional: [],
    },
    
    professional_experience: professional_experience,
  };

  console.log("🔍 [DEBUG] Mapped resumeContent:", resumeContent);

  // NextEnterAI 요청 형식으로 변환
  return {
    id: `USER_${userId}_RESUME_${resume.resumeId}`,
    target_role: resume.jobCategory || "Backend Developer",
    resume_content: resumeContent,
  };
}

/**
 * 이력서 텍스트 생성 (AI 분석용)
 */
export function generateResumeText(resume: ResumeResponse): string {
  const parts: string[] = [];

  // Helper to safely parse JSON or return if already array
  const safeParse = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  // 직무 카테고리
  if (resume.jobCategory) {
    parts.push(`희망 직무: ${resume.jobCategory}`);
  }

  // 학력
  const educations = safeParse(resume.educations || resume.education); // Handle both field names if needed, though ResumeResponse has educations
  if (educations.length > 0) {
    const eduText = educations
      .map((edu: any) => `${edu.school} (${edu.period})`)
      .join(", ");
    parts.push(`학력: ${eduText}`);
  }

  // 경력
  const careers = safeParse(resume.careers);
  if (careers.length > 0) {
    const careerText = careers
      .map((career: any) => `${career.company} - ${career.period}`)
      .join(", ");
    parts.push(`경력: ${careerText}`);
  }

  // 기술 스택
  let skills: string[] = [];
  if (Array.isArray(resume.skills)) {
    skills = resume.skills;
  } else if (typeof resume.skills === 'string') {
    try {
      skills = JSON.parse(resume.skills);
      if (!Array.isArray(skills)) skills = [resume.skills]; // Fallback if not array
    } catch {
       skills = resume.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  if (skills.length > 0) {
    parts.push(`기술 스택: ${skills.join(", ")}`);
  }

  // 경험/활동
  // Note: ResumeResponse has 'experiences' as string (JSON), but logic below used 'experiences' array directly.
  // We need to parse 'experiences' from JSON string.
  // Also 'projectExperiences' was in original code but is NOT in ResumeResponse interface shown. 
  // Assuming 'experiences' contains what we need.
  const experiences = safeParse(resume.experiences);
  if (experiences.length > 0) {
    const expText = experiences
      .map((exp: any) => `${exp.title} (${exp.period})`)
      .join(", ");
    parts.push(`경험/활동: ${expText}`);
  }
  
  // Note: 'projectExperiences' field was removed/substituted as it was likely not in the main type.
  // If strict mapping is needed, we should check if 'experiences' covers projects too.
  // Based on `MatchingPage.tsx`, experience -> projects mapping happens.
  
  return parts.join("\n\n");
}
