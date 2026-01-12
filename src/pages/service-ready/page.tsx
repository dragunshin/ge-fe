import { useNavigate } from "react-router-dom";

const serviceReadyImage = "http://localhost:3845/assets/a124dd9f5fe9e7971a92695a78ff9d952d9c7fc0.png";

export default function ServiceReadyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto flex min-h-full flex-col items-center gap-[48px] pt-[173px]">
        <div className="flex flex-col items-center gap-[40px]">
          <div className="h-[183px] w-[180px] overflow-hidden rounded-[38px] bg-[#ededed]">
            <img
              src={serviceReadyImage}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center gap-[6px] text-center">
            <p className="text-[18px] font-semibold leading-[1.4] text-[#181818]">
              서비스 준비 중
            </p>
            <p className="text-[14px] font-medium leading-[1.4] text-[#aeb0b6]">
              이용에 불편을 드려 죄송합니다.
              <br />
              빠른 시일 내에 준비하여 찾아뵙겠습니다.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex h-[40px] w-[175px] items-center justify-center rounded-[4px] bg-[#181818] text-[16px] font-semibold leading-[1.4] text-white"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
}
