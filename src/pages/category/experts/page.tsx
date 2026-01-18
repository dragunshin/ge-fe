import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronDown, ChevronLeft, X } from "lucide-react";
import ExpertListCard, { type ExpertListCardData } from "@/components/expert/expert-list-card";
import ConsultationMethodSheet from "@/pages/resevationFlow/reservationSheet/typeReservation";
import DateTimeBottomSheet from "@/pages/resevationFlow/reservationSheet/calendar";
import { expertService } from "@/services/expert.service";
import { reservationService } from "@/services/reservation.service";
import { getApiCategoryFromRoute, getLabelFromApiCategory, type ApiCategory } from "@/lib/utils/category";
import { useAuthStore } from "@/stores/useAuthStore";

const CUT_STYLE_OPTIONS = [
  "가일 컷",
  "크롭 컷",
  "포마드 컷",
  "투블럭 컷",
  "스포츠 컷",
  "아이비리그 컷",
  "가르마 컷",
  "페이드 컷",
  "리프 컷",
  "프렌치 크롭 컷",
];

const STYLE_TABS = ["컷", "펌", "염색", "스타일링"] as const;
const CONCERN_TABS = ["탈모", "헤어라인", "모질/모량", "두피상태"] as const;
const HAIR_CONCERN_OPTIONS = ["M자 탈모", "원형 탈모", "정수리 탈모", "복합형 탈모"];

const HAIR_STYLE_TAGS = CUT_STYLE_OPTIONS.map((item) => item.replace(/\s+/g, ""));
const HAIR_CONCERN_TAGS = ["탈모", ...HAIR_CONCERN_OPTIONS];

const OTHER_CATEGORY_TAGS: Record<ApiCategory, string[]> = {
  HAIR: [],
  FASHION: ["코디", "핏", "스타일링"],
  MAKEUP: ["윤곽", "톤업", "데일리"],
  SKIN: ["보습", "진정", "민감"],
};

type ExpertListItem = ExpertListCardData & {
  filterTags: string[];
};

type FilterTab = "style" | "concern";
type StyleTab = (typeof STYLE_TABS)[number];
type ConcernTab = (typeof CONCERN_TABS)[number];
type ConsultType = "MESSAGE" | "VIDEO";

const normalizeTag = (value: string) => value.replace(/\s+/g, "");

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
  if (category === "HAIR") {
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

  const otherTags = pickTags(OTHER_CATEGORY_TAGS[category ?? "HAIR"], 2, seed);
  const displayTags = [categoryLabel, ...otherTags];
  return { displayTags, filterTags: otherTags };
};

const filterExperts = (
  experts: ExpertListItem[],
  styles: string[],
  concerns: string[],
  category: ApiCategory | undefined,
) => {
  if (category !== "HAIR") {
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
    const matchesStyle = !hasStyle || normalizedStyles.some((tag) => normalizedTags.includes(tag));
    const matchesConcern =
      !hasConcern || normalizedConcerns.some((tag) => normalizedTags.includes(tag));
    return matchesStyle && matchesConcern;
  });
};

