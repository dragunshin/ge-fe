import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import heartIcon from '../../images/mypage/heart.svg';
import BottomNav from '@/components/navigation/bottom-nav';
import Logo from '@/components/ui/logo';
import starIcon from '../../images/reviews/star.svg';
import { expertService } from '../../services/expert.service';
import { reservationService } from '../../services/reservation.service';
import ConsultationMethodSheet from '../resevationFlow/reservationSheet/typeReservation';
import DateTimeBottomSheet from '../resevationFlow/reservationSheet/calendar';
import {
  getApiCategoryFromRoute,
  getLabelFromApiCategory,
  type ApiCategory,
} from '../../lib/utils/category';

const CATEGORY_TABS = [
  { key: 'hair', label: '헤어' },
  { key: 'makeup', label: '메이크업' },
  { key: 'fashion', label: '패션' },
  { key: 'skin', label: '스킨' },
];

const STYLE_TABS = ['컷', '펌', '염색', '스타일링'] as const;
const CONCERN_TABS = ['탈모', '헤어라인', '모질/모량', '두피상태'] as const;

const CUT_STYLE_OPTIONS = [
  '가일 컷',
  '크롭 컷',
  '포마드 컷',
  '투블럭 컷',
  '스포츠 컷',
  '아이비리그 컷',
  '가르마 컷',
  '페이드 컷',
  '리프 컷',
  '프렌치 크롭 컷',
];

const HAIR_CONCERN_OPTIONS = ['M자 탈모', '원형 탈모', '정수리 탈모', '복합형 탈모'];

const HAIR_STYLE_TAGS = CUT_STYLE_OPTIONS.map((item) => item.replace(/\s+/g, ''));
const HAIR_CONCERN_TAGS = ['탈모', ...HAIR_CONCERN_OPTIONS];

const OTHER_CATEGORY_TAGS: Record<ApiCategory, string[]> = {
  HAIR: [],
  FASHION: ['코디', '핏', '스타일링'],
  MAKEUP: ['윤곽', '톤업', '데일리'],
  SKIN: ['보습', '진정', '민감'],
};

type ExpertListCard = {
  id: number;
  name: string;
  rating: number;
  reviewCount: string;
  summary: string;
  avatar?: string;
  images: string[];
  tags: string[];
  reviewTags: string[];
  filterTags: string[];
};

type FilterTab = 'style' | 'concern';

type StyleTab = (typeof STYLE_TABS)[number];
type ConcernTab = (typeof CONCERN_TABS)[number];

type ConsultType = 'MESSAGE' | 'VIDEO';

const normalizeTag = (value: string) => value.replace(/\s+/g, '');

const pickTags = (items: string[], count: number, seed: number) => {
  if (items.length === 0) {
    return [];
  }
  const start = Math.abs(seed) % items.length;
  return Array.from({ length: count }).map((_, index) => items[(start + index) % items.length]);
};

const buildExpertTags = (
  categoryLabel: string,
  category: ApiCategory | undefined,
  seed: number,
) => {
  if (category === 'HAIR') {
    const styleTags = pickTags(HAIR_STYLE_TAGS, 2, seed);
    const concernTags = pickTags(HAIR_CONCERN_TAGS, 1, seed + 3);
    const filterTags = [...styleTags, ...concernTags];
    const displayTags = [categoryLabel, ...filterTags];
    const trimmedDisplayTags =
      displayTags.length > 4
        ? [...displayTags.slice(0, 3), `+${displayTags.length - 3}`]
        : displayTags;
    return { displayTags: trimmedDisplayTags, filterTags };
  }

  const otherTags = pickTags(OTHER_CATEGORY_TAGS[category ?? 'HAIR'], 2, seed);
  const displayTags = [categoryLabel, ...otherTags];
  return { displayTags, filterTags: otherTags };
};

const filterExperts = (
  experts: ExpertListCard[],
  styles: string[],
  concerns: string[],
  category: ApiCategory | undefined,
) => {
  if (category !== 'HAIR') {
    return experts;
  }
  const hasStyle = styles.length > 0;
  const hasConcern = concerns.length > 0;
  if (!hasStyle && !hasConcern) {
    return experts;
  }
  const normalizedStyles = styles.map(normalizeTag);
  const normalizedConcerns = concerns.map(normalizeTag);

  return experts.filter((expert) => {
    const normalizedTags = expert.filterTags.map(normalizeTag);
    const styleMatch =
      !hasStyle || normalizedStyles.some((style) => normalizedTags.includes(style));
    const concernMatch =
      !hasConcern || normalizedConcerns.some((concern) => normalizedTags.includes(concern));
    return styleMatch && concernMatch;
  });
};

const CategoryLandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryKey = useMemo(() => {
    const query = new URLSearchParams(location.search);
    const value = query.get('category') ?? 'hair';
    return CATEGORY_TABS.some((tab) => tab.key === value) ? value : 'hair';
  }, [location.search]);
  const apiCategory = getApiCategoryFromRoute(categoryKey);
  const categoryLabel = getLabelFromApiCategory(apiCategory);

  const [experts, setExperts] = useState<ExpertListCard[]>([]);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('style');
  const [activeStyleTab, setActiveStyleTab] = useState<StyleTab>('컷');
  const [activeConcernTab, setActiveConcernTab] = useState<ConcernTab>('탈모');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [draftStyles, setDraftStyles] = useState<string[]>([]);
  const [draftConcerns, setDraftConcerns] = useState<string[]>([]);
  const [openTypeSheet, setOpenTypeSheet] = useState(false);
  const [openCalendarSheet, setOpenCalendarSheet] = useState(false);
  const [selectedConsultType, setSelectedConsultType] =
    useState<ConsultType>('MESSAGE');
  // 예약 시작 시 선택한 전문가 저장
  const [selectedReservationExpertId, setSelectedReservationExpertId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    let isActive = true;

    const fetchExperts = async () => {
      try {
        const response = await expertService.getExpertList({
          category: apiCategory,
          page: 0,
          size: 50,
        });
        if (!isActive) {
          return;
        }
        const mapped = response.data.map((expert, index) => {
          const label = getLabelFromApiCategory(expert.category) || categoryLabel || '전문가';
          const tags = buildExpertTags(label, apiCategory, expert.expertId ?? index + 1);
          const images = (expert.representativeReviewImages ?? []).filter(Boolean);
          const reviewTagsSource = tags.filterTags.length > 0 ? tags.filterTags : [label];
          const reviewTags = reviewTagsSource.slice(0, Math.max(1, images.length));
          return {
            id: expert.expertId,
            name: expert.nickname,
            rating: Number(expert.ratingAverage?.toFixed?.(1) ?? expert.ratingAverage ?? 0),
            reviewCount: `(${expert.reviewCount?.toLocaleString?.() ?? expert.reviewCount ?? 0})`,
            summary: expert.introduction,
            avatar: expert.profileImage,
            images,
            tags: tags.displayTags,
            reviewTags,
            filterTags: tags.filterTags,
          };
        });
        setExperts(mapped);
      } catch (error) {
        console.error('Failed to fetch category experts:', error);
      }
    };

    fetchExperts();

    return () => {
      isActive = false;
    };
  }, [apiCategory, categoryLabel]);

  useEffect(() => {
    setSelectedStyles([]);
    setSelectedConcerns([]);
    setDraftStyles([]);
    setDraftConcerns([]);
  }, [apiCategory]);

  useEffect(() => {
    if (!noticeMessage) {
      return;
    }
    const timer = window.setTimeout(() => setNoticeMessage(null), 2000);
    return () => window.clearTimeout(timer);
  }, [noticeMessage]);

  const filteredExperts = useMemo(
    () => filterExperts(experts, selectedStyles, selectedConcerns, apiCategory),
    [experts, selectedStyles, selectedConcerns, apiCategory],
  );

  const draftFilteredCount = useMemo(
    () => filterExperts(experts, draftStyles, draftConcerns, apiCategory).length,
    [experts, draftStyles, draftConcerns, apiCategory],
  );
  const isApplyDisabled = draftStyles.length === 0 && draftConcerns.length === 0;

  const openFilterSheet = (tab: FilterTab) => {
    setDraftStyles(selectedStyles);
    setDraftConcerns(selectedConcerns);
    setActiveFilterTab(tab);
    setIsFilterOpen(true);
  };

  const closeFilterSheet = () => {
    setIsFilterOpen(false);
  };

  const getReservationRoute = () => {
    if (categoryKey === 'fashion') {
      return '/reservation/fashion';
    }
    return '/hair/setup';
  };

  // timeId를 예약 날짜/시간 ISO로 변환
  const buildScheduledDateTime = (date: Date, timeId: string) => {
    const parsed = /^t-(\d{2})(\d{2})$/.exec(timeId);
    const hour24 = parsed ? Number(parsed[1]) : 0;
    const minute = parsed ? Number(parsed[2]) : 0;
    const value = new Date(date);
    value.setHours(hour24, minute, 0, 0);
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const hour = String(value.getHours()).padStart(2, "0");
    const minuteStr = String(value.getMinutes()).padStart(2, "0");
    const second = String(value.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minuteStr}:${second}`;
  };

  // 패션 예약 임시 생성 후 reservationId 전달
  const handleTempReservation = async (date: Date, timeId: string) => {
    if (categoryKey !== 'fashion' && categoryKey !== 'hair') return null;
    if (!selectedReservationExpertId) {
      window.alert('전문가 정보가 없습니다. 다시 시도해주세요.');
      return null;
    }

    const consultationType = selectedConsultType;
    const schedulesResponse = await expertService.getExpertSchedules(
      selectedReservationExpertId,
    );
    const schedules = Array.isArray(schedulesResponse.data) ? schedulesResponse.data : [];
    const matched = schedules.find(
      (schedule) => schedule.consultationType === consultationType,
    );
    if (!matched) {
      window.alert('상담 가격 정보를 찾을 수 없습니다. 다시 시도해주세요.');
      return null;
    }
    const price = matched.price;
    // 카테고리별 임시 예약 생성
    const category = categoryKey === 'fashion' ? 'FASHION' : 'HAIR';

    const response = await reservationService.createTempReservation({
      expertId: selectedReservationExpertId,
      category,
      consultationType,
      // MESSAGE는 scheduledDateTime을 null로 전송
      scheduledDateTime:
        consultationType === 'VIDEO' ? buildScheduledDateTime(date, timeId) : null,
      price,
    });

    return response.data.reservationId;
  };

  const formatScheduleLabel = (date: Date, timeId: string) => {
    const parsed = /^t-(\d{2})(\d{2})$/.exec(timeId);
    const hour24 = parsed ? Number(parsed[1]) : 0;
    const minute = parsed ? Number(parsed[2]) : 0;
    const isAM = hour24 < 12;
    const meridiem = isAM ? '오전' : '오후';
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    const mm = String(minute).padStart(2, '0');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일 ${meridiem} ${hour12}:${mm}`;
  };

  const applyFilters = () => {
    setSelectedStyles(draftStyles);
    setSelectedConcerns(draftConcerns);
    setIsFilterOpen(false);
  };

  const toggleDraftStyle = (label: string) => {
    setDraftStyles((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const toggleDraftConcern = (label: string) => {
    setDraftConcerns((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const removeFilterChip = (label: string) => {
    if (selectedStyles.includes(label)) {
      setSelectedStyles((prev) => prev.filter((item) => item !== label));
      return;
    }
    setSelectedConcerns((prev) => prev.filter((item) => item !== label));
  };

  const activeChips = [...selectedStyles, ...selectedConcerns];

  return (
    <div className="relative flex h-full flex-col bg-white">
      <header className="flex h-[56px] items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-4">
          <button className="flex h-6 w-6 items-center justify-center">
            <Search className="h-6 w-6 text-[#0f0f10]" />
          </button>
          <button className="flex h-6 w-6 items-center justify-center">
            <img src={heartIcon} alt="찜" className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <section className="bg-white px-4">
          <div className="flex items-center justify-between text-[16px] font-semibold">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.key === 'makeup' || tab.key === 'skin') {
                    setNoticeMessage('준비중입니다.');
                    return;
                  }
                  navigate(`/explore?category=${tab.key}`);
                }}
                className={`pb-[8px] ${
                  tab.key === categoryKey ? 'text-[#0f0f10]' : 'text-[#989ba2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative h-px bg-[#e1e2e4]">
            <span
              className="absolute bottom-0 h-[2px] w-[24px] bg-[#0f0f10]"
              style={{
                left: `${Math.max(
                  0,
                  CATEGORY_TABS.findIndex((tab) => tab.key === categoryKey),
                ) * 88}px`,
              }}
            />
          </div>
        </section>

        <section className="mt-[14px] px-4">
          <div className="flex flex-wrap items-center gap-[8px]">
            <button
              onClick={() => openFilterSheet('style')}
              className="flex h-[30px] items-center gap-[4px] rounded-[4px] border border-[#dbdcdf] bg-white px-[12px] text-[13px] text-[#46474c]"
            >
              스타일
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              onClick={() => openFilterSheet('concern')}
              className="flex h-[30px] items-center gap-[4px] rounded-[4px] border border-[#dbdcdf] bg-white px-[12px] text-[13px] text-[#46474c]"
            >
              고민
              <ChevronDown className="h-4 w-4" />
            </button>
            {activeChips.map((chip) => (
              <button
                key={chip}
                onClick={() => removeFilterChip(chip)}
                className="flex h-[30px] items-center gap-[4px] rounded-[4px] bg-[#333438] px-[12px] text-[13px] text-white"
              >
                {chip}
                <X className="h-4 w-4" />
              </button>
            ))}
          </div>
          <div className="mt-[12px] flex items-center justify-between text-[13px] text-[#46474c]">
            <span>전체 {filteredExperts.length.toLocaleString()}명</span>
            <button className="flex items-center gap-[2px]">
              추천순
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-[16px] px-4 pb-[16px]">
          <div className="space-y-[16px]">
            {filteredExperts.map((expert) => (
              <article
                key={expert.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/experts/${expert.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/experts/${expert.id}`);
                  }
                }}
                className="w-full min-h-[251px] cursor-pointer rounded-[8px] bg-white px-[12px] py-[20px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.13)]"
              >
                <div className="flex flex-col gap-[14px]">
                  <div className="flex items-start justify-between gap-[8px]">
                    <div className="min-w-0 flex items-center gap-[9px]">
                      <div className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
                        {expert.avatar && (
                          <img src={expert.avatar} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex flex-col gap-[6px] text-left">
                        <p className="text-[16px] font-semibold leading-[1.1] text-[#292a2d]">
                          {expert.name}
                        </p>
                        <p className="line-clamp-1 text-[13px] text-[#878a93]">
                          {expert.summary}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-[6px] text-[13px] text-[#878a93]">
                      <div className="flex items-center gap-[2px]">
                        <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
                        <span className="font-semibold text-[#505158]">{expert.rating}</span>
                      </div>
                      <span className="whitespace-nowrap">{expert.reviewCount}</span>
                    </div>
                  </div>
                  <div className="flex gap-[2px]">
                    {Array.from({ length: 3 }).map((_, index) => {
                      const image = expert.images[index];
                      const tag = expert.reviewTags[index];
                      return (
                        <div
                          key={`${expert.id}-review-${index}`}
                          className="relative h-[105px] w-[105px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                        >
                          {image && <img src={image} alt="" className="h-full w-full object-cover" />}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                          {tag && (
                            <span className="absolute bottom-[27px] left-[10px] text-[12px] text-white">
                              {tag}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-[6px]">
                      {expert.tags.map((tag, index) => (
                        <span
                          key={`${expert.id}-tag-${tag}-${index}`}
                          className={
                            tag === categoryLabel
                              ? 'rounded-[2px] bg-[#f5f9fd] px-[6px] py-[4px] text-[12px] text-[#429ff0]'
                              : 'rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]'
                          }
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      className="h-[36px] w-[95px] rounded-[4px] bg-[#171719] text-[14px] font-medium text-white"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (categoryKey !== 'hair' && categoryKey !== 'fashion') {
                          setNoticeMessage('해당 카테고리는 상담 예약이 준비 중입니다.');
                          return;
                        }
                        // 선택한 전문가 ID 저장
                        setSelectedReservationExpertId(expert.id);
                        setOpenTypeSheet(true);
                      }}
                    >
                      상담 예약
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {noticeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="rounded-[999px] bg-[#171719] px-[16px] py-[10px] text-[13px] font-medium text-white shadow-[0px_6px_20px_rgba(0,0,0,0.2)]">
            {noticeMessage}
          </div>
        </div>
      )}

      {isFilterOpen && (
        <div className="absolute inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={closeFilterSheet}
            aria-label="필터 닫기"
          />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-[8px] bg-white px-[17px] pb-[16px] pt-[18px]">
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-semibold text-[#292a2d]">필터</p>
              <button onClick={closeFilterSheet} aria-label="닫기">
                <X className="h-6 w-6 text-[#0f0f10]" />
              </button>
            </div>
            <div className="mt-[22px] flex items-center gap-[20px]">
              <button
                onClick={() => setActiveFilterTab('style')}
                className="flex flex-col items-center gap-[6px]"
              >
                <div className="flex items-center gap-[4px] text-[14px] font-semibold">
                  <span className={activeFilterTab === 'style' ? 'text-[#171719]' : 'text-[#989ba2]'}>
                    스타일
                  </span>
                  {draftStyles.length > 0 && (
                    <span
                      className={activeFilterTab === 'style' ? 'text-[#171719]' : 'text-[#989ba2]'}
                    >
                      {draftStyles.length}
                    </span>
                  )}
                </div>
                <span
                  className={`h-[2px] w-full ${
                    activeFilterTab === 'style' ? 'bg-[#292a2d]' : 'bg-transparent'
                  }`}
                />
              </button>
              <button
                onClick={() => setActiveFilterTab('concern')}
                className="flex flex-col items-center gap-[6px]"
              >
                <div className="flex items-center gap-[4px] text-[14px] font-semibold">
                  <span
                    className={activeFilterTab === 'concern' ? 'text-[#171719]' : 'text-[#989ba2]'}
                  >
                    고민
                  </span>
                  {draftConcerns.length > 0 && (
                    <span
                      className={
                        activeFilterTab === 'concern' ? 'text-[#171719]' : 'text-[#989ba2]'
                      }
                    >
                      {draftConcerns.length}
                    </span>
                  )}
                </div>
                <span
                  className={`h-[2px] w-full ${
                    activeFilterTab === 'concern' ? 'bg-[#292a2d]' : 'bg-transparent'
                  }`}
                />
              </button>
            </div>

            <div className="mt-[20px] border-b border-[#f1f1f6] pb-[12px]">
              <div className="flex items-center gap-[16px] text-[14px]">
                {activeFilterTab === 'style'
                  ? STYLE_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          if (tab !== '컷') {
                            setNoticeMessage('준비중입니다.');
                            return;
                          }
                          setActiveStyleTab(tab);
                        }}
                        className={
                          tab === activeStyleTab
                            ? 'font-semibold text-[#0f0f10]'
                            : 'font-medium text-[#989ba2]'
                        }
                      >
                        {tab}
                      </button>
                    ))
                  : CONCERN_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          if (tab !== '탈모') {
                            setNoticeMessage('준비중입니다.');
                            return;
                          }
                          setActiveConcernTab(tab);
                        }}
                        className={
                          tab === activeConcernTab
                            ? 'font-semibold text-[#0f0f10]'
                            : 'font-medium text-[#989ba2]'
                        }
                      >
                        {tab}
                      </button>
                    ))}
              </div>
            </div>

            <div className="mt-[16px] grid grid-cols-2 gap-x-[28px] gap-y-[12px]">
              {(activeFilterTab === 'style' ? CUT_STYLE_OPTIONS : HAIR_CONCERN_OPTIONS).map(
                (item) => {
                  const selected =
                    activeFilterTab === 'style'
                      ? draftStyles.includes(item)
                      : draftConcerns.includes(item);
                  const toggle =
                    activeFilterTab === 'style'
                      ? () => toggleDraftStyle(item)
                      : () => toggleDraftConcern(item);
                  return (
                    <button
                      key={item}
                      className="flex items-center gap-[7px] text-[14px]"
                      onClick={toggle}
                    >
                      <span
                        className={`flex h-[12px] w-[12px] items-center justify-center rounded-[2px] border ${
                          selected
                            ? 'border-[#0f0f10] bg-[#0f0f10]'
                            : 'border-[#dbdcdf] bg-white'
                        }`}
                      >
                        {selected && <Check className="h-[10px] w-[10px] text-white" />}
                      </span>
                      <span className={selected ? 'text-[#0f0f10]' : 'text-[#989ba2]'}>
                        {item}
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            <div className="mt-[24px]">
              <button
                onClick={applyFilters}
                className={`h-[48px] w-full rounded-[4px] text-[16px] font-medium text-white ${
                  isApplyDisabled ? 'bg-[#aeb0b6]' : 'bg-[#0f0f10]'
                }`}
              >
                {draftFilteredCount.toLocaleString()}명의 전문가
              </button>
            </div>
          </div>
        </div>
      )}

      {!isFilterOpen && <BottomNav />}

      <ConsultationMethodSheet
        open={openTypeSheet}
        onClose={() => setOpenTypeSheet(false)}
        defaultValue={selectedConsultType}
        onNext={(selected) => {
          setSelectedConsultType(selected);
          sessionStorage.setItem('consult_type', selected);
          setOpenTypeSheet(false);
          setOpenCalendarSheet(true);
        }}
      />

      <DateTimeBottomSheet
        open={openCalendarSheet}
        onClose={() => setOpenCalendarSheet(false)}
        onNext={async ({ date, timeId }) => {
          sessionStorage.setItem('consult_schedule_label', formatScheduleLabel(date, timeId));
          setOpenCalendarSheet(false);
          // 패션 예약 임시 생성 후 reservationId 전달
          if (categoryKey === 'fashion' || categoryKey === 'hair') {
            const reservationId = await handleTempReservation(date, timeId);
            if (reservationId) {
              navigate(`${getReservationRoute()}?reservationId=${reservationId}`);
              return;
            }
          }
          navigate(getReservationRoute());
        }}
      />
    </div>
  );
};

export default CategoryLandingPage;
