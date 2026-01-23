import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  createResume,
  updateResume,
  getResumeDetail,
  CreateResumeRequest,
  ResumeSections,
} from "../../api/resume";
import ResumeSidebar from "./components/ResumeSidebar";
import { usePageNavigation } from "../../hooks/usePageNavigation";

interface ResumeFormPageProps {
  onBack: () => void;
  resumeId?: number | null; // 수정 시 이력서 ID, null이면 새 이력서 작성
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function ResumeFormPage({
  onBack,
  resumeId,
  initialMenu,
  onNavigate,
}: ResumeFormPageProps) {
  const { user } = useAuth();

  // ✅ 커스텀 훅 사용
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "resume",
    initialMenu,
    onNavigate
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [educations, setEducations] = useState<string[]>(["", ""]);
  const [careers, setCareers] = useState<string[]>([""]);
  const [portfolios, setPortfolios] = useState<string[]>([""]);
  const [certificates, setCertificates] = useState<string[]>([""]);
  const [experiences, setExperiences] = useState<string[]>(["", ""]);
  const [coverLetterFiles, setCoverLetterFiles] = useState<string[]>([]);
  const coverLetterFileInputRef = useRef<HTMLInputElement>(null);

  // 폼 데이터 상태
  const [resumeTitle, setResumeTitle] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetterTitle, setCoverLetterTitle] = useState("");
  const [coverLetterContent, setCoverLetterContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC"); // 공개 설정 추가
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (resumeId && user?.userId) {
      loadResumeData(resumeId, user.userId);
    }
  }, [resumeId, user?.userId]);

  // 이력서 데이터 로드 함수
  const loadResumeData = async (id: number, userId: number) => {
    setIsLoading(true);
    setError("");

    try {
      const resume = await getResumeDetail(id, userId);
      console.log("🔍 [디버그] 불러온 이력서 데이터:", resume);
      console.log("🔍 [디버그] visibility:", resume.visibility);

      // 기본 정보
      setResumeTitle(resume.title);
      setSelectedJob(resume.jobCategory);
      
      // visibility 로드 - 기본값은 PUBLIC
      const loadedVisibility = resume.visibility || "PUBLIC";
      setVisibility(loadedVisibility);
      console.log("🔍 [디버그] 설정된 visibility:", loadedVisibility);

      // structuredData 파싱
      if (resume.structuredData) {
        try {
          const sections: ResumeSections = JSON.parse(resume.structuredData);
          console.log("파싱된 섹션 데이터:", sections);

          // 인적사항
          if (sections.personalInfo) {
            setName(sections.personalInfo.name || "");
            setSelectedGender(sections.personalInfo.gender || "");
            setBirthDate(sections.personalInfo.birthDate || "");
            setEmail(sections.personalInfo.email || "");
            setAddress(sections.personalInfo.address || "");
            setSelectedImage(sections.personalInfo.profileImage || null);
          }

          // 경험/활동/교육
          if (sections.experiences && sections.experiences.length > 0) {
            setExperiences(
              sections.experiences.map((exp) => `${exp.title} | ${exp.period}`)
            );
          }

          // 자격증/어학/수상
          if (sections.certificates && sections.certificates.length > 0) {
            setCertificates(
              sections.certificates.map(
                (cert) => `${cert.title} | ${cert.date}`
              )
            );
          }

          // 학력
          if (sections.educations && sections.educations.length > 0) {
            setEducations(
              sections.educations.map((edu) => `${edu.school} | ${edu.period}`)
            );
          }

          // 경력
          if (sections.careers && sections.careers.length > 0) {
            setCareers(
              sections.careers.map(
                (career) => `${career.company} | ${career.period}`
              )
            );
          }

          // 포트폴리오
          if (sections.portfolios && sections.portfolios.length > 0) {
            setPortfolios(sections.portfolios.map((p) => p.filename));
          }

          // 자기소개서
          if (sections.coverLetter) {
            setCoverLetterTitle(sections.coverLetter.title || "");
            setCoverLetterContent(sections.coverLetter.content || "");
            if (sections.coverLetter.files) {
              setCoverLetterFiles(sections.coverLetter.files);
            }
          }
        } catch (parseError) {
          console.error("섹션 데이터 파싱 오류:", parseError);
        }
      }

      // 스킬
      if (resume.skills) {
        try {
          console.log("🔍 [디버그] resume.skills 원본:", resume.skills);
          const skillsArray = JSON.parse(resume.skills);
          console.log("🔍 [디버그] 파싱된 skillsArray:", skillsArray);
          if (Array.isArray(skillsArray)) {
            setSelectedSkills(skillsArray);
            console.log("✅ [디버그] 스킬 설정 성공:", skillsArray);
          }
        } catch (error) {
          console.error("❌ [디버그] 스킬 파싱 오류:", error);
        }
      } else {
        console.log("⚠️ [디버그] resume.skills가 비어있음");
      }
    } catch (err: any) {
      console.error("이력서 데이터 로드 오류:", err);
      setError("이력서 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    console.log("수정 클릭됨");
  };

  const handleDelete = () => {
    console.log("삭제 클릭됨");
  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    console.log(`성별 선택: ${gender}`);
  };

  // 직무 선택
  const handleJobSelect = (job: string) => {
    setSelectedJob(job);
    console.log(`직무 선택: ${job}`);
  };

  // 학력 추가/삭제
  const addEducation = () => {
    setEducations([...educations, ""]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  // 경력 추가/삭제
  const addCareer = () => {
    setCareers([...careers, ""]);
  };

  const removeCareer = (index: number) => {
    setCareers(careers.filter((_, i) => i !== index));
  };

  // 포트폴리오 추가/삭제
  const addPortfolio = () => {
    setPortfolios([...portfolios, ""]);
  };

  const removePortfolio = (index: number) => {
    setPortfolios(portfolios.filter((_, i) => i !== index));
  };

  // 자격증 추가/삭제
  const addCertificate = () => {
    setCertificates([...certificates, ""]);
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  // 경험/활동/교육 추가/삭제
  const addExperience = () => {
    setExperiences([...experiences, ""]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // 자기소개서 파일 불러오기
  const handleCoverLetterFileUpload = () => {
    coverLetterFileInputRef.current?.click();
  };

  const handleCoverLetterFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverLetterFiles([...coverLetterFiles, file.name]);
    }
  };

  const removeCoverLetterFile = (index: number) => {
    setCoverLetterFiles(coverLetterFiles.filter((_, i) => i !== index));
  };

  // 등록/수정 처리
  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!resumeTitle) {
      alert("이력서 제목을 입력해주세요.");
      return;
    }

    if (!name) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!selectedJob) {
      alert("직무를 선택해주세요.");
      return;
    }

    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);

    try {
      const resumeData: CreateResumeRequest = {
        title: resumeTitle,
        jobCategory: selectedJob,
        skills: selectedSkills,
        visibility: visibility, // 공개 설정 추가
        sections: {
          personalInfo: {
            name,
            gender: selectedGender,
            birthDate,
            email,
            address,
            profileImage: selectedImage || undefined,
          },
          experiences: experiences
            .filter((e) => e)
            .map((e) => {
              const parts = e.split(" | ");
              return { title: parts[0] || "", period: parts[1] || "" };
            }),
          certificates: certificates
            .filter((c) => c)
            .map((c) => {
              const parts = c.split(" | ");
              return { title: parts[0] || "", date: parts[1] || "" };
            }),
          educations: educations
            .filter((e) => e)
            .map((e) => {
              const parts = e.split(" | ");
              return { school: parts[0] || "", period: parts[1] || "" };
            }),
          careers: careers
            .filter((c) => c)
            .map((c) => {
              const parts = c.split(" | ");
              return { company: parts[0] || "", period: parts[1] || "" };
            }),
          portfolios: portfolios.filter((p) => p).map((p) => ({ filename: p })),
          coverLetter: {
            title: coverLetterTitle,
            content: coverLetterContent,
            files: coverLetterFiles,
          },
        },
        status: "COMPLETED",
      };

      console.log("📤 [디버그] 전송할 데이터:", resumeData);
      console.log("📤 [디버그] visibility 값:", visibility);

      let response;
      if (resumeId) {
        // 수정 모드
        response = await updateResume(resumeId, resumeData, user.userId);
        if (response.resumeId) {
          alert("이력서가 수정되었습니다!");
          onBack();
        } else {
          setError("이력서 수정에 실패했습니다.");
        }
      } else {
        // 등록 모드
        response = await createResume(resumeData, user.userId);
        if (response.resumeId) {
          alert("이력서가 등록되었습니다!");
          onBack();
        } else {
          setError("이력서 등록에 실패했습니다.");
        }
      }
    } catch (err: any) {
      console.error("이력서 저장 오류:", err);
      setError(
        err.response?.data?.message ||
          `이력서 ${resumeId ? "수정" : "등록"} 중 오류가 발생했습니다.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 취소 처리
  const handleCancel = () => {
    if (window.confirm("정말 취소하시겠습니까?")) {
      onBack();
    }
  };

  // 스킬 목록
  const availableSkills = [
    "JAVA",
    "Python",
    "JavaScript",
    "TypeScript",
    "C++",
    "C#",
    "AWS",
    "Azure",
    "GCP",
    "React",
    "Vue",
    "Angular",
    "Next.js",
    "Svelte",
    "Node.js",
    "Spring",
    "Django",
    "Flask",
    "Express",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "HTML",
    "CSS",
    "SASS",
    "Tailwind",
    "Git",
    "SVN",
    "Figma",
    "Sketch",
    "Adobe XD",
  ];

  // 스킬 선택/해제
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // 스킬 제거
  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h2 className="inline-block mb-6 text-2xl font-bold">이력서 작성</h2>
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <ResumeSidebar
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
          />

          {/* 메인 컨텐츠 */}
          <div className="flex-1 space-y-8">
            {/* 에러 메시지 표시 */}
            {error && (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 이력서 제목 입력 */}
            <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
              <h2 className="mb-6 text-2xl font-bold">이력서 제목</h2>
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="예: 프론트엔드 개발자 이력서"
                className="w-full p-4 mb-6 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />

              {/* 공개 설정 */}
              <div>
                <h3 className="mb-4 text-lg font-bold">공개 설정</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setVisibility("PUBLIC")}
                    className={`flex-1 p-4 text-center border-2 rounded-lg transition ${
                      visibility === "PUBLIC"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="mb-2 text-2xl">🌐</div>
                    <div className="font-bold">공개</div>
                    <div className="mt-1 text-sm text-gray-600">
                      기업 인재 검색에 표시됩니다
                    </div>
                  </button>
                  <button
                    onClick={() => setVisibility("PRIVATE")}
                    className={`flex-1 p-4 text-center border-2 rounded-lg transition ${
                      visibility === "PRIVATE"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="mb-2 text-2xl">🔒</div>
                    <div className="font-bold">비공개</div>
                    <div className="mt-1 text-sm text-gray-600">
                      나만 볼 수 있습니다
                    </div>
                  </button>
                </div>
              </div>
            </section>

            {/* 섹션: 인적사항 */}
            <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {resumeId ? "이력서 수정" : "인적사항"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  목록으로
                </button>
              </div>

              {/* 사진 업로드 */}
              <div className="mb-6">
                <div className="flex gap-4">
                  {/* 사진 업로드 영역 */}
                  <div>
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-image"
                      className="flex items-center justify-center w-40 h-48 transition border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Profile"
                          className="object-cover w-full h-full rounded-lg"
                        />
                      ) : (
                        <span className="text-4xl text-gray-400">+</span>
                      )}
                    </label>
                  </div>

                  {/* 정보 입력 영역 */}
                  <div className="flex-1">
                    {/* 이름, 성별 */}
                    <div className="grid grid-cols-4 gap-0 mb-4 overflow-hidden border-2 border-gray-300 rounded-lg">
                      <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                        이름
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-3 border-r border-gray-300 outline-none"
                        placeholder=""
                      />
                      <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                        성별
                      </div>
                      <select
                        value={selectedGender}
                        onChange={(e) => handleGenderSelect(e.target.value)}
                        className="p-3 bg-white outline-none cursor-pointer"
                      >
                        <option value="">선택</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-4 gap-0 mb-4 overflow-hidden border-2 border-gray-300 rounded-lg">
                      <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                        생년월일
                      </div>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="col-span-3 p-3 outline-none"
                        placeholder=""
                      />
                    </div>

                    {/* 이메일 */}
                    <div className="grid grid-cols-4 gap-0 mb-4 overflow-hidden border-2 border-gray-300 rounded-lg">
                      <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                        이메일
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="col-span-3 p-3 outline-none"
                        placeholder=""
                      />
                    </div>

                    {/* 주소 */}
                    <div className="grid grid-cols-4 gap-0 overflow-hidden border-2 border-gray-300 rounded-lg">
                      <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                        주소
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="col-span-3 p-3 outline-none"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 직무 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold">직무</h3>
                </div>
                <div className="grid grid-cols-6 gap-4 mb-6">
                  <button
                    onClick={() => handleJobSelect("프론트엔드")}
                    className={`p-3 text-center border-2 rounded-lg cursor-pointer transition ${
                      selectedJob === "프론트엔드"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    프론트
                  </button>
                  <button
                    onClick={() => handleJobSelect("백엔드")}
                    className={`p-3 text-center border-2 rounded-lg cursor-pointer transition ${
                      selectedJob === "백엔드"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    백엔드
                  </button>
                  <button
                    onClick={() => handleJobSelect("풀스택")}
                    className={`p-3 text-center border-2 rounded-lg cursor-pointer transition ${
                      selectedJob === "풀스택"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    풀스택
                  </button>
                  <button
                    onClick={() => handleJobSelect("PM")}
                    className={`p-3 text-center border-2 rounded-lg cursor-pointer transition ${
                      selectedJob === "PM"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    PM
                  </button>
                  <button
                    onClick={() => handleJobSelect("데이터 분석가")}
                    className={`p-3 text-center border-2 rounded-lg cursor-pointer transition ${
                      selectedJob === "데이터 분석가"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    데이터 분석가
                  </button>
                  <button
                    onClick={() => handleJobSelect("디자이너")}
                    className={`p-3 text-center border-2 rounded-lg cursor-pointer transition ${
                      selectedJob === "디자이너"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    디자이너
                  </button>
                </div>

                {/* 스킬 선택 */}
                <div className="mb-4">
                  <h4 className="mb-3 font-semibold">스킬 선택</h4>
                  <div className="p-4 overflow-y-auto border-2 border-gray-200 rounded-lg max-h-60">
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-4 py-2 rounded-full text-sm transition ${
                            selectedSkills.includes(skill)
                              ? "bg-blue-600 text-white font-semibold"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 선택된 스킬 */}
                {selectedSkills.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-semibold">선택된 스킬</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => removeSkill(skill)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 transition bg-blue-100 rounded-full hover:bg-blue-200"
                        >
                          <span>✕</span>
                          <span>{skill}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 경험/활동/교육 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">경험/활동/교육</h3>
                  <button
                    onClick={addExperience}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-4">
                  {experiences.map((experience, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-300 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          placeholder="프로젝트 1차 | 2013.4 - 2015.5"
                          value={experience}
                          onChange={(e) => {
                            const newExperiences = [...experiences];
                            newExperiences[index] = e.target.value;
                            setExperiences(newExperiences);
                          }}
                          className="flex-1 font-medium text-gray-700 outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleEdit}
                            className="flex items-center justify-center w-10 h-10 text-xs transition border-2 border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => removeExperience(index)}
                            className="flex items-center justify-center w-10 h-10 text-xs transition border-2 border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 자격증/어학/수상 */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">자격증/어학/수상</h3>
                  <button
                    onClick={addCertificate}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-3">
                  {certificates.map((certificate, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-300 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          placeholder="정보처리기사 1급 | 2017.4"
                          value={certificate}
                          onChange={(e) => {
                            const newCertificates = [...certificates];
                            newCertificates[index] = e.target.value;
                            setCertificates(newCertificates);
                          }}
                          className="flex-1 font-medium text-gray-700 outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleEdit}
                            className="flex items-center justify-center w-10 h-10 text-xs transition border-2 border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => removeCertificate(index)}
                            className="flex items-center justify-center w-10 h-10 text-xs transition border-2 border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 섹션: 학력/경력/포트폴리오/자기소개서 */}
            <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
              {/* 학력 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">학력</h3>
                  <button
                    onClick={addEducation}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-3">
                  {educations.map((education, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-300 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          placeholder="-- 대학교 (4년제) | 2012.03 ~ 2015.3"
                          value={education}
                          onChange={(e) => {
                            const newEducations = [...educations];
                            newEducations[index] = e.target.value;
                            setEducations(newEducations);
                          }}
                          className="flex-1 outline-none"
                        />
                        <button
                          onClick={() => removeEducation(index)}
                          className="ml-4 text-xl text-gray-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 경력 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">경력</h3>
                  <button
                    onClick={addCareer}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-3">
                  {careers.map((career, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-300 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          placeholder="OO 테크 | 2019. 2 ~ 2023.5"
                          value={career}
                          onChange={(e) => {
                            const newCareers = [...careers];
                            newCareers[index] = e.target.value;
                            setCareers(newCareers);
                          }}
                          className="flex-1 font-medium outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleEdit}
                            className="flex items-center justify-center w-10 h-10 text-xs transition border-2 border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => removeCareer(index)}
                            className="flex items-center justify-center w-10 h-10 text-xs transition border-2 border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 포트폴리오 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">포트폴리오</h3>
                  <button
                    onClick={addPortfolio}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-3">
                  {portfolios.map((portfolio, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-300 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removePortfolio(index)}
                          className="px-4 py-2 text-sm transition border-2 border-gray-300 rounded-full hover:bg-gray-100"
                        >
                          X | 프로젝트 또 포트폴리오.pdf
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 자기소개서 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">자기소개서</h3>
                  <button
                    onClick={handleCoverLetterFileUpload}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + 불러오기
                  </button>
                </div>
                <input
                  type="file"
                  ref={coverLetterFileInputRef}
                  onChange={handleCoverLetterFileChange}
                  accept=".pdf,.doc,.docx,.hwp,.txt"
                  className="hidden"
                />
                {coverLetterFiles.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {coverLetterFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <button
                          onClick={() => removeCoverLetterFile(index)}
                          className="px-4 py-2 text-sm border-2 border-gray-300 rounded-full hover:bg-gray-100 transition"
                        >
                          X | {file}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="p-4 border-2 border-gray-300 rounded-lg">
                    <input
                      type="text"
                      value={coverLetterTitle}
                      onChange={(e) => setCoverLetterTitle(e.target.value)}
                      placeholder="자소서 제목"
                      className="w-full mb-2 font-medium outline-none"
                    />
                  </div>
                  <textarea
                    value={coverLetterContent}
                    onChange={(e) => setCoverLetterContent(e.target.value)}
                    placeholder="내용입력"
                    rows={6}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg outline-none resize-none"
                  />
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="px-8 py-3 font-semibold text-gray-700 transition bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading
                    ? resumeId
                      ? "수정 중..."
                      : "등록 중..."
                    : resumeId
                    ? "수정"
                    : "등록"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
