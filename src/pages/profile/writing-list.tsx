import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';

type TabType = 'available' | 'inProgress' | 'completed';

interface Profile {
  id: number;
  imageUrl: string;
  name: string;
  category: string;
  subCategory: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt?: string;
}

// 임시 데이터
const mockProfiles: Record<TabType, Profile[]> = {
  available: [
    {
      id: 1,
      imageUrl: '/placeholder-profile.jpg',
      name: '고수 님이라',
      category: '미용',
      subCategory: '헤어',
      tags: ['#찰리', '#단발 머리', '#옴므 스타일'],
      likes: 27,
      comments: 13,
    },
    {
      id: 2,
      imageUrl: '/placeholder-profile.jpg',
      name: '고수 님이라',
      category: '미용',
      subCategory: '헤어',
      tags: [],
      likes: 0,
      comments: 0,
    },
  ],
  inProgress: [],
  completed: [],
};

export function ProfileWritingListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('available');

  const tabs = [
    { id: 'available' as TabType, label: '작성 가능' },
    { id: 'inProgress' as TabType, label: '작성 중' },
    { id: 'completed' as TabType, label: '작성 완료' },
  ];

  const profiles = mockProfiles[activeTab];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold -ml-6">
          나의 후기
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-base font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-16 h-16 mb-4">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <path
                  d="M32 8L42 28H22L32 8Z"
                  fill="#FFD700"
                  stroke="#FFA500"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="text-gray-800 font-medium mb-2">
              {activeTab === 'available' && '아직 작성 완료된 후기가 없어요'}
              {activeTab === 'inProgress' && '작성 중인 후기가 없어요'}
              {activeTab === 'completed' && '작성 완료된 후기가 없어요'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => navigate(`/profile/detail/${profile.id}`)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Profile Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.style.backgroundColor = '#E5E7EB';
                      }}
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">
                      {profile.category} · {profile.subCategory}
                    </div>
                    <div className="font-semibold mb-2">{profile.name}</div>
                    {profile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {profile.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>찜 {profile.likes}</span>
                      <span>댓글 {profile.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