export default function CategoryExpertListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const categoryKey = params.category ?? "hair";
  const apiCategory = getApiCategoryFromRoute(categoryKey);
  const categoryLabel = useMemo(
    () => getLabelFromApiCategory(apiCategory) || "전문가",
    [apiCategory],
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [experts, setExperts] = useState<ExpertListItem[]>([]);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>("style");
  const [activeStyleTab, setActiveStyleTab] = useState<StyleTab>("컷");
  const [activeConcernTab, setActiveConcernTab] = useState<ConcernTab>("탈모");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [draftStyles, setDraftStyles] = useState<string[]>([]);
  const [draftConcerns, setDraftConcerns] = useState<string[]>([]);
  const [openTypeSheet, setOpenTypeSheet] = useState(false);
  const [openCalendarSheet, setOpenCalendarSheet] = useState(false);
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultType>("MESSAGE");
  const [selectedReservationExpertId, setSelectedReservationExpertId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const state = location.state as { openCalendarSheet?: boolean } | null;
    if (state?.openCalendarSheet) {
      setOpenCalendarSheet(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

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
          const label = getLabelFromApiCategory(expert.category) || categoryLabel;
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
        console.error("Failed to fetch experts:", error);
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
    if (categoryKey === "fashion") {
      return "/reservation/fashion";
    }
    if (categoryKey !== "hair") {
      return "/service-ready";
    }
    return "/hair/setup";
  };

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

  const handleTempReservation = async (date: Date, timeId: string) => {
    if (categoryKey !== "fashion" && categoryKey !== "hair") return null;
    if (!selectedReservationExpertId) {
      window.alert("전문가 정보가 없습니다. 다시 시도해주세요.");
      return null;
    }

    const consultationType = selectedConsultType;
    const schedulesResponse = await expertService.getExpertSchedules(selectedReservationExpertId);
    const schedules = Array.isArray(schedulesResponse.data) ? schedulesResponse.data : [];
    const matched = schedules.find((schedule) => schedule.consultationType === consultationType);
    if (!matched) {
      window.alert("상담 가격 정보를 찾을 수 없습니다. 다시 시도해주세요.");
      return null;
    }
    const price = matched.price;
    const category = categoryKey === "fashion" ? "FASHION" : "HAIR";
    const selectedExpert = experts.find((expert) => expert.id === selectedReservationExpertId);
    sessionStorage.setItem("consult_expert_name", selectedExpert?.name ?? "전문가");
    sessionStorage.setItem("consult_category_label", categoryLabel);
    sessionStorage.setItem("consult_price", String(price));
    sessionStorage.setItem("consult_expert_id", String(selectedReservationExpertId));

    const response = await reservationService.createTempReservation({
      expertId: selectedReservationExpertId,
      category,
      consultationType,
      scheduledDateTime: consultationType === "VIDEO" ? buildScheduledDateTime(date, timeId) : null,
      price,
    });

    sessionStorage.setItem("consult_reservation_id", String(response.data.reservationId));
    return response.data.reservationId;
  };

  const formatScheduleLabel = (date: Date, timeId: string) => {
    const parsed = /^t-(\d{2})(\d{2})$/.exec(timeId);
    const hour24 = parsed ? Number(parsed[1]) : 0;
    const minute = parsed ? Number(parsed[2]) : 0;
    const isAM = hour24 < 12;
    const meridiem = isAM ? "오전" : "오후";
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    const mm = String(minute).padStart(2, "0");
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

  const handleReservationSchedule = (expertId: number) => {
    if (categoryKey !== "hair" && categoryKey !== "fashion") {
      setNoticeMessage("해당 카테고리는 상담 예약이 준비 중입니다.");
      return;
    }
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    setSelectedReservationExpertId(expertId);
    setOpenTypeSheet(true);
  };

  const activeChips = [...selectedStyles, ...selectedConcerns];

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="app-header flex h-[56px] items-center gap-[15px] px-4">
        <button onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft className="h-[24px] w-[24px]" />
        </button>
        <h1 className="text-[20px] font-semibold leading-[1.4] text-[#0f0f10]">
          전문가 리스트
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
        <section className="px-4 pt-[12px]">
          <div className="flex gap-[8px]">
            <button
              type="button"
              onClick={() => openFilterSheet("style")}
              className="flex h-[32px] items-center gap-[2px] rounded-[4px] border border-[#dbdcdf] bg-white px-[12px] text-[13px] text-[#46474c]"
            >
              스타일
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => openFilterSheet("concern")}
              className="flex h-[32px] items-center gap-[2px] rounded-[4px] border border-[#dbdcdf] bg-white px-[12px] text-[13px] text-[#46474c]"
            >
              고민
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {activeChips.length > 0 && (
            <div className="mt-[12px] flex flex-wrap items-center gap-[8px]">
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
          )}

          <div className="mt-[12px] flex items-center justify-between text-[13px] text-[#46474c]">
            <span>전체 {filteredExperts.length.toLocaleString()}명</span>
            <button type="button" className="flex items-center gap-[2px]">
              최신순
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-[16px] px-4 pb-[16px]">
          <div className="space-y-[16px]">
            {filteredExperts.map((expert) => (
              <ExpertListCard
                key={expert.id}
                expert={expert}
                categoryLabel={categoryLabel}
                onClick={(expertId) => navigate(`/experts/${expertId}`)}
                onReserve={(expertId) => handleReservationSchedule(expertId)}
              />
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
        <div className="fixed inset-0 z-50 bg-black/20">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-[16px] bg-white px-4 pt-4 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-semibold">필터</span>
              <button onClick={closeFilterSheet} aria-label="닫기">
                <X className="h-5 w-5 text-[#0f0f10]" />
              </button>
            </div>

            <div className="mt-[16px] flex items-center gap-[20px]">
              <button
                onClick={() => setActiveFilterTab("style")}
                className={`flex flex-col items-center gap-[6px] ${
                  activeFilterTab === "style" ? "text-[#171719]" : "text-[#989ba2]"
                }`}
              >
                <span className="text-[14px] font-semibold">스타일</span>
                <span
                  className={`h-[2px] w-[36px] ${
                    activeFilterTab === "style" ? "bg-[#292a2d]" : "bg-transparent"
                  }`}
                />
              </button>
              <button
                onClick={() => setActiveFilterTab("concern")}
                className={`flex flex-col items-center gap-[6px] ${
                  activeFilterTab === "concern" ? "text-[#171719]" : "text-[#989ba2]"
                }`}
              >
                <span className="text-[14px] font-semibold">고민</span>
                <span
                  className={`h-[2px] w-[36px] ${
                    activeFilterTab === "concern" ? "bg-[#292a2d]" : "bg-transparent"
                  }`}
                />
              </button>
            </div>

            <div className="mt-[20px] border-b border-[#f1f1f6] pb-[12px]">
              <div className="flex items-center gap-[16px] text-[14px]">
                {activeFilterTab === "style"
                  ? STYLE_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          if (tab !== "컷") {
                            setNoticeMessage("준비중입니다.");
                            return;
                          }
                          setActiveStyleTab(tab);
                        }}
                        className={
                          tab === activeStyleTab
                            ? "font-semibold text-[#0f0f10]"
                            : "font-medium text-[#989ba2]"
                        }
                      >
                        {tab}
                      </button>
                    ))
                  : CONCERN_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          if (tab !== "탈모") {
                            setNoticeMessage("준비중입니다.");
                            return;
                          }
                          setActiveConcernTab(tab);
                        }}
                        className={
                          tab === activeConcernTab
                            ? "font-semibold text-[#0f0f10]"
                            : "font-medium text-[#989ba2]"
                        }
                      >
                        {tab}
                      </button>
                    ))}
              </div>
            </div>

            <div className="mt-[16px] grid grid-cols-2 gap-x-[28px] gap-y-[12px]">
              {(activeFilterTab === "style" ? CUT_STYLE_OPTIONS : HAIR_CONCERN_OPTIONS).map(
                (item) => {
                  const selected =
                    activeFilterTab === "style"
                      ? draftStyles.includes(item)
                      : draftConcerns.includes(item);
                  const toggle =
                    activeFilterTab === "style"
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
                          selected ? "border-[#0f0f10] bg-[#0f0f10]" : "border-[#dbdcdf] bg-white"
                        }`}
                      >
                        {selected && <Check className="h-[10px] w-[10px] text-white" />}
                      </span>
                      <span className={selected ? "text-[#0f0f10]" : "text-[#989ba2]"}>
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
                  isApplyDisabled ? "bg-[#aeb0b6]" : "bg-[#0f0f10]"
                }`}
              >
                {draftFilteredCount.toLocaleString()}명의 전문가
              </button>
            </div>
          </div>
        </div>
      )}

      <ConsultationMethodSheet
        open={openTypeSheet}
        onClose={() => setOpenTypeSheet(false)}
        defaultValue={selectedConsultType}
        onNext={(selected) => {
          setSelectedConsultType(selected);
          sessionStorage.setItem("consult_type", selected);
          setOpenTypeSheet(false);
          setOpenCalendarSheet(true);
        }}
      />

      <DateTimeBottomSheet
        open={openCalendarSheet}
        onClose={() => setOpenCalendarSheet(false)}
        onNext={async ({ date, timeId }) => {
          sessionStorage.setItem("consult_schedule_label", formatScheduleLabel(date, timeId));
          setOpenCalendarSheet(false);
          sessionStorage.setItem("consult_return_path", `${location.pathname}${location.search}`);
          if (categoryKey === "fashion" || categoryKey === "hair") {
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
}
