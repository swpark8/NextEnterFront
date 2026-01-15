import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/company";

// 기업 회원가입 요청 타입
export interface CompanyRegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  businessNumber: string;
  companyName: string;
  industry?: string;
  employeeCount?: number;
  address?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
}

// 기업 회원가입 응답 타입
export interface CompanyResponse {
  companyId: number;
  email: string;
  name: string;
  companyName: string;
  businessNumber: string;
}

// 기업 로그인 요청 타입
export interface CompanyLoginRequest {
  email: string;
  password: string;
  businessNumber: string;
}

// 기업 로그인 응답 타입
export interface CompanyLoginResponse {
  companyId: number;
  token: string;
  email: string;
  name: string;
  companyName: string;
  businessNumber: string;
}

// API 응답 래퍼 타입
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// 기업 회원가입
export const registerCompany = async (
  data: CompanyRegisterRequest
): Promise<ApiResponse<CompanyResponse>> => {
  const response = await axios.post(`${API_BASE_URL}/register`, data);
  return response.data;
};

// 기업 로그인
export const loginCompany = async (
  data: CompanyLoginRequest
): Promise<ApiResponse<CompanyLoginResponse>> => {
  const response = await axios.post(`${API_BASE_URL}/login`, data);
  return response.data;
};

// 기업 로그아웃
export const logoutCompany = async (): Promise<ApiResponse<null>> => {
  const response = await axios.post(`${API_BASE_URL}/logout`);
  return response.data;
};
