import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000, // 5초 타임아웃 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 로그아웃 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ 401 에러 - 토큰 만료 또는 유효하지 않음");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // 현재 페이지가 /company로 시작하면 기업 로그인으로
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/company")) {
        window.location.href = "/company/login";
      } else {
        window.location.href = "/user/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
