import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  createResume,
  updateResume,
  getResumeDetail,
  createResumeWithFiles, // ✅ 파일 업로드 API 추가
  updateResumeWithFiles, // ✅ 파일 업로드 API 추가
  CreateResumeRequest,
  ResumeSections,
} from "../../api/resume";
import ResumeSidebar from "./components/ResumeSidebar";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import SchoolSearchInput from "./components/SchoolSearchInput";
import { useKakaoAddress } from "../../hooks/useKakaoAddress";
import { setNavigationBlocker } from "../../utils/navigationBlocker"; // navigationBlocker import

interface ResumeFormPageProps {
  onBack?: () => void; // 옵션널로 변경
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

export default function ResumeFormPage({
  onBack,
  initialMenu,
  onNavigate,
}: ResumeFormPageProps) {
  const navigate = useNavigate();
  const { resumeId: resumeIdParam } = useParams();
  const { user } = useAuth();

  // 라우트 파라미터에서 resumeId 가져오기
  const resumeId = resumeIdParam ? parseInt(resumeIdParam) : null;

  // ✅ 커스텀 훅 사용
  const { activeMenu, handleMenuClick } = usePageNavigation(
    "resume",
    initialMenu,
    onNavigate,
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // ✅ 학력: 객체 배열로 변경
  const [educations, setEducations] = useState<
    {
      school: string;
      type: string; // 고등학교, 대학교, 대학원
      subType: string; // 세부 종류
      major: string; // 학과
      startDate: string; // 입학일
      endDate: string; // 졸업일
    }[]
  >([
    {
      school: "",
      type: "",
      subType: "",
      major: "",
      startDate: "",
      endDate: "",
    },
  ]);

  // ✅ 경력: 객체 배열로 변경
  const [careers, setCareers] = useState<
    {
      company: string;
      position: string; // 직책
      role: string; // 직무
      startDate: string;
      endDate: string;
    }[]
  >([{ company: "", position: "", role: "", startDate: "", endDate: "" }]);

  // ✅ 포트폴리오: File 객체 배열로 변경
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const portfolioFileInputRef = useRef<HTMLInputElement>(null);

  // ✅ 경험/활동/교육: 객체 배열로 변경
  const [experiences, setExperiences] = useState<
    { title: string; startDate: string; endDate: string }[]
  >([{ title: "", startDate: "", endDate: "" }]);

  // ✅ 자격증/어학/수상: 객체 배열로 변경
  const [certificates, setCertificates] = useState<
    { title: string; date: string }[]
  >([{ title: "", date: "" }]);

  // ✅ 자기소개서: File 객체 배열로 변경
  const [coverLetterFiles, setCoverLetterFiles] = useState<File[]>([]);
  const coverLetterFileInputRef = useRef<HTMLInputElement>(null);

  // 폼 데이터 상태
  const [resumeTitle, setResumeTitle] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState(""); // ✅ 상세 주소 추가
  const [coverLetterTitle, setCoverLetterTitle] = useState("");
  const [coverLetterContent, setCoverLetterContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC"); // 공개 설정 추가
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ 카카오 주소 API 훅 사용
  const { openPostcode } = useKakaoAddress((data) => {
    setAddress(data.address);
  });

  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (resumeId && user?.userId) {
      loadResumeData(resumeId, user.userId);
    }
  }, [resumeId, user?.userId]);

  // 네비게이션 차단 설정
  useEffect(() => {
    // 컴포넌트 마운트 시 차단 활성화
    setNavigationBlocker(true, "작성 중인 내용이 사라집니다. 정말 이동하시겠습니까?");

    // 컴포넌트 언마운트 시 차단 해제
    return () => {
      setNavigationBlocker(false, "");
    };
  }, []);

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
      
      // 직무를 배열로 파싱
      if (resume.jobCategory) {
        const jobs = resume.jobCategory.split(',').map(j => j.trim());
        setSelectedJobs(jobs);
      }

      // visibility 로드 - 기본값은 PUBLIC
      const loadedVisibility = resume.visibility || "PUBLIC";
      setVisibility(loadedVisibility);
      console.log("🔍 [디버그] 설정된 visibility:", loadedVisibility);

      // Resume 테이블의 개인정보 우선 로드
      if (resume.resumeName) setName(resume.resumeName);
      if (resume.resumeGender) setSelectedGender(resume.resumeGender);
      if (resume.resumeBirthDate) setBirthDate(resume.resumeBirthDate);
      if (resume.resumeEmail) setEmail(resume.resumeEmail);
      if (resume.resumePhone) setPhone(resume.resumePhone);
      if (resume.resumeAddress) setAddress(resume.resumeAddress);
      if (resume.resumeDetailAddress) setDetailAddress(resume.resumeDetailAddress);
      if (resume.profileImage) setSelectedImage(resume.profileImage);

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
              sections.experiences.map((exp) => ({
                title: exp.title || "",
                startDate: exp.period?.split(" - ")[0] || "",
                endDate: exp.period?.split(" - ")[1] || "",
              })),
            );
          }

          // 자격증/어학/수상
          if (sections.certificates && sections.certificates.length > 0) {
            setCertificates(
              sections.certificates.map((cert) => ({
                title: cert.title || "",
                date: cert.date || "",
              })),
            );
          }

          // 학력
          if (sections.educations && sections.educations.length > 0) {
            setEducations(
              sections.educations.map((edu) => {
                const periodParts = edu.period?.split(" ~ ") || ["", ""];
                return {
                  school: edu.school || "",
                  type: "",
                  subType: "",
                  major: "",
                  startDate: periodParts[0] || "",
                  endDate: periodParts[1] || "",
                };
              }),
            );
          }

          // 경력
          if (sections.careers && sections.careers.length > 0) {
            setCareers(
              sections.careers.map((career) => {
                const periodParts = career.period?.split(" ~ ") || ["", ""];
                return {
                  company: career.company || "",
                  position: "",
                  role: "",
                  startDate: periodParts[0] || "",
                  endDate: periodParts[1] || "",
                };
              }),
            );
          }

          // ❌ 포트폴리오 - 수정 모드에서는 기존 파일을 불러올 수 없음 (파일명만 있음)
          // 사용자가 다시 업로드해야 함

          // 자기소개서
          if (sections.coverLetter) {
            setCoverLetterTitle(sections.coverLetter.title || "");
            setCoverLetterContent(sections.coverLetter.content || "");
            // ❌ 파일은 불러올 수 없음 - File 객체가 아닌 문자열 배열이므로
            // 사용자가 다시 업로드해야 함
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

  // 직무 선택 (다중)
  const toggleJobSelect = (job: string) => {
    if (selectedJobs.includes(job)) {
      setSelectedJobs(selectedJobs.filter((j) => j !== job));
    } else {
      setSelectedJobs([...selectedJobs, job]);
    }
  };

  // 학력 추가/삭제
  const addEducation = () => {
    setEducations([
      ...educations,
      {
        school: "",
        type: "",
        subType: "",
        major: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  // 경력 추가/삭제
  const addCareer = () => {
    setCareers([
      ...careers,
      { company: "", position: "", role: "", startDate: "", endDate: "" },
    ]);
  };

  const removeCareer = (index: number) => {
    setCareers(careers.filter((_, i) => i !== index));
  };

  // 자격증 추가/삭제
  const addCertificate = () => {
    setCertificates([...certificates, { title: "", date: "" }]);
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  // 경험/활동/교육 추가/삭제
  const addExperience = () => {
    setExperiences([...experiences, { title: "", startDate: "", endDate: "" }]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // 포트폴리오 파일 업로드
  const handlePortfolioFileUpload = () => {
    portfolioFileInputRef.current?.click();
  };

  const handlePortfolioFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      // PDF와 Word 파일만 허용
      const validFiles = newFiles.filter((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        return ["pdf", "doc", "docx"].includes(ext || "");
      });

      if (validFiles.length !== newFiles.length) {
        alert("PDF, Word 파일만 업로드 가능합니다.");
      }

      setPortfolioFiles([...portfolioFiles, ...validFiles]);
    }
  };

  const removePortfolioFile = (index: number) => {
    setPortfolioFiles(portfolioFiles.filter((_, i) => i !== index));
  };

  // 자기소개서 파일 업로드
  const handleCoverLetterFileUpload = () => {
    coverLetterFileInputRef.current?.click();
  };

  const handleCoverLetterFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      // PDF와 Word 파일만 허용
      const validFiles = newFiles.filter((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        return ["pdf", "doc", "docx"].includes(ext || "");
      });

      if (validFiles.length !== newFiles.length) {
        alert("PDF, Word 파일만 업로드 가능합니다.");
      }

      setCoverLetterFiles([...coverLetterFiles, ...validFiles]);
    }
  };

  const removeCoverLetterFile = (index: number) => {
    setCoverLetterFiles(coverLetterFiles.filter((_, i) => i !== index));
  };

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

    if (selectedJobs.length === 0) {
      alert("직무를 하나 이상 선택해주세요.");
      return;
    }

    if (!user?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ 1. 경험/활동/교육 데이터 준비 (날짜가 없어도 title만 있으면 포함)
      const experiencesData = experiences
        .filter((e) => e.title && e.title.trim() !== "")
        .map((e) => ({
          title: e.title,
          period:
            e.startDate && e.endDate ? `${e.startDate} - ${e.endDate}` : "",
        }));

      console.log("📤 [디버그] experiences 원본:", experiences);
      console.log("📤 [디버그] experiences 필터링 후:", experiencesData);
      console.log("📤 [디버그] experiences 개수:", experiencesData.length);

      // ✅ 2. 자격증/어학/수상 데이터 준비
      const certificatesData = certificates
        .filter((c) => c.title && c.title.trim() !== "")
        .map((c) => ({
          title: c.title,
          date: c.date || "",
        }));

      console.log("📤 [디버그] certificates 원본:", certificates);
      console.log("📤 [디버그] certificates 필터링 후:", certificatesData);
      console.log("📤 [디버그] certificates 개수:", certificatesData.length);

      // ✅ 3. 학력 데이터 준비
      const educationsData = educations
        .filter((e) => e.school && e.school.trim() !== "")
        .map((e) => {
          let schoolText = e.school;
          if (e.type) schoolText += ` ${e.type}`;
          if (e.subType) schoolText += ` - ${e.subType}`;
          if (e.major) schoolText += ` ${e.major}`;
          return {
            school: schoolText,
            period:
              e.startDate && e.endDate ? `${e.startDate} ~ ${e.endDate}` : "",
          };
        });

      console.log("📤 [디버그] educations 원본:", educations);
      console.log("📤 [디버그] educations 필터링 후:", educationsData);
      console.log("📤 [디버그] educations 개수:", educationsData.length);

      // ✅ 4. 경력 데이터 준비
      const careersData = careers
        .filter((c) => c.company && c.company.trim() !== "")
        .map((c) => ({
          company: c.company,
          position: c.position || "",
          role: c.role || "",
          period:
            c.startDate && c.endDate ? `${c.startDate} ~ ${c.endDate}` : "",
        }));

      console.log("📤 [디버그] careers 원본:", careers);
      console.log("📤 [디버그] careers 필터링 후:", careersData);
      console.log("📤 [디버그] careers 개수:", careersData.length);

      // ✅ 5. 요청 데이터 생성 (빈 배열이라도 "[]"로 전송)
      const resumeData: CreateResumeRequest = {
        title: resumeTitle,
        jobCategory: selectedJobs.join(', '),
        skills: selectedSkills.join(", "),
        visibility: visibility,
        // 개인정보 필드
        resumeName: name,
        resumeGender: selectedGender,
        resumeBirthDate: birthDate,
        resumeEmail: email,
        resumePhone: phone,
        resumeAddress: address,
        resumeDetailAddress: detailAddress,
        profileImage: selectedImage || undefined,
        // ⚠️ 중요: 빈 배열이어도 "[]"로 전송 (undefined 대신)
        experiences:
          experiencesData.length > 0 ? JSON.stringify(experiencesData) : "[]",
        certificates:
          certificatesData.length > 0 ? JSON.stringify(certificatesData) : "[]",
        educations:
          educationsData.length > 0 ? JSON.stringify(educationsData) : "[]",
        careers: careersData.length > 0 ? JSON.stringify(careersData) : "[]",
        status: "COMPLETED",
      };

      console.log("📤 [디버그] 최종 전송 데이터:", resumeData);
      console.log("📤 [디버그] 포트폴리오 파일:", portfolioFiles);
      console.log("📤 [디버그] 자기소개서 파일:", coverLetterFiles);

      let response;
      // ✅ 파일이 있으면 파일 포함 API 사용
      if (portfolioFiles.length > 0 || coverLetterFiles.length > 0) {
        console.log("💾 [디버그] 파일 포함 API 호출");
        if (resumeId) {
          response = await updateResumeWithFiles(
            resumeId,
            resumeData,
            user.userId,
            portfolioFiles,
            coverLetterFiles,
          );
        } else {
          response = await createResumeWithFiles(
            resumeData,
            user.userId,
            portfolioFiles,
            coverLetterFiles,
          );
        }
      } else {
        console.log("📝 [디버그] 일반 API 호출 (파일 없음)");
        if (resumeId) {
          response = await updateResume(resumeId, resumeData, user.userId);
        } else {
          response = await createResume(resumeData, user.userId);
        }
      }

      if (response.resumeId) {
        alert(`이력서가 ${resumeId ? "수정" : "등록"}되었습니다!`);
        // 차단 해제 후 이동
        setNavigationBlocker(false, "");
        window.location.href = "/user/resume?menu=resume-sub-1";
      } else {
        setError(`이력서 ${resumeId ? "수정" : "등록"}에 실패했습니다.`);
      }
    } catch (err: any) {
      console.error("❌ [디버그] 이력서 저장 오류:", err);
      console.error("❌ [디버그] 에러 상세:", err.response?.data);
      setError(
        err.response?.data?.message ||
          `이력서 ${resumeId ? "수정" : "등록"} 중 오류가 발생했습니다.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 취소 처리
  const handleCancel = () => {
    if (window.confirm("정말 취소하시겠습니까?")) {
      // 차단 해제 후 이동
      setNavigationBlocker(false, "");
      window.location.href = "/user/resume?menu=resume-sub-1";
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
    <div className="min-h-screen bg-white">
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

                    {/* ✅ 연락처 추가 */}
                    <div className="grid grid-cols-4 gap-0 mb-4 overflow-hidden border-2 border-gray-300 rounded-lg">
                      <div className="p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                        연락처
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="col-span-3 p-3 outline-none"
                        placeholder="010-0000-0000"
                      />
                    </div>

                    {/* 주소 - ✅ 카카오 도로명 주소 API 적용 + UI 개선 */}
                    <div className="grid grid-cols-4 gap-0 overflow-hidden border-2 border-gray-300 rounded-lg">
                      <div className="flex items-center justify-center p-3 font-medium text-center border-r border-gray-300 bg-gray-50">
                        주소
                      </div>
                      <div className="col-span-3 p-3">
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={address}
                            readOnly
                            placeholder="주소 찾기 버튼을 클릭하세요"
                            className="flex-1 outline-none cursor-not-allowed bg-gray-50"
                          />
                          <button
                            type="button"
                            onClick={openPostcode}
                            className="px-4 py-1 text-sm text-white transition bg-blue-600 rounded hover:bg-blue-700"
                          >
                            주소 찾기
                          </button>
                        </div>
                        <input
                          type="text"
                          value={detailAddress}
                          onChange={(e) => setDetailAddress(e.target.value)}
                          placeholder="상세 주소를 입력하세요 (예: 3층)"
                          className="w-full pt-2 mt-2 outline-none border-t border-gray-200"
                        />
                      </div>
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
                  {["프론트엔드", "백엔드", "풀스택", "PM", "데이터 분석가", "디자이너"].map((job) => (
                    <button
                      key={job}
                      onClick={() => toggleJobSelect(job)}
                      className={`p-3 text-center border-2 rounded-lg cursor-pointer transition ${
                        selectedJobs.includes(job)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {job === "프론트엔드" ? "프론트" : job}
                    </button>
                  ))}
                </div>

                {/* ✅ 선택된 직무 표시 추가 */}
                {selectedJobs.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">선택된 직무</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJobs.map((job) => (
                        <button
                          key={job}
                          onClick={() => toggleJobSelect(job)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
                        >
                          <span>{job}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}


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
                      {/* 내용 입력 */}
                      <div className="mb-3">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          내용
                        </label>
                        <input
                          type="text"
                          placeholder="예: 프로젝트 1차"
                          value={experience.title}
                          onChange={(e) => {
                            const newExperiences = [...experiences];
                            newExperiences[index].title = e.target.value;
                            setExperiences(newExperiences);
                          }}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* 기간 선택 */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            시작일
                          </label>
                          <input
                            type="date"
                            value={experience.startDate}
                            onChange={(e) => {
                              const newExperiences = [...experiences];
                              newExperiences[index].startDate = e.target.value;
                              setExperiences(newExperiences);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            종료일
                          </label>
                          <input
                            type="date"
                            value={experience.endDate}
                            onChange={(e) => {
                              const newExperiences = [...experiences];
                              newExperiences[index].endDate = e.target.value;
                              setExperiences(newExperiences);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* 삭제 버튼 */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeExperience(index)}
                          className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-300 rounded-lg hover:bg-red-50"
                        >
                          삭제
                        </button>
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
                      {/* 내용 입력 */}
                      <div className="mb-3">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          내용
                        </label>
                        <input
                          type="text"
                          placeholder="예: 정보처리기사 1급"
                          value={certificate.title}
                          onChange={(e) => {
                            const newCertificates = [...certificates];
                            newCertificates[index].title = e.target.value;
                            setCertificates(newCertificates);
                          }}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* 취득일 선택 */}
                      <div className="mb-3">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          취득일
                        </label>
                        <input
                          type="date"
                          value={certificate.date}
                          onChange={(e) => {
                            const newCertificates = [...certificates];
                            newCertificates[index].date = e.target.value;
                            setCertificates(newCertificates);
                          }}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* 삭제 버튼 */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeCertificate(index)}
                          className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-300 rounded-lg hover:bg-red-50"
                        >
                          삭제
                        </button>
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
                <div className="space-y-4">
                  {educations.map((education, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-300 rounded-lg"
                    >
                      {/* 학교 이름, 학교 종류, 세부 종류 - ✅ 한 줄로 배치 */}
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        {/* 학교 이름 */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            학교 이름
                          </label>
                          <SchoolSearchInput
                            value={education.school}
                            onChange={(value) => {
                              const newEducations = [...educations];
                              newEducations[index].school = value;
                              setEducations(newEducations);
                            }}
                            schoolLevel={
                              education.type === "고등학교"
                                ? "high"
                                : education.type === "대학교"
                                  ? "college"
                                  : education.type === "대학원"
                                    ? "graduate"
                                    : undefined
                            }
                            placeholder={`예: ${
                              education.type === "고등학교"
                                ? "서울고등학교"
                                : education.type === "대학교"
                                  ? "서울대학교"
                                  : education.type === "대학원"
                                    ? "서울대학교 대학원"
                                    : "학교 이름을 입력하세요"
                            }`}
                          />
                        </div>

                        {/* 학교 종류 */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            학교 종류
                          </label>
                          <select
                            value={education.type}
                            onChange={(e) => {
                              const newEducations = [...educations];
                              newEducations[index].type = e.target.value;
                              newEducations[index].subType = "";
                              setEducations(newEducations);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                          >
                            <option value="">선택</option>
                            <option value="고등학교">고등학교</option>
                            <option value="대학교">대학교</option>
                            <option value="대학원">대학원</option>
                          </select>
                        </div>

                        {/* 세부 종류 */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            세부 종류
                          </label>
                          <select
                            value={education.subType}
                            onChange={(e) => {
                              const newEducations = [...educations];
                              newEducations[index].subType = e.target.value;
                              setEducations(newEducations);
                            }}
                            disabled={!education.type}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500 disabled:bg-gray-100"
                          >
                            <option value="">선택</option>
                            {education.type === "고등학교" && (
                              <>
                                <option value="일반고">일반고</option>
                                <option value="특목고">특목고</option>
                                <option value="특성화고">특성화고</option>
                                <option value="마이스터고">마이스터고</option>
                                <option value="자율고">자율고</option>
                                <option value="영재고">영재고</option>
                              </>
                            )}
                            {education.type === "대학교" && (
                              <>
                                <option value="2년제">2년제</option>
                                <option value="3년제">3년제</option>
                                <option value="4년제">4년제</option>
                              </>
                            )}
                            {education.type === "대학원" && (
                              <>
                                <option value="석사">석사</option>
                                <option value="박사">박사</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>

                      {/* 학과 */}
                      <div className="mb-3">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          학과
                        </label>
                        <input
                          type="text"
                          placeholder="예: 컴퓨터공학과"
                          value={education.major}
                          onChange={(e) => {
                            const newEducations = [...educations];
                            newEducations[index].major = e.target.value;
                            setEducations(newEducations);
                          }}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* 기간 선택 */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            입학일
                          </label>
                          <input
                            type="date"
                            value={education.startDate}
                            onChange={(e) => {
                              const newEducations = [...educations];
                              newEducations[index].startDate = e.target.value;
                              setEducations(newEducations);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            졸업일
                          </label>
                          <input
                            type="date"
                            value={education.endDate}
                            onChange={(e) => {
                              const newEducations = [...educations];
                              newEducations[index].endDate = e.target.value;
                              setEducations(newEducations);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* 삭제 버튼 */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeEducation(index)}
                          className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-300 rounded-lg hover:bg-red-50"
                        >
                          삭제
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
                <div className="space-y-4">
                  {careers.map((career, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-300 rounded-lg"
                    >
                      {/* 기간 선택 */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            시작일
                          </label>
                          <input
                            type="date"
                            value={career.startDate}
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].startDate = e.target.value;
                              setCareers(newCareers);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            퇴사일
                          </label>
                          <input
                            type="date"
                            value={career.endDate}
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].endDate = e.target.value;
                              setCareers(newCareers);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* 회사명, 직책 - ✅ 한 줄로 배치 */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        {/* 회사명 */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            회사명
                          </label>
                          <input
                            type="text"
                            placeholder="예: 네이버"
                            value={career.company}
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].company = e.target.value;
                              setCareers(newCareers);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* 직책 */}
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            직책
                          </label>
                          <input
                            type="text"
                            placeholder="예: 대리, 팀장"
                            value={career.position}
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].position = e.target.value;
                              setCareers(newCareers);
                            }}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* 직무 */}
                      <div className="mb-3">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          직무
                        </label>
                        <textarea
                          placeholder="담당했던 업무 및 직무를 자세히 작성해주세요"
                          value={career.role}
                          onChange={(e) => {
                            const newCareers = [...careers];
                            newCareers[index].role = e.target.value;
                            setCareers(newCareers);
                          }}
                          rows={4}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none resize-none focus:border-blue-500"
                        />
                      </div>

                      {/* 삭제 버튼 */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeCareer(index)}
                          className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-300 rounded-lg hover:bg-red-50"
                        >
                          삭제
                        </button>
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
                    onClick={handlePortfolioFileUpload}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + 파일 업로드
                  </button>
                </div>
                <input
                  type="file"
                  ref={portfolioFileInputRef}
                  onChange={handlePortfolioFileChange}
                  accept=".pdf,.doc,.docx"
                  multiple
                  className="hidden"
                />
                {portfolioFiles.length > 0 ? (
                  <div className="space-y-3">
                    {portfolioFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {file.name.endsWith(".pdf") ? "📄" : "📃"}
                          </span>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removePortfolioFile(index)}
                          className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-300 rounded-lg hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg">
                    <p className="text-gray-500">
                      포트폴리오 파일을 업로드해주세요 (PDF, Word)
                    </p>
                  </div>
                )}
              </div>

              {/* 자기소개서 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">자기소개서</h3>
                  <button
                    onClick={handleCoverLetterFileUpload}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + 파일 업로드
                  </button>
                </div>
                <input
                  type="file"
                  ref={coverLetterFileInputRef}
                  onChange={handleCoverLetterFileChange}
                  accept=".pdf,.doc,.docx"
                  multiple
                  className="hidden"
                />

                {/* 업로드된 파일 목록 */}
                {coverLetterFiles.length > 0 && (
                  <div className="mb-4 space-y-3">
                    {coverLetterFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {file.name.endsWith(".pdf") ? "📄" : "📃"}
                          </span>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeCoverLetterFile(index)}
                          className="px-4 py-2 text-sm font-medium text-red-600 transition border-2 border-red-300 rounded-lg hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 텍스트 작성 영역 */}
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
