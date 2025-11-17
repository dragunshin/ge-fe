import checkIcon from '../../images/check.svg';

interface InterestCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function InterestCard({ label, isSelected, onClick }: InterestCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer"
    >
      {/* Card */}
      <div
        className={`relative flex items-center justify-center rounded-xl transition-all w-[109px] h-[109px] ${
          isSelected ? 'bg-[#429FF0] bg-opacity-30' : 'bg-[#C4C4C4] bg-opacity-60'
        }`}
      >
        {/* Check Icon - 선택 시에만 표시 */}
        {isSelected && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img src={checkIcon} alt="check" className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Label - 카드 하단 밖에 배치 */}
      <span className="mt-2 text-sm text-gray-600">
        {label}
      </span>
    </div>
  );
}
