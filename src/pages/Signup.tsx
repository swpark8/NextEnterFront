import { useState } from "react";

interface SignupPageProps {
  onLogoClick?: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  initialAccountType?: "personal" | "business";
}

export default function SignupPage({
  onLogoClick,
  onLoginClick,
  initialAccountType = "personal",
}: SignupPageProps) {
  const [accountType, setAccountType] = useState<"personal" | "business">(
    initialAccountType || "personal"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const passwordsMatch =
    password && passwordConfirm && password === passwordConfirm;
  const showPasswordMismatch = passwordConfirm && password !== passwordConfirm;

  const validateField = (fieldName: string, value: string) => {
    let error = "";
    switch (fieldName) {
      case "email":
        if (!value.trim()) error = "이메일을 입력해주세요";
        break;
      case "password":
        if (!value.trim()) error = "비밀번호를 입력해주세요";
        break;
      case "passwordConfirm":
        if (!value.trim()) error = "비밀번호를 다시 입력해주세요";
        else if (password !== value) error = "비밀번호가 일치하지 않습니다";
        break;
      case "name":
        if (!value.trim()) error = "이름을 입력해주세요";
        break;
      case "phone":
        if (!value.trim()) error = "전화번호를 입력해주세요";
        break;
      case "businessNumber":
        if (accountType === "business" && !value.trim())
          error = "사업자등록번호를 입력해주세요";
        break;
      case "companyName":
        if (accountType === "business" && !value.trim())
          error = "기업명을 입력해주세요";
        break;
      case "industry":
        if (accountType === "business" && !value.trim())
          error = "업종을 입력해주세요";
        break;
    }
    return error;
  };

  const handleBlur = (fieldName: string, value: string) => {
    setTouched({ ...touched, [fieldName]: true });
    const error = validateField(fieldName, value);
    setErrors({ ...errors, [fieldName]: error });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) newErrors.email = "이메일을 입력해주세요";
    if (!password.trim()) newErrors.password = "비밀번호를 입력해주세요";
    if (!passwordConfirm.trim())
      newErrors.passwordConfirm = "비밀번호를 다시 입력해주세요";
    if (password !== passwordConfirm)
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    if (!name.trim()) newErrors.name = "이름을 입력해주세요";
    if (!phone.trim()) newErrors.phone = "전화번호를 입력해주세요";
    if (accountType === "business") {
      if (!businessNumber.trim())
        newErrors.businessNumber = "사업자등록번호를 입력해주세요";
      if (!companyName.trim()) newErrors.companyName = "기업명을 입력해주세요";
      if (!industry.trim()) newErrors.industry = "업종을 입력해주세요";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (accountType === "personal") {
      console.log("개인회원 가입:", {
        email,
        password,
        name,
        phone,
        age,
        gender,
      });
    } else {
      console.log("기업회원 가입:", {
        email,
        password,
        name,
        phone,
        businessNumber,
        companyName,
        industry,
        employeeCount,
        companyUrl,
        companyDescription,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상단 로고 영역 */}
      <div className="w-full bg-white border-b border-gray-200 py-6 flex justify-center">
        <div
          className="w-32 h-12 border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400 transition"
          onClick={onLogoClick}
        >
          <p className="text-gray-400 text-xs">로고</p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="flex mb-6">
            <button
              onClick={() => {
                setAccountType("personal");
                setErrors({});
              }}
              className={`flex-1 py-4 text-center font-bold transition-all ${
                accountType === "personal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              개인회원
            </button>
            <button
              onClick={() => {
                setAccountType("business");
                setErrors({});
              }}
              className={`flex-1 py-4 text-center font-bold transition-all ${
                accountType === "business"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              기업회원
            </button>
          </div>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-blue-500 text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-blue-500 text-sm ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                onBlur={(e) => handleBlur("passwordConfirm", e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:outline-none text-sm ${
                  showPasswordMismatch
                    ? "border-red-500"
                    : passwordsMatch
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              />
              {showPasswordMismatch && touched.passwordConfirm && (
                <p className="text-red-500 text-xs mt-1">
                  비밀번호가 일치하지 않습니다
                </p>
              )}
              {passwordsMatch && touched.passwordConfirm && (
                <p className="text-green-500 text-xs mt-1">
                  비밀번호가 일치합니다
                </p>
              )}
              {errors.passwordConfirm &&
                !showPasswordMismatch &&
                touched.passwordConfirm && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.passwordConfirm}
                  </p>
                )}
            </div>
            <div>
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => handleBlur("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-blue-500 text-sm ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                type="tel"
                placeholder="전화번호 (예: 010-1234-5678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={(e) => handleBlur("phone", e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-blue-500 text-sm ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
            {accountType === "personal" && (
              <>
                <div>
                  <input
                    type="number"
                    placeholder="나이 (선택사항)"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm text-gray-700"
                  >
                    <option value="">성별 선택 (선택사항)</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </>
            )}
            {accountType === "business" && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="사업자등록번호 (예: 123-45-67890)"
                    value={businessNumber}
                    onChange={(e) => setBusinessNumber(e.target.value)}
                    onBlur={(e) => handleBlur("businessNumber", e.target.value)}
                    className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-blue-500 text-sm ${
                      errors.businessNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.businessNumber && touched.businessNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.businessNumber}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="기업명"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onBlur={(e) => handleBlur("companyName", e.target.value)}
                    className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-blue-500 text-sm ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.companyName && touched.companyName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.companyName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="업종 (예: IT/소프트웨어)"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    onBlur={(e) => handleBlur("industry", e.target.value)}
                    className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-blue-500 text-sm ${
                      errors.industry ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.industry && touched.industry && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.industry}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm text-gray-700"
                  >
                    <option value="">직원수 선택 (선택사항)</option>
                    <option value="1-10">1-10명</option>
                    <option value="11-50">11-50명</option>
                    <option value="51-100">51-100명</option>
                    <option value="101-500">101-500명</option>
                    <option value="500+">500명 이상</option>
                  </select>
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="회사 홈페이지 URL (선택사항)"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="회사소개 (선택사항)"
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm resize-none"
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white text-base font-bold rounded hover:bg-blue-700 transition-colors mt-6"
            >
              가입하기
            </button>
          </form>
          <div className="text-center mt-6 text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={onLoginClick}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
