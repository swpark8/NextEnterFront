// src/features/cover-letter/CoverLetterPage.tsx

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ResumeSidebar from "../resume/components/ResumeSidebar";
import CoverLetterFormPage from "./CoverLetterFormPage";
import CoverLetterDetailPage from "./CoverLetterDetailPage";
import { usePageNavigation } from "../../hooks/usePageNavigation";
import {
  getCoverLetterList,
  uploadCoverLetterFile,
  deleteCoverLetter,
  createCoverLetter,
  updateCoverLetter,
  type CoverLetter,
} from "../../api/coverletter";

// 데이터 타입 정의 (자소서 하나가 이렇게 생겼다)
interface CoverLetterItem {
  id: number;
  title: string;
  content: string; // 내용 추가
  date: string;
  fileCount: number;
  status: string;
  files: string[]; // 첨부파일 목록 추가
}

interface CoverLetterPageProps {
  initialMenu?: string;
  onNavigate?: (page: string, subMenu?: string) => void;
}

// 현재 화면 상태를 나타내는 타입
type ViewMode = "list" | "create" | "detail" | "edit";

export default function CoverLetterPage({
  initialMenu,
  onNavigate,
}: CoverLetterPageProps) {
  const { user } = useAuth();
  
  // 현재 화면 모드 (목록 / 작성 / 상세보기 / 수정)
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // 선택된 자소서 ID
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 자소서 목록
  const [coverLetterList, setCoverLetterList] = useState<CoverLetterItem[]>([]);
  
  // ✅ 로딩 상태
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { activeMenu, handleMenuClick } = usePageNavigation(
    "resume",
    initialMenu,
    onNavigate
  );

  // ✅ 페이지 로드 시 자소서 목록 불러오기
  useEffect(() => {
    const loadCoverLetters = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        const response = await getCoverLetterList(user.userId, 0, 100);
        
        const items: CoverLetterItem[] = response.content.map((cl: CoverLetter) => {
          const hasFile = !!cl.filePath;
          const hasContent = !!(cl.content && cl.content.trim().length > 0);
        
          return {
            id: cl.coverLetterId,
            title: cl.title,
            content: cl.content || "",
            date: new Date(cl.updatedAt).toLocaleDateString(),
            fileCount: hasFile ? 1 : 0,
        
            // ✅ 상태 표시 규칙
            // 파일 있으면: 불러온 파일
            // 파일 없고 내용 있으면: 작성완료
            // 둘 다 없으면: 작성중
            status: hasFile ? "불러온 파일" : hasContent ? "작성완료" : "작성중",
        
            files: hasFile ? [cl.title] : [],
          };
        });
        
        setCoverLetterList(items);
      } catch (error) {
        console.error("자소서 목록 로드 실패:", error);
        alert("자소서 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadCoverLetters();
  }, [user?.userId]);

  // 파일 업로드 버튼 클릭
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // ✅ 파일 선택 시 처리 - API 호출
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.userId) return;

    try {
      setLoading(true);
      const response = await uploadCoverLetterFile(user.userId, file);
      
      const newItem: CoverLetterItem = {
        id: response.coverLetterId,
        title: response.title,
        content: "",
        date: new Date().toLocaleDateString(),
        fileCount: 1,
        status: "불러온 파일",
        files: [response.title],
      };
      
      setCoverLetterList((prev) => [newItem, ...prev]);
      alert("파일이 성공적으로 업로드되었습니다.");
    } catch (error: any) {
      console.error("파일 업로드 실패:", error);
      alert(error.response?.data?.message || "파일 업로드에 실패했습니다.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // ✅ 자소서 작성 완료 시 저장 - API 호출
  const handleSaveData = async (data: {
    title: string;
    content: string;
    fileCount: number;
    files: string[];
  }) => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      const coverLetterId = await createCoverLetter(user.userId, {
        title: data.title || "제목 없는 자소서",
        content: data.content,
      });

      const newItem: CoverLetterItem = {
        id: coverLetterId,
        title: data.title || "제목 없는 자소서",
        content: data.content,
        date: new Date().toLocaleDateString(),
        fileCount: data.fileCount,
        status: "작성중",
        files: data.files,
      };
      setCoverLetterList((prev) => [newItem, ...prev]);
      setViewMode("list");
      alert("자소서가 등록되었습니다.");
    } catch (error: any) {
      console.error("자소서 저장 실패:", error);
      alert(error.response?.data?.message || "자소서 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 자소서 카드 클릭 → 상세보기로 이동
  const handleCardClick = (id: number) => {
    setSelectedId(id);
    setViewMode("detail");
  };

  // 상세보기에서 수정 클릭
  const handleEditClick = () => {
    setViewMode("edit");
  };

  // ✅ 자소서 삭제 - API 호출
  const handleDelete = async () => {
    if (!selectedId || !user?.userId) return;

    if (!confirm("정말로 이 자소서를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteCoverLetter(user.userId, selectedId);
      
      setCoverLetterList((prev) =>
        prev.filter((item) => item.id !== selectedId)
      );
      setSelectedId(null);
      setViewMode("list");
      alert("자소서가 삭제되었습니다.");
    } catch (error: any) {
      console.error("자소서 삭제 실패:", error);
      alert(error.response?.data?.message || "자소서 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 자소서 수정 완료 시 업데이트 - API 호출
  const handleUpdateData = async (data: {
    title: string;
    content: string;
    fileCount: number;
    files: string[];
  }) => {
    if (!selectedId || !user?.userId) return;

    try {
      setLoading(true);
      await updateCoverLetter(user.userId, selectedId, {
        title: data.title || "제목 없는 자소서",
        content: data.content,
      });

      setCoverLetterList((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                title: data.title || "제목 없는 자소서",
                content: data.content,
                date: new Date().toLocaleDateString(),
                fileCount: data.fileCount,
                files: data.files,
              }
            : item
        )
      );
      setViewMode("detail");
      alert("자소서가 수정되었습니다.");
    } catch (error: any) {
      console.error("자소서 수정 실패:", error);
      alert(error.response?.data?.message || "자소서 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 선택된 자소서 데이터 가져오기
  const selectedCoverLetter = coverLetterList.find(
    (item) => item.id === selectedId
  );

  // 작성 모드
  if (viewMode === "create") {
    return (
      <CoverLetterFormPage
        onBack={() => setViewMode("list")}
        onMenuClick={handleMenuClick}
        onSave={handleSaveData}
        activeMenu={activeMenu}
      />
    );
  }

  // 상세보기 모드
  if (viewMode === "detail" && selectedCoverLetter) {
    return (
      <CoverLetterDetailPage
        coverLetter={selectedCoverLetter}
        onBack={() => {
          setSelectedId(null);
          setViewMode("list");
        }}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onMenuClick={handleMenuClick}
        activeMenu={activeMenu}
      />
    );
  }

  // 수정 모드
  if (viewMode === "edit" && selectedCoverLetter) {
    return (
      <CoverLetterFormPage
        onBack={() => setViewMode("detail")}
        onMenuClick={handleMenuClick}
        onSave={handleUpdateData}
        initialData={selectedCoverLetter} // 수정할 데이터 전달
        isEditMode={true}
        activeMenu={activeMenu}
      />
    );
  }

  // 목록 모드 (기본)
  return (
    <div className="px-4 py-8 mx-auto max-w-7xl bg-white">
      <h2 className="inline-block mb-6 text-2xl font-bold">자소서</h2>
      <div className="flex gap-6">
        <ResumeSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

        <div className="flex-1 space-y-8">
          <section className="p-8 bg-white border-2 border-gray-200 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">자소서 관리</h2>
              <div className="flex gap-4">
                <button
                  onClick={handleFileUpload}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  + 불러오기
                </button>
                <button
                  onClick={() => setViewMode("create")}
                  disabled={loading}
                  className="px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  자소서 작성
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.hwp"
              className="hidden"
            />

            {loading ? (
              <div className="py-12 text-center text-gray-500">
                <div className="mb-2 text-4xl">⏳</div>
                <p>로딩 중...</p>
              </div>
            ) : coverLetterList.length === 0 ? (
              <div className="mb-6">
                <div className="py-12 text-center text-gray-500 border-2 border-gray-200 border-dashed rounded-xl">
                  <div className="mb-2 text-4xl">📝</div>
                  <p>아직 등록된 자기소개서가 없습니다.</p>
                  <p className="text-sm text-gray-400">
                    새로운 자기소개서를 작성해보세요!
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="mb-2 text-sm text-gray-600">
                  총 {coverLetterList.length}건
                </div>

                <div className="space-y-4">
                  {coverLetterList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.id)}
                      className="p-6 transition border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {item.title}
                        </h3>
                        <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>최종수정: {item.date}</span>
                        <span className="mx-2">|</span>
                        <span>첨부파일: {item.fileCount}개</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
