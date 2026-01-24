import checkIcon from '../../images/check.svg';

interface InterestCardProps {
  label: string;
  iconSrc: string;
  isSelected: boolean;
  onClick: () => void;
}

export function InterestCard({ label, iconSrc, isSelected, onClick }: InterestCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer"
    >
      {/* Card */}
      <div
        className={`relative flex items-center justify-center rounded-[6px] transition-all w-[82px] h-[82px] ${
          isSelected ? 'bg-[#f1f1f6]' : 'bg-white'
        }`}
      >
        <img
          src={iconSrc}
          alt=""
          className="absolute left-1/2 top-1/2 h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2"
        />
        {isSelected && (
          <div
            className="absolute rounded-[6px] bg-[#429ff0]/30"
            style={{ left: -1, top: -1, width: 82, height: 82 }}
          />
        )}
        {/* Check Icon - 선택 시에만 표시 */}
        {isSelected && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img src={checkIcon} alt="check" className="h-[18px] w-[18px]" />
          </div>
        )}
      </div>

      {/* Label - 카드 하단 밖에 배치 */}
      <span className="mt-2 text-[14px] leading-[1.5] text-[#70737c]">
        {label}
      </span>
    </div>
  );
}
