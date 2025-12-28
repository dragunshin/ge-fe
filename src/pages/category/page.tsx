import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import searchIcon from '../../images/home/search.svg';
import heartIcon from '../../images/mypage/heart.svg';
import homeIcon from '../../images/home/home.svg';
import exploreIcon from '../../images/home/search.svg';
import chatIcon from '../../images/home/chat.svg';
import communityIcon from '../../images/home/community.svg';
import mypageIcon from '../../images/home/mypage.svg';

type TopExpert = {
  id: number;
  name: string;
  category: string;
  summary: string;
  avatar?: string;
};

type ExpertCard = {
  id: number;
  name: string;
  category: string;
  summary: string;
  avatar?: string;
  available: boolean;
};

const CategoryLandingPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const categoryKey = params.category ?? 'hair';

  const categoryLabel = useMemo(() => {
    const map: Record<string, string> = {
      hair: 'HAIR',
      fashion: 'FASHION',
      makeup: 'MAKEUP',
      skin: 'SKIN',
    };
    return map[categoryKey] ?? 'HAIR';
  }, [categoryKey]);

  const topExperts: TopExpert[] = [
    {
      id: 1,
      name: '김이슬 전문가',
      category: '헤어',
      summary:
        '바쁜 아침, 트렌디한 머리와 간편한 손질법을 여러분께 선물합니다.',
    },
    {
      id: 2,
      name: '박규영 전문가',
      category: '헤어',
      summary:
        '짧은 머리부터 긴머리까지 남자머리의 정석, 오래 유지되는 디자인으로 얼굴형에 어울리는 맞춤형으로 디자인 해드리겠습니다.',
    },
    {
      id: 3,
      name: '이민준 전문가',
      category: '헤어',
      summary: '어울리는 머리가 뭔지 몰라서 고민이신 분들! 제가 인생머리 찾아드릴게요',
    },
  ];

  const expertList: ExpertCard[] = [
    {
      id: 1,
      name: '이가영',
      category: '헤어',
      summary:
        '고객님의 두상 유형을 정확히 파악하고 얼굴형에 맞게 디자인해서 스타일링해드립니다.',
      available: true,
    },
    {
      id: 2,
      name: '이지훈',
      category: '헤어',
      summary:
        '각 모질에 따른 손상도와 얼굴형 두상에 맞춰 1대1로 정성껏 디자인해 드리고 있습니다.',
      available: true,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex h-[60px] items-center justify-between px-4 pt-[14px]">
        <button className="flex items-center gap-1 text-[18px] font-semibold text-[#0f0f10]">
          <span>{categoryLabel}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-[14px]">
          <button className="flex h-6 w-6 items-center justify-center">
            <img src={searchIcon} alt="검색" className="h-6 w-6" />
          </button>
          <button className="flex h-6 w-6 items-center justify-center">
            <img src={heartIcon} alt="찜" className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
        <section className="relative h-[246px] w-[375px] overflow-hidden">
          <div className="absolute left-[-25px] top-[-8px] h-[262px] w-[400px] bg-[#d2d4d8]" />
          <div className="absolute bottom-0 left-[-20px] h-[144.5px] w-[416px] bg-gradient-to-b from-transparent to-black/50" />
          <div className="absolute left-[19.5px] top-[125px] w-[165px] text-white">
            <p className="text-[12px] leading-[1.4]">이제 슬슬 준비해야지</p>
            <p className="mt-1 text-[18px] font-semibold leading-[1.35]">
              소개팅 필수 헤어스타일
              <br />‘스핀 스왈로브펌’
            </p>
            <div className="mt-3 inline-flex h-[22px] items-center gap-[4px] bg-[#008bff] px-[8px] py-[6px] text-[12px] font-semibold">
              <span>박서령</span>
              <span className="h-[7px] w-px bg-white/80" />
              <span className="text-[10px] font-medium">헤어디자이너</span>
            </div>
          </div>
          <div className="absolute right-[15px] top-[205px] flex h-[20px] w-[36px] items-center justify-center rounded-[37px] bg-black/50 text-[12px] text-white">
            1/12
          </div>
        </section>

        <section className="px-4 pt-[28px]">
          <h2 className="text-[18px] font-semibold text-[#0f0f10]">
            지금 가장 인기있는 헤어 전문가 TOP3
          </h2>
          <div className="mt-[16px] space-y-[16px]">
            {topExperts.map((expert, index) => (
              <div key={expert.id} className="flex h-[67px] w-[342px] items-center justify-between">
                <div className="flex items-center gap-[9px]">
                  <span className="w-[12px] text-center text-[18px] font-semibold leading-[1.1] text-[#656870]">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-[15px]">
                    <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
                      {expert.avatar && (
                        <img src={expert.avatar} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-[8px]">
                        <span className="rounded-[2px] bg-[#e5f4ff] px-[8px] py-[4px] text-[12px] text-[#008bff]">
                          {expert.category}
                        </span>
                        <span className="text-[14px] font-semibold text-[#292a2d]">
                          {expert.name}
                        </span>
                      </div>
                      <p className="mt-[6px] line-clamp-2 w-[184px] text-[13px] text-[#878a93]">
                        {expert.summary}
                      </p>
                    </div>
                  </div>
                </div>
                <button className="flex h-6 w-6 items-center justify-center">
                  <img src={heartIcon} alt="찜" className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-[32px] bg-[#f4f8fb]">
          <div className="px-4 py-[32px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0f0f10]">베스트 후기</h2>
              <button
                onClick={() => navigate(`/category/${categoryKey}/reviews`)}
                className="flex items-center gap-[2px] text-[14px] text-[#70737c]"
              >
                전체보기
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-[16px] h-[270px] w-[342px] rounded-[12px] border border-[#dbdcdf] bg-white">
              <div className="flex items-center justify-between px-[20px] pt-[19px]">
                <div className="flex items-center gap-[12px]">
                  <div className="h-[34px] w-[34px] shrink-0 rounded-full bg-[#e1e2e4]" />
                  <div className="flex flex-col gap-[2px]">
                    <p className="text-[12px] font-medium text-[#008bff]">최근 후기 63건</p>
                    <div className="flex items-center gap-[8px] text-[13px] text-[#989ba2]">
                      <span className="text-[14px] font-semibold text-[#0f0f10]">
                        옹민호 상담사
                      </span>
                      <span className="text-[#ffb800]">★</span>
                      <span>4.7</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/experts/1')}
                  className="rounded-full p-1 text-[#aeb0b6] hover:bg-gray-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-[16px] h-px bg-[#e1e2e4]" />
              <div className="mt-[20px] flex gap-[4px] px-[20px]">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`best-image-${index}`}
                    className="relative h-[72px] w-[72px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                  >
                    {index === 3 && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[14px] font-medium text-white">
                        +16
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-[20px] px-[19px] text-[14px] leading-[1.5] text-[#505158]">
                저는 완전 악성곱슬이었는데요. 옹민호 상담사님 만나고 광명 찾았습니다. 어딜 가도 머리 곱슬기가 안
                빠졌는데 매직 시술 받았더니 2개월 지나도 아직도 직모처럼 뻣...
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center pb-[12px]">
            <div className="h-[3px] w-[55px] rounded-full bg-[#e1e2e4]">
              <div className="h-[3px] w-[18px] rounded-full bg-[#429ff0]" />
            </div>
          </div>
        </section>

        <section className="px-4 pt-[32px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#0f0f10]">전문가 리스트</h2>
            <button className="flex items-center gap-[2px] text-[14px] text-[#70737c]">
              전체보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-[16px] space-y-[16px]">
            {expertList.map((expert) => (
              <article
                key={expert.id}
                className="relative h-[184px] w-[342px] rounded-[12px] border border-[#dbdcdf] bg-white"
              >
                <div className="absolute left-[15px] top-[15px] flex w-[313px] items-start justify-between">
                  <div className="flex w-[289px] flex-col gap-[12px]">
                    <div className="flex items-center gap-[16px]">
                      <div className="h-[60px] w-[60px] shrink-0 rounded-full bg-[#e1e2e4]" />
                      <div className="flex w-[116px] flex-col gap-[10px]">
                        <p className="text-[16px] font-semibold leading-[1.1] text-[#292a2d]">
                          {expert.name}
                        </p>
                        <div className="flex items-center gap-[6px]">
                          <span className="rounded-[2px] bg-[#e5f4ff] px-[8px] py-[4px] text-[12px] text-[#008bff]">
                            {expert.category}
                          </span>
                          <span className="rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]">
                            모류교정
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[13px] leading-[1.4] text-[#878a93]">
                      {expert.summary}
                    </p>
                  </div>
                  <button className="flex h-[24px] w-[24px] items-center justify-center">
                    <img src={heartIcon} alt="찜" className="h-[24px] w-[24px]" />
                  </button>
                </div>
                {expert.available && (
                  <span className="absolute left-[15px] top-[151px] text-[13px] font-semibold text-[#008bff]">
                    바로 상담 가능
                  </span>
                )}
                <button className="absolute left-[240px] top-[135px] h-[32px] w-[84px] rounded-[4px] bg-[#171719] text-[14px] font-medium text-white">
                  상담 예약
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <nav className="flex h-[69px] items-center justify-between border-t border-[#f4f4f5] px-4 pb-[12px] pt-[12px]">
        <button
          onClick={() => navigate('/')}
          className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]"
        >
          <img src={homeIcon} alt="홈" className="h-6 w-6" />
          <span className="text-[12px]">홈</span>
        </button>
        <button className="flex flex-1 flex-col items-center gap-1 text-[#0f0f10]">
          <img src={exploreIcon} alt="탐색" className="h-6 w-6" />
          <span className="text-[12px] font-semibold">탐색</span>
        </button>
        <button
          onClick={() => navigate('/chat')}
          className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]"
        >
          <img src={chatIcon} alt="채팅" className="h-6 w-6" />
          <span className="text-[12px]">채팅</span>
        </button>
        <button className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]">
          <img src={communityIcon} alt="커뮤니티" className="h-6 w-6" />
          <span className="text-[12px]">커뮤니티</span>
        </button>
        <button className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]">
          <img src={mypageIcon} alt="마이페이지" className="h-6 w-6" />
          <span className="text-[12px]">마이페이지</span>
        </button>
      </nav>
    </div>
  );
};

export default CategoryLandingPage;
