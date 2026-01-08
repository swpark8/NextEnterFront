import { useState, useRef } from 'react';
import ResumeSidebar from './components/ResumeSidebar';

export default function ResumePage() {
  const [activeMenu, setActiveMenu] = useState('resume');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [devOpsSkills, setDevOpsSkills] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = () => {
    console.log('파일 선택 클릭됨');
    fileInputRef.current?.click();
  };

  const handleEdit = () => {
    console.log('수정 클릭됨');
  };

  const handleDelete = () => {
    console.log('삭제 클릭됨');
  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    console.log(`성별 선택: ${gender}`);
  };

  const devOpsOptions = [
    'AWS EC2', 'AWS S3', 'RDS', 'CloudFront', 
    'Docker', 'Nginx', 'GitHub Actions'
  ];

  const toggleDevOpsSkill = (skill: string) => {
    if (devOpsSkills.includes(skill)) {
      setDevOpsSkills(devOpsSkills.filter(s => s !== skill));
    } else {
      setDevOpsSkills([...devOpsSkills, skill]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* 왼쪽 사이드바 */}
          <ResumeSidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

          {/* 메인 컨텐츠 */}
          <div className="flex-1 space-y-8">
            {/* 섹션 1: 이력서 관리 */}
            <section className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">이력서 관리</h2>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  이력서 작성
                </button>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">총 1건</div>
                
                {/* 이력서 목록 */}
                <div className="border-2 border-gray-300 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">이력서 제목</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleEdit}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                      >
                        수정
                      </button>
                      <button 
                        onClick={handleDelete}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">산업:</span>
                      <span className="ml-2 font-medium">희망직무</span>
                    </div>
                    <div>
                      <span className="text-gray-600">지원 내역:</span>
                      <span className="ml-2 text-blue-600 underline cursor-pointer">3건 &gt;</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 파일 업로드 영역 */}
              <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-2xl p-12">
                <div className="text-center">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="font-bold text-lg mb-2">파일을 드래그 하거나 클릭하여 업로드</h3>
                  <p className="text-gray-600 mb-4">
                    지원 형식: PDF, WORD, HWP, EXCEL
                    <br />
                    (최대 10MB)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) console.log('파일 업로드됨:', file.name);
                    }}
                    accept=".pdf,.doc,.docx,.hwp,.xls,.xlsx"
                    className="hidden"
                  />
                  <button 
                    onClick={handleFileUpload}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold"
                  >
                    파일선택
                  </button>
                </div>
              </div>

              {/* 업로드 후 자동으로 전환됩니다 */}
              <div className="mt-6 border-l-4 border-red-400 bg-red-50 p-4">
                <h4 className="font-bold mb-2">업로드 후 자동으로 전환됩니다</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <div className="font-semibold">텍스트 추출</div>
                      <div className="text-xs text-gray-600">파일에서 텍스트를 자동으로 추출합니다</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <div className="font-semibold">AI 구조화</div>
                      <div className="text-xs text-gray-600">학력, 경력, 프로젝트 스킬 등을 자동 분류</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <div className="font-semibold">점수 추정</div>
                      <div className="text-xs text-gray-600">다수 눈문 급단 점수 등급 측정</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 섹션 2: 인적사항 */}
            <section className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="font-bold text-lg bg-blue-600 text-white px-6 py-3 rounded-lg">사진</h3>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">인적사항</h2>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
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
                      className="w-40 h-48 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition flex items-center justify-center block"
                    >
                      {selectedImage ? (
                        <img src={selectedImage} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-4xl text-gray-400">+</span>
                      )}
                    </label>
                  </div>

                  {/* 정보 입력 영역 */}
                  <div className="flex-1">
                    {/* 이름, 성별 */}
                    <div className="grid grid-cols-4 gap-0 mb-4 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <div className="border-r border-gray-300 p-3 bg-gray-50 text-center font-medium">
                        이름
                      </div>
                      <input 
                        type="text" 
                        className="border-r border-gray-300 p-3 outline-none" 
                        placeholder=""
                      />
                      <div className="border-r border-gray-300 p-3 bg-gray-50 text-center font-medium">
                        성별
                      </div>
                      <select 
                        value={selectedGender}
                        onChange={(e) => handleGenderSelect(e.target.value)}
                        className="p-3 outline-none cursor-pointer bg-white"
                      >
                        <option value="">선택</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-4 gap-0 mb-4 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <div className="border-r border-gray-300 p-3 bg-gray-50 text-center font-medium">
                        생년월일
                      </div>
                      <input 
                        type="text" 
                        className="col-span-3 p-3 outline-none" 
                        placeholder=""
                      />
                    </div>

                    {/* 이메일, 주소 */}
                    <div className="grid grid-cols-4 gap-0 mb-4 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <div className="border-r border-gray-300 p-3 bg-gray-50 text-center font-medium">
                        이메일
                      </div>
                      <input 
                        type="text" 
                        className="col-span-3 p-3 outline-none" 
                        placeholder=""
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-0 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <div className="border-r border-gray-300 p-3 bg-gray-50 text-center font-medium">
                        주소
                      </div>
                      <input 
                        type="text" 
                        className="col-span-3 p-3 outline-none" 
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 스킬 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-bold text-lg">스킬</h3>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="border-2 border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">PM</div>
                  <div className="border-2 border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">디자이너</div>
                  <div className="border-2 border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">FE</div>
                  <div className="border-2 border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">BE</div>
                  <div className="relative">
                    <div className="border-2 border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
                      DevOps
                    </div>
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {devOpsOptions.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleDevOpsSkill(skill)}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition ${
                            devOpsSkills.includes(skill) ? 'bg-blue-100 text-blue-600 font-semibold' : ''
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-gray-200 rounded-full text-sm">X | JAVA</button>
                  <button className="px-4 py-2 bg-gray-200 rounded-full text-sm">X | AWS</button>
                  <button className="px-4 py-2 bg-gray-200 rounded-full text-sm">X | CSS</button>
                  <button className="px-4 py-2 bg-gray-200 rounded-full text-sm">X | HTML</button>
                </div>
              </div>

              {/* 경험/활동/교육 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-bold text-lg">경험/활동/교육</h3>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <input 
                        type="text" 
                        placeholder="프로젝트 1차 | 2013.4 - 2015.5" 
                        className="flex-1 text-gray-700 outline-none font-medium"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={handleEdit}
                          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                        >
                          수정
                        </button>
                        <button 
                          onClick={handleDelete}
                          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <input 
                        type="text" 
                        placeholder="프로젝트 1차 | 2013.4 - 2015.5" 
                        className="flex-1 text-gray-700 outline-none font-medium"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={handleEdit}
                          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                        >
                          수정
                        </button>
                        <button 
                          onClick={handleDelete}
                          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 자격증/어학/수상 */}
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-4">자격증/어학/수상</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <input 
                      type="text" 
                      placeholder="정보처리기사 1급 | 2017.4" 
                      className="flex-1 text-gray-700 outline-none font-medium"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={handleEdit}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                      >
                        수정
                      </button>
                      <button 
                        onClick={handleDelete}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 섹션 3: 학력/경력/포트폴리오/자기소개서 */}
            <section className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              {/* 학력 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">학력</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">+ 추가</button>
                </div>
                <div className="space-y-3">
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <input 
                      type="text" 
                      placeholder="-- 대학교 (4년제) | 2012.03 ~ 2015.3" 
                      className="w-full outline-none"
                    />
                  </div>
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <input 
                      type="text" 
                      placeholder="-- 고등학교 (일반고) | 2013.02 ~ 2015.2" 
                      className="w-full outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 경력 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">경력</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">+ 추가</button>
                </div>
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <input 
                    type="text" 
                    placeholder="OO 테크 | 2019. 2 ~ 2023.5" 
                    className="w-full outline-none font-medium mb-2"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleEdit}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                    >
                      수정
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-xs"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>

              {/* 포트폴리오 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">포트폴리오</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">+ 추가</button>
                </div>
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border-2 border-gray-300 rounded-full text-sm">
                      X | 프로젝트 또 프토폴리오.pdf
                    </button>
                  </div>
                </div>
              </div>

              {/* 자기소개서 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">자기소개서</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">+ 클립오기</button>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <input 
                      type="text" 
                      placeholder="자소서 제목" 
                      className="w-full outline-none font-medium mb-2"
                    />
                  </div>
                  <textarea 
                    placeholder="내용입력" 
                    rows={6}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 outline-none resize-none"
                  />
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-end gap-4">
                <button className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition font-semibold">
                  취소
                </button>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold">
                  등록
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
