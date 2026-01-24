import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../../images/login/back.svg';
import hairIcon from '../../../images/login/hair.svg';
import fashionIcon from '../../../images/login/fashion.svg';
import makeupIcon from '../../../images/login/makeup.svg';
import skinIcon from '../../../images/login/skin.svg';
import { InterestCard } from '../../../components/ui/interest-card';

type Interest = 'hair' | 'fashion' | 'makeup' | 'skin';

const interests: { id: Interest; label: string; icon: string }[] = [
  { id: 'hair', label: '헤어', icon: hairIcon },
  { id: 'skin', label: '피부', icon: skinIcon },
  { id: 'makeup', label: '메이크업', icon: makeupIcon },
  { id: 'fashion', label: '패션', icon: fashionIcon },
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

  const handleSkip = () => {
    navigate('/');
  };

  const handleSubmit = () => {
    console.log('선택된 관심 분야:', selectedInterests);
    navigate('/');
  };

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Header */}
      <header className="app-header flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate(-1)}>
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
        </button>
        <button
          onClick={handleSkip}
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
              iconSrc={interest.icon}
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
