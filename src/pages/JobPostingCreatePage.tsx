import { useState } from "react";
import Footer from "../components/Footer";

interface JobPostingCreatePageProps {
  onBackClick?: () => void;
  onLogoClick?: () => void;
}

export default function JobPostingCreatePage({
  onBackClick,
  onLogoClick,
}: JobPostingCreatePageProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    job_category: "",
    required_skills: "",
    preferred_skills: "",
    experience_min: "",
    experience_max: "",
    salary_min: "",
    salary_max: "",
    location: "",
    description: "",
    deadline: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (formData.experience_min && formData.experience_max) {
      const min = parseInt(formData.experience_min);
      const max = parseInt(formData.experience_max);
      if (min > max) {
        alert("최소 경력이 최대 경력보다 클 수 없습니다.");
        return;
      }
    }

    if (formData.salary_min && formData.salary_max) {
      const min = parseInt(formData.salary_min);
      const max = parseInt(formData.salary_max);
      if (min > max) {
        alert("최소 연봉이 최대 연봉보다 클 수 없습니다.");
        return;
      }
    }

    // 여기에 실제 등록 로직 추가
    console.log("등록 데이터:", formData);
    alert("공고가 성공적으로 등록되었습니다! 🎉");
    if (onBackClick) {
      onBackClick();
    }
  };

  const handleGoToMain = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?")) {
      if (onBackClick) {
        onBackClick();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div
              onClick={handleGoToMain}
              className="transition-opacity cursor-pointer hover:opacity-80"
            >
              <span className="text-2xl font-bold text-blue-600">Next </span>
              <span className="text-2xl font-bold text-blue-800">Enter</span>
            </div>

            {/* 네비게이션 */}
            <nav className="flex space-x-8">
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                ■ 채용공고
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                자료
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                홍보
              </button>
            </nav>

            {/* 오른쪽 버튼 */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                로그인
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600">
                회원가입
              </button>
              <button
                onClick={handleGoToMain}
                className="px-4 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                개인 회원
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 타이틀 배너 */}
      <div className="py-8 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="px-6 mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-center text-white">
            새 공고 등록
          </h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-6 py-10 mx-auto max-w-7xl">
        <div className="p-10 bg-white border border-gray-200 shadow-2xl rounded-3xl">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              {/* 왼쪽: 폼 필드 (2/3) */}
              <div className="space-y-6 lg:col-span-2">
                {/* 공고 제목 */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    공고 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="예: [신입/경력] 프론트엔드 개발자 채용"
                    maxLength={200}
                    className="w-full px-4 py-3 transition-colors border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.title.length}/200자
                  </p>
                </div>

                {/* 직무 분류 (모집직무) */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    직무 분류 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="job_category"
                    value={formData.job_category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="프론트엔드 개발자">프론트엔드 개발자</option>
                    <option value="백엔드 개발자">백엔드 개발자</option>
                    <option value="풀스택 개발자">풀스택 개발자</option>
                    <option value="PM">PM</option>
                    <option value="데이터 분석가">데이터 분석가</option>
                    <option value="디자이너">디자이너</option>
                  </select>
                </div>

                {/* 근무지 */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    근무지 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="서울특별시 강남구 테헤란로 123"
                    maxLength={100}
                    className="w-full px-4 py-3 transition-colors border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* 경력 범위 */}
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    경력 (년)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        name="experience_min"
                        value={formData.experience_min}
                        onChange={handleInputChange}
                        placeholder="최소 경력 (예: 0)"
                        min="0"
                        className="w-full px-4 py-3 transition-colors border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="experience_max"
                        value={formData.experience_max}
                        onChange={handleInputChange}
                        placeholder="최대 경력 (예: 5)"
                        min="0"
                        className="w-full px-4 py-3 transition-colors border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    * 신입의 경우 최소 0년, 경력무관의 경우 비워두세요
                  </p>
                </div>

                {/* 연봉 범위 */}
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    연봉 (만원)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        name="salary_min"
                        value={formData.salary_min}
                        onChange={handleInputChange}
                        placeholder="최소 연봉 (예: 3000)"
                        min="0"
                        step="100"
                        className="w-full px-4 py-3 transition-colors border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="salary_max"
                        value={formData.salary_max}
                        onChange={handleInputChange}
                        placeholder="최대 연봉 (예: 5000)"
                        min="0"
                        step="100"
                        className="w-full px-4 py-3 transition-colors border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    * 연봉 협의시 비워두세요
                  </p>
                </div>

                {/* 필수 스킬 */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    필수 스킬
                  </label>
                  <textarea
                    name="required_skills"
                    value={formData.required_skills}
                    onChange={handleInputChange}
                    placeholder="예:&#10;- React, TypeScript 실무 경험&#10;- RESTful API 설계 및 구현 경험&#10;- Git을 활용한 협업 경험"
                    rows={4}
                    className="w-full px-4 py-3 transition-colors border-2 border-gray-200 resize-none rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 우대 스킬 */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    우대 스킬
                  </label>
                  <textarea
                    name="preferred_skills"
                    value={formData.preferred_skills}
                    onChange={handleInputChange}
                    placeholder="예:&#10;- Next.js 프레임워크 사용 경험&#10;- AWS 등 클라우드 서비스 경험&#10;- 오픈소스 프로젝트 기여 경험"
                    rows={4}
                    className="w-full px-4 py-3 transition-colors border-2 border-gray-200 resize-none rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 상세 설명 */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    상세 설명 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="담당 업무, 근무 환경, 복리후생 등 상세한 내용을 작성해주세요."
                    rows={8}
                    className="w-full px-4 py-3 transition-colors border-2 border-gray-200 resize-none rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* 마감일 */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    마감일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 transition-colors border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* 오른쪽: 이미지 업로드 (1/3) */}
              <div className="space-y-6 lg:col-span-1">
                {/* 이미지 미리보기 */}
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    모집 사진
                  </label>
                  <div
                    onClick={() =>
                      document.getElementById("imageInput")?.click()
                    }
                    className={`relative w-full h-96 border-3 ${
                      imagePreview
                        ? "border-blue-500 border-solid"
                        : "border-dashed border-gray-300"
                    } rounded-2xl cursor-pointer hover:border-blue-400 transition-all overflow-hidden group ${
                      !imagePreview ? "bg-gray-50" : ""
                    }`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 text-3xl text-white rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-blue-700">
                          📷
                        </div>
                        <div className="text-center">
                          <div className="mb-1 text-lg font-semibold text-gray-700">
                            모집 사진 추가
                          </div>
                          <div className="text-sm text-gray-500">
                            클릭하여 이미지를 업로드하세요
                          </div>
                        </div>
                      </div>
                    )}
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* 크레딧 정보 */}
                <div className="p-5 border-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-yellow-900">
                      차감 크레딧
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🪙</span>
                      <span className="text-2xl font-bold text-yellow-900">
                        50
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex gap-4 pt-8 mt-10 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-8 py-4 font-semibold text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-4 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:shadow-xl hover:from-blue-700 hover:to-blue-800"
              >
                공고 등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
