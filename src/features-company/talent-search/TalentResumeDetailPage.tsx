import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPublicResumeDetail, ResumeResponse, ResumeSections } from "../../api/resume";
import { saveTalent, contactTalent } from "../../api/talent";
import CompanyLeftSidebar from "../components/CompanyLeftSidebar";
import { useCompanyPageNavigation } from "../hooks/useCompanyPageNavigation";

interface TalentResumeDetailPageProps {
  resumeId: number;
  onBack: () => void;
}

export default function TalentResumeDetailPage({
  resumeId,
  onBack,
}: TalentResumeDetailPageProps) {
  const { user } = useAuth();
  const { activeMenu, handleMenuClick } = useCompanyPageNavigation("talent", "talent-sub-1");

  const [resume, setResume] = useState<ResumeResponse | null>(null);
  const [sections, setSections] = useState<ResumeSections | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resumeId && user?.userId) {
      loadResumeDetail();
    }
  }, [resumeId, user?.userId]);

  const loadResumeDetail = async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await getPublicResumeDetail(resumeId, user.userId);
      setResume(data);

      // structuredData 파싱
      if (data.structuredData) {
        try {
          const parsedSections: ResumeSections = JSON.parse(data.structuredData);
          setSections(parsedSections);
        } catch (parseError) {
          console.error("섹션 데이터 파싱 오류:", parseError);
        }
      }
    } catch (err: any) {
      console.error("이력서 상세 조회 오류:", err);
      setError(err.response?.data?.message || "이력서를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 연락하기
  const handleContact = async () => {
    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    const message = prompt("인재에게 보낼 메시지를 입력하세요:");
    if (!message) return;
    
    try {
      const response = await contactTalent(resumeId, message, user.userId);
      if (response.success) {
        alert("연락 요청이 전송되었습니다!");
      }
    } catch (error: any) {
      console.error("연락 요청 오류:", error);
      alert(error.response?.data?.message || "연락 요청에 실패했습니다.");
    }
  };

  // ✅ 스크랩
  const handleSave = async () => {
    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    try {
      const response = await saveTalent(resumeId, user.userId);
      if (response.success) {
        alert("인재가 스크랩되었습니다!");
      } else {
        alert("이미 스크랩된 인재입니다.");
      }
    } catch (error: any) {
      console.error("인재 스크랩 오류:", error);
      alert(error.response?.data?.message || "인재 스크랩에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex px-4 py-8 mx-auto max-w-7xl">
          <CompanyLeftSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
          <div className="flex items-center justify-center flex-1 pl-6">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex px-4 py-8 mx-auto max-w-7xl">
          <CompanyLeftSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
          <div className="flex-1 pl-6">
            <div className="p-8 text-center bg-white border border-red-200 rounded-xl">
              <div className="mb-4 text-4xl">❌</div>
              <p className="mb-4 text-lg text-red-600">{error}</p>
              <button
                onClick={onBack}
                className="px-6 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!resume || !sections) {
    return null;
  }

  const { personalInfo, experiences, certificates, educations, careers, portfolios, coverLetter } = sections;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex px-4 py-8 mx-auto max-w-7xl">
        <CompanyLeftSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

        <div className="flex-1 pl-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{resume.title}</h1>
              <p className="mt-1 text-gray-600">이력서 상세보기</p>
            </div>
            <button
              onClick={onBack}
              className="px-6 py-2 text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← 목록으로
            </button>
          </div>

          {/* 인적사항 섹션 */}
          <section className="p-8 mb-6 bg-white border border-gray-200 rounded-2xl">
            <h2 className="mb-6 text-xl font-bold">인적 사항</h2>
            <div className="flex gap-8">
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0">
                {personalInfo?.profileImage ? (
                  <img
                    src={personalInfo.profileImage}
                    alt="Profile"
                    className="object-cover w-40 h-48 border-2 border-gray-300 rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center w-40 h-48 text-4xl text-gray-400 border-2 border-gray-300 rounded-lg bg-gray-50">
                    👤
                  </div>
                )}
              </div>

              {/* 정보 영역 */}
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-0 mb-4 overflow-hidden border-2 border-gray-300 rounded-lg">
                  <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                    이름
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    {personalInfo?.name || "-"}
                  </div>
                  <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                    성별
                  </div>
                  <div className="p-3">{personalInfo?.gender || "-"}</div>
                </div>

                <div className="grid grid-cols-4 gap-0 mb-4 overflow-hidden border-2 border-gray-300 rounded-lg">
                  <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                    생년월일
                  </div>
                  <div className="col-span-3 p-3">
                    {personalInfo?.birthDate || "-"}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-0 mb-4 overflow-hidden border-2 border-gray-300 rounded-lg">
                  <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                    이메일
                  </div>
                  <div className="col-span-3 p-3">
                    {personalInfo?.email || "-"}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-0 overflow-hidden border-2 border-gray-300 rounded-lg">
                  <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                    주소
                  </div>
                  <div className="col-span-3 p-3">
                    {personalInfo?.address || "-"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 직무 & 스킬 섹션 */}
          <section className="p-8 mb-6 bg-white border border-gray-200 rounded-2xl">
            <h2 className="mb-6 text-xl font-bold">직무 & 스킬</h2>
            <div className="mb-4">
              <h3 className="mb-3 font-semibold text-gray-700">직무</h3>
              <div className="inline-block px-4 py-2 text-purple-700 bg-purple-100 rounded-lg">
                {resume.jobCategory}
              </div>
            </div>
            {resume.skills && (
              <div>
                <h3 className="mb-3 font-semibold text-gray-700">스킬</h3>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(resume.skills).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 text-sm text-purple-700 bg-purple-50 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 경험/활동/교육 */}
          {experiences && experiences.length > 0 && (
            <section className="p-8 mb-6 bg-white border border-gray-200 rounded-2xl">
              <h2 className="mb-6 text-xl font-bold">경험/활동/교육</h2>
              <div className="space-y-3">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="p-4 border-2 border-gray-300 rounded-lg">
                    <div className="font-medium text-gray-700">
                      {exp.title} | {exp.period}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 자격증/어학/수상 */}
          {certificates && certificates.length > 0 && (
            <section className="p-8 mb-6 bg-white border border-gray-200 rounded-2xl">
              <h2 className="mb-6 text-xl font-bold">자격증/어학/수상</h2>
              <div className="space-y-3">
                {certificates.map((cert, idx) => (
                  <div key={idx} className="p-4 border-2 border-gray-300 rounded-lg">
                    <div className="font-medium text-gray-700">
                      {cert.title} | {cert.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 학력 */}
          {educations && educations.length > 0 && (
            <section className="p-8 mb-6 bg-white border border-gray-200 rounded-2xl">
              <h2 className="mb-6 text-xl font-bold">학력</h2>
              <div className="space-y-3">
                {educations.map((edu, idx) => (
                  <div key={idx} className="p-4 border-2 border-gray-300 rounded-lg">
                    <div className="font-medium">
                      {edu.school} | {edu.period}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 경력 */}
          {careers && careers.length > 0 && (
            <section className="p-8 mb-6 bg-white border border-gray-200 rounded-2xl">
              <h2 className="mb-6 text-xl font-bold">경력</h2>
              <div className="space-y-3">
                {careers.map((career, idx) => (
                  <div key={idx} className="p-4 border-2 border-gray-300 rounded-lg">
                    <div className="font-medium">
                      {career.company} | {career.period}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 포트폴리오 */}
          {portfolios && portfolios.length > 0 && (
            <section className="p-8 mb-6 bg-white border border-gray-200 rounded-2xl">
              <h2 className="mb-6 text-xl font-bold">포트폴리오</h2>
              <div className="space-y-3">
                {portfolios.map((portfolio, idx) => (
                  <div key={idx} className="p-4 border-2 border-gray-300 rounded-lg">
                    <div className="font-medium text-gray-700">
                      📁 {portfolio.filename}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 자기소개서 */}
          {coverLetter && (coverLetter.title || coverLetter.content) && (
            <section className="p-8 mb-6 bg-white border border-gray-200 rounded-2xl">
              <h2 className="mb-6 text-xl font-bold">자기소개서</h2>
              {coverLetter.title && (
                <div className="p-4 mb-4 border-2 border-gray-300 rounded-lg">
                  <div className="font-semibold">{coverLetter.title}</div>
                </div>
              )}
              {coverLetter.content && (
                <div className="p-4 border-2 border-gray-300 rounded-lg whitespace-pre-wrap">
                  {coverLetter.content}
                </div>
              )}
            </section>
          )}

          {/* 하단 버튼 */}
          <div className="flex justify-between gap-4">
            <button
              onClick={onBack}
              className="px-8 py-3 font-semibold text-gray-700 transition bg-gray-200 rounded-full hover:bg-gray-300"
            >
              목록으로
            </button>
            <div className="flex gap-4">
              <button 
                onClick={handleContact}
                className="px-8 py-3 font-semibold text-white transition bg-purple-600 rounded-full hover:bg-purple-700"
              >
                연락하기
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 font-semibold text-purple-700 transition bg-purple-100 rounded-full hover:bg-purple-200"
              >
                스크랩
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
