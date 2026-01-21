import api from "./axios";

const API_BASE_URL = "/api/bookmarks";

// 북마크 응답 타입
export interface BookmarkDto {
  bookmarkId: number;
  jobPostingId: number;
  createdAt: string;
}

// 북마크 토글 응답 타입
export interface BookmarkToggleResponse {
  isBookmarked: boolean;
  bookmark?: BookmarkDto;
}

// 북마크 여부 확인 응답 타입
export interface BookmarkCheckResponse {
  isBookmarked: boolean;
}

/**
 * 북마크 토글 (있으면 삭제, 없으면 추가)
 * PUT /api/bookmarks/{jobPostingId}/toggle?userId={userId}
 */
export const toggleBookmark = async (
  userId: number,
  jobId: number
): Promise<BookmarkToggleResponse> => {
  const response = await api.put(
    `${API_BASE_URL}/${jobId}/toggle`,
    {},
    {
      params: { userId },
    }
  );
  return response.data;
};

/**
 * 북마크 여부 확인
 * GET /api/bookmarks/{jobPostingId}/status?userId={userId}
 */
export const checkBookmark = async (
  userId: number,
  jobId: number
): Promise<BookmarkCheckResponse> => {
  const response = await api.get(`${API_BASE_URL}/${jobId}/status`, {
    params: { userId },
  });
  return response.data;
};

/**
 * 북마크 추가
 * POST /api/bookmarks/{jobPostingId}?userId={userId}
 */
export const addBookmark = async (
  userId: number,
  jobId: number
): Promise<BookmarkDto> => {
  const response = await api.post(
    `${API_BASE_URL}/${jobId}`,
    {},
    {
      params: { userId },
    }
  );
  return response.data;
};

/**
 * 북마크 삭제
 * DELETE /api/bookmarks/{jobPostingId}?userId={userId}
 */
export const removeBookmark = async (
  userId: number,
  jobId: number
): Promise<void> => {
  await api.delete(`${API_BASE_URL}/${jobId}`, {
    params: { userId },
  });
};