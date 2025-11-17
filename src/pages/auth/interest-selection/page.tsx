import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../../images/login/back.svg';
import { InterestCard } from '../../../components/ui/interest-card';

type Interest = 'hair' | 'fashion' | 'makeup' | 'skincare';

const interests: { id: Interest; label: string }[] = [
  { id: 'hair', label: '헤어' },
  { id: 'fashion', label: '피부' },
  { id: 'makeup', label: '메이크업' },
  { id: 'skincare', label: '패션' },
];

export function InterestSelectionPage() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    console.log('선택된 관심 분야:', selectedInterests);
    // TODO: 다음 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <button
          onClick={handleSubmit}
          className="text-base text-gray-400 hover:text-black"
        >
          건너뛰기
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 pt-8">
        <h1 className="text-2xl font-bold mb-12">관심 분야를 선택해주세요</h1>

        {/* Interest Grid */}
        <div className="grid grid-cols-3 gap-4">
          {interests.map((interest) => (
            <InterestCard
              key={interest.id}
              label={interest.label}
              isSelected={selectedInterests.includes(interest.id)}
              onClick={() => toggleInterest(interest.id)}
            />
          ))}
        </div>
      </div>

      {/* Submit Button - 하단 고정 */}
      <div className="mt-auto">
        <button
          onClick={handleSubmit}
          className="w-full h-14 font-medium transition-colors bg-black text-white"
        >
          다음
        </button>
      </div>
    </div>
  );
}
