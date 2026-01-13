import { useState } from 'react';

type ApplicationStatus = '서류 접수' | '서류 통과' | '면접 진행' | '최종 합격' | '불합격';

interface Application {
  id: number;
  company: string;
  position: string;
  appliedDate: string;
  status: ApplicationStatus;
  deadline: string;
}

export default function ApplicationStatusPage() {
  const [applications] = useState<Application[]>([
    {
      id: 1,
      company: '네이버',
      position: '프론트엔드 개발자',
      appliedDate: '2025.01.10',
      status: '서류 통과',
      deadline: '2025.01.20'
    },
    {
      id: 2,
      company: '카카오',
      position: 'React 개발자',
      appliedDate: '2025.01.08',
      status: '면접 진행',
      deadline: '2025.01.18'
    },
    {
      id: 3,
      company: '토스',
      position: '풀스택 엔지니어',
      appliedDate: '2025.01.05',
      status: '서류 접수',
      deadline: '2025.01.15'
    },
    {
      id: 4,
      company: '쿠팡',
      position: 'Frontend Developer',
      appliedDate: '2025.01.03',
      status: '최종 합격',
      deadline: '2025.01.10'
    },
    {
      id: 5,
      company: '당근마켓',
      position: '웹 개발자',
      appliedDate: '2024.12.28',
      status: '불합격',
      deadline: '2025.01.05'
    }
  ]);

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case '서류 접수':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case '서류 통과':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case '면접 진행':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case '최종 합격':
        return 'bg-green-100 text-green-700 border-green-300';
      case '불합격':
        return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case '서류 접수':
        return '📝';
      case '서류 통과':
        return '✅';
      case '면접 진행':
        return '🎯';
      case '최종 합격':
        return '🎉';
      case '불합격':
        return '❌';
    }
  };

  const handleApplicationClick = (id: number) => {
    console.log(`지원 ${id} 클릭됨`);
  };

  const handleCancelApplication = (id: number) => {
    if (confirm('정말 지원을 취소하시겠습니까?')) {
      console.log(`지원 ${id} 취소됨`);
    }
  };

  // 상태별 통계
  const stats = {
    total: applications.length,
    accepted: applications.filter(a => a.status === '최종 합격').length,
    inProgress: applications.filter(a => ['서류 접수', '서류 통과', '면접 진행'].includes(a.status)).length,
    rejected: applications.filter(a => a.status === '불합격').length
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h1 className="text-3xl font-bold">입사 지원 현황</h1>
            </div>
            <p className="text-gray-600">지원한 공고의 진행 상황을 확인하세요</p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border-2 border-blue-400 p-6">
              <div className="text-gray-600 text-sm mb-2">전체 지원</div>
              <div className="text-3xl font-bold text-blue-600">{stats.total}건</div>
            </div>
            <div className="bg-white rounded-xl border-2 border-green-400 p-6">
              <div className="text-gray-600 text-sm mb-2">최종 합격</div>
              <div className="text-3xl font-bold text-green-600">{stats.accepted}건</div>
            </div>
            <div className="bg-white rounded-xl border-2 border-purple-400 p-6">
              <div className="text-gray-600 text-sm mb-2">진행 중</div>
              <div className="text-3xl font-bold text-purple-600">{stats.inProgress}건</div>
            </div>
            <div className="bg-white rounded-xl border-2 border-red-400 p-6">
              <div className="text-gray-600 text-sm mb-2">불합격</div>
              <div className="text-3xl font-bold text-red-600">{stats.rejected}건</div>
            </div>
          </div>

          {/* 지원 목록 */}
          <div className="bg-white rounded-2xl border-2 border-blue-400 p-6">
            <h2 className="text-xl font-bold mb-6">지원 목록</h2>

            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleApplicationClick(app.id)}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold">{app.company}</h3>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)} {app.status}
                        </span>
                      </div>
                      <p className="text-lg text-gray-700 mb-4">{app.position}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>지원일: {app.appliedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>⏰</span>
                          <span>마감일: {app.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplicationClick(app.id);
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        상세보기
                      </button>
                      {['서류 접수', '서류 통과'].includes(app.status) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelApplication(app.id);
                          }}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                          지원 취소
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">지원한 공고가 없습니다</h3>
                <p className="text-gray-500">관심있는 공고에 지원해보세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
