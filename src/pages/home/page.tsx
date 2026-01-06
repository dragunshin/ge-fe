// import { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronRight, Search } from 'lucide-react';
// import { useAuthStore } from '../../stores/useAuthStore';
// import heartIcon from '../../images/mypage/heart.svg';
// import homeIcon from '../../images/home/home.svg';
// import exploreIcon from '../../images/home/search.svg';
// import chatIcon from '../../images/home/chat.svg';
// import communityIcon from '../../images/home/community.svg';
// import mypageIcon from '../../images/home/mypage.svg';
// import starIcon from '../../images/reviews/star.svg';

// type Banner = {
//   id: number;
//   eyebrow?: string;
//   title: string;
//   subtitle?: string;
//   author?: string;
//   role?: string;
//   image?: string;
// };

// type TabItem = {
//   id: string;
//   label: string;
//   route?: string;
//   underlineLeft: number;
// };

// type TopExpert = {
//   id: number;
//   name: string;
//   summary: string;
//   tags: string[];
//   thumbnail?: string;
// };

// type ReviewCard = {
//   id: number;
//   name: string;
//   rating: number;
//   date: string;
//   content: string;
//   category: string;
//   concern: string;
//   avatar?: string;
//   images: string[];
// };

// type ExpertListCard = {
//   id: number;
//   name: string;
//   rating: number;
//   reviewCount: string;
//   summary: string;
//   avatar?: string;
//   tags: string[];
//   reviewTags: string[];
//   images: string[];
// };

// const HomePage = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, initializeAuth } = useAuthStore();
//   const [selectedTopTab, setSelectedTopTab] = useState('전체');
//   const [selectedConsultingTab, setSelectedConsultingTab] = useState('전체');
//   const [selectedHomeTab, setSelectedHomeTab] = useState('전체');

//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   const homeTabs: TabItem[] = useMemo(
//     () => [
//       { id: 'all', label: '전체', route: '/', underlineLeft: 16 },
//       { id: 'hair', label: '헤어', route: '/category/hair', underlineLeft: 85 },
//       { id: 'makeup', label: '메이크업', route: '/category/makeup', underlineLeft: 153 },
//       { id: 'fashion', label: '패션', route: '/category/fashion', underlineLeft: 249 },
//       { id: 'skin', label: '스킨', route: '/category/skin', underlineLeft: 317 },
//     ],
//     [],
//   );

//   const banners: Banner[] = [
//     {
//       id: 1,
//       title: '3분 투자로 완성하는',
//       subtitle: '관리하는 남자의 인상',
//     },
//     {
//       id: 2,
//       eyebrow: '이제 슬슬 준비해야지',
//       title: '소개팅 필수 헤어스타일',
//       subtitle: '‘스핀 스왈로브펌’',
//       author: '박서령',
//       role: '헤어디자이너',
//     },
//     {
//       id: 3,
//       title: '박철옹이 알려주는',
//       subtitle: '진짜 남자의 메이크업',
//     },
//   ];

//   const topTabs = [
//     { label: '전체', minWidth: 47 },
//     { label: '헤어', minWidth: 47 },
//     { label: '메이크업', minWidth: 69 },
//     { label: '스킨', minWidth: 47 },
//   ];

//   const topExperts: TopExpert[] = [
//     {
//       id: 1,
//       name: '강현우',
//       summary: '전문가가 작성한 자신만의 강점 1줄을 이렇게 적어두기!!',
//       tags: ['헤어라인', '두상분석'],
//     },
//     {
//       id: 2,
//       name: '강현우',
//       summary: '전문가가 작성한 자신만의 강점 1줄을 이렇게 적어두기!!',
//       tags: ['헤어라인', '두상분석'],
//     },
//     {
//       id: 3,
//       name: '강현우',
//       summary: '전문가가 작성한 자신만의 강점 1줄을 이렇게 적어두기!!',
//       tags: ['헤어라인', '두상분석'],
//     },
//   ];

//   const reviews: ReviewCard[] = [
//     {
//       id: 1,
//       name: '성정수 전문가',
//       rating: 4.7,
//       date: '2025.10.08',
//       content:
//         '머리가 악성곱슬이어서 너무 고민이었는데 성정수 전문가님 만나고 광명 찾았어요~!!! 원래는 2주만 지나도 바로 곱슬곱슬해지는데 지금 한 달이 지나도 직모에요.',
//       category: '헤어',
//       concern: '탈모',
//       images: ['', ''],
//     },
//     {
//       id: 2,
//       name: '옹민호 전문가',
//       rating: 4.7,
//       date: '2025.10.08',
//       content:
//         '평소에 여드름도 많아서 메이크업 받으면 둥둥 떴는데 성정수 상담가님 덕분에 너무 멋지게 프로필 사진 촬영하고 왔어요! 상세하게 알려주셔서 덕분에 메이크업 잘하고 갔습니다.',
//       category: '메이크업',
//       concern: '?',
//       images: ['', ''],
//     },
//   ];

//   const consultingTabs = [
//     { label: '전체', minWidth: 47 },
//     { label: '헤어', minWidth: 47 },
//     { label: '메이크업', minWidth: 69 },
//     { label: '패션', minWidth: 47 },
//   ];

//   const expertCards: ExpertListCard[] = [
//     {
//       id: 1,
//       name: '김푸힝',
//       rating: 4.7,
//       reviewCount: '(1,130)',
//       summary: '탈모 삭제 마법사 | 탈모인만의 컨설팅',
//       tags: ['헤어', '탈모', '투블럭컷', '펌', '+3'],
//       reviewTags: ['탈모', '투블럭컷', '투블럭컷'],
//       images: ['', '', ''],
//     },
//     {
//       id: 2,
//       name: '김푸힝',
//       rating: 4.7,
//       reviewCount: '(1,130)',
//       summary: '탈모 삭제 마법사 | 탈모인만의 컨설팅',
//       tags: ['헤어', '탈모', '투블럭컷', '펌', '+3'],
//       reviewTags: ['탈모', '투블럭컷', '투블럭컷'],
//       images: ['', '', ''],
//     },
//     {
//       id: 3,
//       name: '김푸힝',
//       rating: 4.7,
//       reviewCount: '(1,130)',
//       summary: '탈모 삭제 마법사 | 탈모인만의 컨설팅',
//       tags: ['헤어', '탈모', '투블럭컷', '펌', '+3'],
//       reviewTags: ['탈모', '투블럭컷', '투블럭컷'],
//       images: ['', '', ''],
//     },
//   ];

//   const handleMyPageClick = () => {
//     if (isAuthenticated) {
//       navigate('/profile');
//     } else {
//       navigate('/auth/login');
//     }
//   };

//   return (
//     <div className="flex h-full flex-col bg-white">
//       <header className="flex h-[56px] items-center justify-between px-4 pt-[14px]">
//         <div className="flex items-center gap-1 text-[18px] font-semibold tracking-tight text-[#0f0f10]">
//           <span>MENUAL</span>
//           <span>.</span>
//         </div>
//         <div className="flex items-center gap-[14px]">
//           <button className="flex h-6 w-6 items-center justify-center">
//             <Search className="h-6 w-6 text-[#0f0f10]" />
//           </button>
//           <button className="flex h-6 w-6 items-center justify-center">
//             <img src={heartIcon} alt="찜" className="h-6 w-6" />
//           </button>
//         </div>
//       </header>

//       <main className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
//         <section className="pt-[4px]">
//           <div className="flex items-center justify-between px-4 text-[16px] font-semibold">
//             {homeTabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setSelectedHomeTab(tab.label);
//                   if (tab.route && tab.route !== '/') {
//                     navigate(tab.route);
//                   }
//                 }}
//                 className={
//                   tab.label === selectedHomeTab
//                     ? 'text-[#0f0f10]'
//                     : 'text-[#989ba2]'
//                 }
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//           <div className="relative mt-[12px] h-px bg-[#e1e2e4]">
//             <span
//               className="absolute top-0 h-px w-[41px] bg-[#0f0f10]"
//               style={{ left: homeTabs.find((tab) => tab.label === selectedHomeTab)?.underlineLeft }}
//             />
//           </div>
//         </section>

//         <section className="px-4 pt-5">
//           <div className="flex gap-[4px] overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
//             {banners.map((banner) => (
//               <article
//                 key={banner.id}
//                 className="relative h-[340px] w-[340px] shrink-0 overflow-hidden rounded-[12px] bg-[#c7c9cf] snap-start"
//               >
//                 {banner.image && (
//                   <img
//                     src={banner.image}
//                     alt=""
//                     className="absolute inset-0 h-full w-full object-cover"
//                   />
//                 )}
//                 <div
//                   className="absolute inset-0"
//                   style={{
//                     background:
//                       'linear-gradient(180deg, rgba(111,111,111,0) 52.404%, rgba(89,89,89,0.9) 100%)',
//                   }}
//                 />
//                 <div className="absolute left-6 top-[220px] w-[292px] text-white">
//                   {banner.eyebrow && (
//                     <p className="text-[12px] leading-[1.4]">{banner.eyebrow}</p>
//                   )}
//                   <p className="text-[25.5px] font-semibold leading-[1.5]">
//                     {banner.title}
//                   </p>
//                   {banner.subtitle && (
//                     <p className="text-[25.5px] font-semibold leading-[1.5]">
//                       {banner.subtitle}
//                     </p>
//                   )}
//                   {banner.author && banner.role && (
//                     <div className="mt-3 inline-flex h-[22px] items-center gap-[6px] rounded-[2px] bg-[#008bff] px-[8px] text-[12px] font-semibold">
//                       <span>{banner.author}</span>
//                       <span className="h-[7px] w-px bg-white/80" />
//                       <span className="text-[10px] font-medium">{banner.role}</span>
//                     </div>
//                   )}
//                 </div>
//               </article>
//             ))}
//           </div>
//         </section>

//         <section className="pt-[41px]">
//           <div className="px-4">
//             <h2 className="text-[18px] font-semibold text-[#0f0f10]">
//               지금 가장 인기있는 전문가 TOP3
//             </h2>
//             <div className="mt-[16px] flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
//               {topTabs.map((tab) => (
//                 <button
//                   key={tab.label}
//                   onClick={() => setSelectedTopTab(tab.label)}
//                   className={`flex h-[30px] items-center justify-center whitespace-nowrap rounded-[4px] px-[12px] text-[13px] ${
//                     selectedTopTab === tab.label
//                       ? 'bg-[#46474c] text-white font-semibold'
//                       : 'border border-[#dbdcdf] text-[#46474c] font-normal'
//                   }`}
//                   style={{ minWidth: tab.minWidth }}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="mt-4 space-y-4 px-4">
//             {topExperts.map((expert, index) => (
//               <div key={expert.id} className="flex h-[72px] w-[342px] items-start justify-between">
//                 <div className="flex items-end gap-[12px]">
//                   <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[4px] bg-[#e1e2e4]">
//                     {expert.thumbnail && (
//                       <img src={expert.thumbnail} alt="" className="h-full w-full object-cover" />
//                     )}
//                     <div className="absolute left-[4px] top-[4px] flex h-[15px] w-[15px] items-center justify-center bg-[#008bff]">
//                       <span className="text-[12px] font-medium leading-[1.4] text-white">
//                         {index + 1}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex w-[218px] flex-col items-start gap-[10px]">
//                     <p className="h-[40px] w-[218px] text-[14px] font-semibold leading-[1.4] text-[#292a2d]">
//                       {expert.name} |{' '}
//                       <span className="font-normal">{expert.summary}</span>
//                     </p>
//                     <div className="flex items-center gap-[4px]">
//                       {expert.tags.map((tag) => (
//                         <span
//                           key={`${expert.id}-${tag}`}
//                           className="flex h-[21px] items-center justify-center rounded-[2px] bg-[#f4f4f5] px-[6px] py-[4px] text-[12px] text-[#46474c]"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <button className="flex h-6 w-6 items-center justify-center">
//                   <img src={heartIcon} alt="찜" className="h-6 w-6" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="mt-[41px] bg-[#f4f8fb]">
//           <div className="px-4 pt-[22px]">
//             <div className="flex items-center justify-between">
//               <h2 className="text-[18px] font-semibold text-[#0f0f10]">전체 후기</h2>
//               <button className="flex items-center gap-[2px] text-[14px] text-[#70737c]">
//                 전체보기
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//           <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
//             {reviews.map((review) => (
//               <article
//                 key={review.id}
//                 className="flex h-[393px] w-[300px] shrink-0 flex-col rounded-[8px] border border-[#e1e2e4] bg-white snap-start"
//               >
//                 <div className="flex items-center justify-between px-4 pt-[14px]">
//                   <div className="flex items-center gap-[10px]">
//                     <div className="h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
//                       {review.avatar && (
//                         <img src={review.avatar} alt="" className="h-full w-full object-cover" />
//                       )}
//                     </div>
//                     <div className="flex flex-col gap-[4px]">
//                       <div className="flex items-center gap-[2px]">
//                         <span className="text-[14px] font-semibold text-[#0f0f10]">
//                           {review.name}
//                         </span>
//                         <ChevronRight className="h-4 w-4 text-[#0f0f10]" />
//                       </div>
//                       <div className="flex items-center gap-[8px] text-[13px] text-[#989ba2]">
//                         <div className="flex items-center gap-1 text-[#ffb800]">★★★★★</div>
//                         <span>{review.rating}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <button className="text-[14px] text-[#70737c]">프로필 보기</button>
//                 </div>
//                 <div className="px-4 pt-[14px]">
//                   <div className="flex gap-[8px]">
//                     {review.images.map((image, index) => (
//                       <div
//                         key={`${review.id}-image-${index}`}
//                         className="h-[130px] w-[130px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
//                       >
//                         {image && (
//                           <img src={image} alt="" className="h-full w-full object-cover" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="px-4 pt-3">
//                   <div className="flex items-center gap-[12px] text-[13px] text-[#989ba2]">
//                     <span className="font-semibold text-[#878a93]">박덕호</span>
//                     <span>{review.date}</span>
//                   </div>
//                   <p className="mt-2 text-[13px] leading-[1.4] text-[#505158]">
//                     {review.content}
//                   </p>
//                 </div>
//                 <div className="mt-auto flex gap-[6px] px-4 pb-4 pt-2">
//                   <span className="rounded-[2px] bg-[#e5f4ff] px-[8px] py-[4px] text-[12px] text-[#008bff]">
//                     {review.category}
//                   </span>
//                   <span className="rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]">
//                     {review.concern}
//                   </span>
//                 </div>
//               </article>
//             ))}
//           </div>
//           <div className="mt-4 flex items-center justify-center pb-[12px]">
//             <div className="h-[3px] w-[55px] rounded-full bg-[#e1e2e4]">
//               <div className="h-[3px] w-[20px] rounded-full bg-[#429ff0]" />
//             </div>
//           </div>
//         </section>

//         <section className="px-4 pt-[32px]">
//           <h2 className="text-[18px] font-semibold text-[#0f0f10]">필승 소개팅 컨설팅</h2>
//           <div className="mt-[12px] flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
//             {consultingTabs.map((tab) => (
//               <button
//                 key={tab.label}
//                 onClick={() => setSelectedConsultingTab(tab.label)}
//                 className={`flex h-[30px] items-center justify-center whitespace-nowrap rounded-[4px] px-[12px] text-[13px] ${
//                   selectedConsultingTab === tab.label
//                     ? 'bg-[#46474c] text-white font-semibold'
//                     : 'border border-[#dbdcdf] text-[#46474c] font-normal'
//                 }`}
//                 style={{ minWidth: tab.minWidth }}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//           <div className="mt-[20px] space-y-[16px] pb-[16px]">
//             {expertCards.map((expert) => (
//               <article
//                 key={expert.id}
//                 className="relative h-[253px] w-[343px] rounded-[8px] bg-white shadow-[0px_2px_12px_0px_rgba(0,0,0,0.13)]"
//               >
//                 <div className="absolute left-[13px] top-[23px] flex items-center gap-[10px]">
//                   <div className="h-[42px] w-[42px] shrink-0 rounded-full bg-[#e1e2e4]">
//                     {expert.avatar && (
//                       <img src={expert.avatar} alt="" className="h-full w-full object-cover" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-[16px] font-semibold leading-[1.1] text-[#292a2d]">
//                       {expert.name}
//                     </p>
//                     <p className="mt-[6px] text-[13px] text-[#878a93]">{expert.summary}</p>
//                   </div>
//                 </div>
//                 <div className="absolute right-[13px] top-[23px] flex items-center gap-[6px] text-[13px] text-[#878a93]">
//                   <div className="flex items-center gap-[2px]">
//                     <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
//                     <span className="font-semibold text-[#505158]">{expert.rating}</span>
//                   </div>
//                   <span>{expert.reviewCount}</span>
//                 </div>
//                 <div className="absolute left-[12px] top-[79px] flex gap-[2px]">
//                   {expert.images.map((image, index) => (
//                     <div
//                       key={`${expert.id}-review-${index}`}
//                       className="relative h-[105px] w-[105px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
//                     >
//                       {image && (
//                         <img src={image} alt="" className="h-full w-full object-cover" />
//                       )}
//                       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
//                       <span className="absolute bottom-[10px] left-[10px] text-[12px] text-white">
//                         {expert.reviewTags[index]}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//                 <button className="absolute right-[12px] top-[198px] h-[36px] w-[95px] rounded-[4px] bg-[#171719] text-[14px] font-medium text-white">
//                   상담 예약
//                 </button>
//                 <div className="absolute left-[13px] top-[204px] flex gap-[6px]">
//                   {expert.tags.map((tag, index) => (
//                     <span
//                       key={`${expert.id}-tag-${tag}-${index}`}
//                       className={
//                         tag === '헤어'
//                           ? 'rounded-[2px] bg-[#f5f9fd] px-[6px] py-[4px] text-[12px] text-[#429ff0]'
//                           : 'rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]'
//                       }
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </article>
//             ))}
//           </div>
//         </section>

//         <section className="px-4 pb-[24px] pt-[8px]">
//           <button
//             onClick={() => navigate('/reservation/fashion')}
//             className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#171719] text-[16px] font-semibold text-white"
//           >
//             예약
//           </button>
//         </section>
//       </main>

//       <nav className="flex h-[69px] items-center justify-between border-t border-[#f4f4f5] px-4 pb-[12px] pt-[12px]">
//         <button className="flex flex-1 flex-col items-center gap-1 text-[#0f0f10]">
//           <img src={homeIcon} alt="홈" className="h-6 w-6" />
//           <span className="text-[12px] font-semibold">홈</span>
//         </button>
//         <button className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]">
//           <img src={exploreIcon} alt="탐색" className="h-6 w-6" />
//           <span className="text-[12px]">탐색</span>
//         </button>
//         <button
//           onClick={() => navigate('/chat')}
//           className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]"
//         >
//           <img src={chatIcon} alt="채팅" className="h-6 w-6" />
//           <span className="text-[12px]">채팅</span>
//         </button>
//         <button
//           onClick={() => navigate('/reservation/fashion?step=9')}
//           className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]"
//         >
//           <img src={communityIcon} alt="커뮤니티" className="h-6 w-6" />
//           <span className="text-[12px]">커뮤니티</span>
//         </button>
//         <button
//           onClick={handleMyPageClick}
//           className="flex flex-1 flex-col items-center gap-1 text-[#aeb0b6]"
//         >
//           <img src={mypageIcon} alt="마이페이지" className="h-6 w-6" />
//           <span className="text-[12px]">마이페이지</span>
//         </button>
//       </nav>
//     </div>
//   );
// };

// export default HomePage;

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import heartIcon from "../../images/mypage/heart.svg";
import BottomNav from "@/components/navigation/bottom-nav";
import Logo from "@/components/ui/logo";
import starIcon from "../../images/reviews/star.svg";
import banner1 from "@/images/home/banner1.svg";
import banner2 from "@/images/home/banner2.png";
import banner3 from "@/images/home/banner3.png";
import { expertService } from "../../services/expert.service";
import { reviewService } from "../../services/review.service";
import {
  getApiCategoryFromLabel,
  getLabelFromApiCategory,
} from "../../lib/utils/category";

// ✅ 아래 2개 import 경로만 프로젝트에 맞게 조정하세요.
// 예) import ConsultationMethodSheet from './reservationSheet/typeReservation';
// 예) import DateTimeBottomSheet from './reservationSheet/calendar';
import ConsultationMethodSheet from "../resevationFlow/reservationSheet/typeReservation";
import DateTimeBottomSheet from "../resevationFlow/reservationSheet/calendar";

type ConsultType = "MESSAGE" | "LIVE";

type Banner = {
  id: number;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  role?: string;
  image?: string;
};

type TabItem = {
  id: string;
  label: string;
  route?: string;
  underlineLeft: number;
};

type TopExpert = {
  id: number;
  expertId?: number;
  name: string;
  summary: string;
  tags: string[];
  thumbnail?: string;
};

type ReviewCard = {
  id: number;
  name: string;
  rating: number;
  date: string;
  content: string;
  category: string;
  concern: string;
  avatar?: string;
  images: string[];
};

type ExpertListCard = {
  id: number;
  name: string;
  rating: number;
  reviewCount: string;
  summary: string;
  avatar?: string;
  tags: string[];
  reviewTags: string[];
  images: string[];
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { initializeAuth } = useAuthStore();
  const [selectedTopTab, setSelectedTopTab] = useState("헤어");
  const [selectedConsultingTab, setSelectedConsultingTab] = useState("전체");
  const [selectedHomeTab, setSelectedHomeTab] = useState("전체");
  const [topExperts, setTopExperts] = useState<TopExpert[]>([]);
  const [reviews, setReviews] = useState<ReviewCard[]>([]);

  // ✅ 추가: bottom sheet 제어 + 선택값 저장(원하면 다음 페이지로 넘길 수 있음)
  const [openTypeSheet, setOpenTypeSheet] = useState(false);
  const [openCalendarSheet, setOpenCalendarSheet] = useState(false);
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultType>("MESSAGE");

  const formatDate = (value?: string) => {
    if (!value) {
      return "";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const parseMediaUrls = (value?: string | string[]) => {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch {
        return [];
      }
    }
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

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

    const fetchTopExperts = async () => {
      try {
        const category = getApiCategoryFromLabel(selectedTopTab);
        const [popularResponse, listResponse] = await Promise.all([
          expertService.getTopExperts(category),
          expertService.getExpertList({ category, page: 0, size: 100 }),
        ]);
        if (!isActive) {
          return;
        }
        const expertIdByName = new Map(
          listResponse.data.map((expert) => [expert.nickname, expert.expertId]),
        );
        const mapped = popularResponse.data.top3.map((expert, index) => {
          const expertId = expertIdByName.get(expert.name);
          return {
            id: expertId ?? index,
            expertId,
          name: expert.name,
          summary: expert.introduction,
          tags: expert.category ? [getLabelFromApiCategory(expert.category)] : [],
          thumbnail: expert.profileImage,
          };
        });
        setTopExperts(mapped);
      } catch (error) {
        console.error("Failed to fetch top experts:", error);
      }
    };

    fetchTopExperts();

    return () => {
      isActive = false;
    };
  }, [selectedTopTab]);

  useEffect(() => {
    let isActive = true;

    const fetchReviews = async () => {
      try {
        const category = getApiCategoryFromLabel(selectedHomeTab);
        const response = await reviewService.getRecentReviews({
          category,
          page: 0,
          size: 5,
        });
        if (!isActive) {
          return;
        }
        const mapped = response.data.map((review) => ({
          id: review.reviewId,
          name: "익명",
          rating: review.rating,
          date: formatDate(review.createdAt),
          content: review.content,
          category: getLabelFromApiCategory(review.category),
          concern: "후기",
          images: parseMediaUrls(review.mediaUrls).slice(0, 2),
        }));
        setReviews(mapped);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();

    return () => {
      isActive = false;
    };
  }, [selectedHomeTab]);

  const homeTabs: TabItem[] = useMemo(
    () => [
      { id: "all", label: "전체", route: "/", underlineLeft: 16 },
      { id: "hair", label: "헤어", route: "/category/hair", underlineLeft: 85 },
      { id: "makeup", label: "메이크업", route: "/category/makeup", underlineLeft: 153 },
      { id: "fashion", label: "패션", route: "/category/fashion", underlineLeft: 249 },
      { id: "skin", label: "스킨", route: "/category/skin", underlineLeft: 317 },
    ],
    [],
  );

  const banners: Banner[] = [
    {
      id: 1,
      image: banner1,
    },
    {
      id: 2,
      image: banner2,
    },
    {
      id: 3,
      image: banner3,
    },
  ];

  const topTabs = [
    { label: "헤어", minWidth: 47 },
    { label: "패션", minWidth: 47 },
    { label: "메이크업", minWidth: 69 },
    { label: "스킨", minWidth: 47 },
  ];

  const consultingTabs = [
    { label: "전체", minWidth: 47 },
    { label: "헤어", minWidth: 47 },
    { label: "메이크업", minWidth: 69 },
    { label: "패션", minWidth: 47 },
  ];

  const expertCards: ExpertListCard[] = [
    {
      id: 1,
      name: "옹민호",
      rating: 4.7,
      reviewCount: "(1,130)",
      summary: "탈모 삭제 마법사 | 탈모인만의 컨설팅",
      tags: ["헤어", "탈모", "투블럭컷", "펌", "+3"],
      reviewTags: ["탈모", "투블럭컷", "투블럭컷"],
      images: ["", "", ""],
    },
    {
      id: 2,
      name: "이민아",
      rating: 4.7,
      reviewCount: "(1,130)",
      summary: "탈모 삭제 마법사 | 탈모인만의 컨설팅",
      tags: ["헤어", "탈모", "투블럭컷", "펌", "+3"],
      reviewTags: ["탈모", "투블럭컷", "투블럭컷"],
      images: ["", "", ""],
    },
    {
      id: 3,
      name: "고현진",
      rating: 4.7,
      reviewCount: "(1,130)",
      summary: "탈모 삭제 마법사 | 탈모인만의 컨설팅",
      tags: ["헤어", "탈모", "투블럭컷", "펌", "+3"],
      reviewTags: ["탈모", "투블럭컷", "투블럭컷"],
      images: ["", "", ""],
    },
  ];

  // ✅ 추가: 예약 플로우 시작
  const openReservationFlow = () => {
    setOpenCalendarSheet(false);
    setOpenTypeSheet(true);
  };

  const getReviewRoute = () => {
    if (selectedHomeTab === "전체") {
      return "/category/hair/reviews";
    }
    const tab = homeTabs.find((item) => item.label === selectedHomeTab);
    if (tab?.route) {
      return `${tab.route}/reviews`;
    }
    return "/category/hair/reviews";
  };

  return (
    <div className="flex h-full flex-col bg-white">
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

      <main className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
        <section className="pt-[4px]">
          <div className="flex items-center justify-between px-4 text-[16px] font-semibold">
            {homeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedHomeTab(tab.label);
                  if (tab.route && tab.route !== "/") {
                    navigate(tab.route);
                  }
                }}
                className={tab.label === selectedHomeTab ? "text-[#0f0f10]" : "text-[#989ba2]"}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative mt-[12px] h-px bg-[#e1e2e4]">
            <span
              className="absolute top-0 h-px w-[41px] bg-[#0f0f10]"
              style={{ left: homeTabs.find((tab) => tab.label === selectedHomeTab)?.underlineLeft }}
            />
          </div>
        </section>

        <section className="px-4 pt-5">
          <div className="flex gap-[4px] overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {banners.map((banner) => {
              const hasText =
                banner.eyebrow ||
                banner.title ||
                banner.subtitle ||
                banner.author ||
                banner.role;
              return (
                <article
                  key={banner.id}
                  className="relative h-[340px] w-[340px] shrink-0 overflow-hidden rounded-[12px] bg-[#c7c9cf] snap-start"
                >
                  {banner.image && (
                    <img
                      src={banner.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  {hasText ? (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(111,111,111,0) 52.404%, rgba(89,89,89,0.9) 100%)",
                        }}
                      />
                      <div className="absolute left-6 top-[220px] w-[292px] text-white">
                        {banner.eyebrow && (
                          <p className="text-[12px] leading-[1.4]">{banner.eyebrow}</p>
                        )}
                        <p className="text-[25.5px] font-semibold leading-[1.5]">
                          {banner.title}
                        </p>
                        {banner.subtitle && (
                          <p className="text-[25.5px] font-semibold leading-[1.5]">
                            {banner.subtitle}
                          </p>
                        )}
                        {banner.author && banner.role && (
                          <div className="mt-3 inline-flex h-[22px] items-center gap-[6px] rounded-[2px] bg-[#008bff] px-[8px] text-[12px] font-semibold">
                            <span>{banner.author}</span>
                            <span className="h-[7px] w-px bg-white/80" />
                            <span className="text-[10px] font-medium">{banner.role}</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section className="pt-[41px]">
          <div className="px-4">
            <h2 className="text-[18px] font-semibold text-[#0f0f10]">
              지금 가장 인기있는 전문가 TOP3
            </h2>
            <div className="mt-[16px] flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
              {topTabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setSelectedTopTab(tab.label)}
                  className={`flex h-[30px] items-center justify-center whitespace-nowrap rounded-[4px] px-[12px] text-[13px] ${
                    selectedTopTab === tab.label
                      ? "bg-[#46474c] text-white font-semibold"
                      : "border border-[#dbdcdf] text-[#46474c] font-normal"
                  }`}
                  style={{ minWidth: tab.minWidth }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-4 px-4">
            {topExperts.map((expert, index) => (
              <div
                key={expert.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (expert.expertId) {
                    navigate(`/experts/${expert.expertId}`);
                  }
                }}
                onKeyDown={(event) => {
                  if ((event.key === "Enter" || event.key === " ") && expert.expertId) {
                    event.preventDefault();
                    navigate(`/experts/${expert.expertId}`);
                  }
                }}
                className="flex h-[72px] w-[342px] items-start justify-between"
              >
                <div className="flex items-end gap-[12px]">
                  <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[4px] bg-[#e1e2e4]">
                    {expert.thumbnail && (
                      <img src={expert.thumbnail} alt="" className="h-full w-full object-cover" />
                    )}
                    <div className="absolute left-[4px] top-[4px] flex h-[15px] w-[15px] items-center justify-center bg-[#008bff]">
                      <span className="text-[12px] font-medium leading-[1.4] text-white">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-[218px] flex-col items-start gap-[10px]">
                    <p
                      className="h-[40px] w-[218px] text-[14px] font-semibold leading-[1.4] text-[#292a2d]"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {expert.name} | <span className="font-normal">{expert.summary}</span>
                    </p>
                    <div className="flex items-center gap-[4px]">
                      {expert.tags.map((tag) => (
                        <span
                          key={`${expert.id}-${tag}`}
                          className="flex h-[21px] items-center justify-center rounded-[2px] bg-[#f4f4f5] px-[6px] py-[4px] text-[12px] text-[#46474c]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  className="flex h-6 w-6 items-center justify-center"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  type="button"
                >
                  <img src={heartIcon} alt="찜" className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-[41px] bg-[#f4f8fb]">
          <div className="px-4 pt-[22px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0f0f10]">전체 후기</h2>
              <button
                onClick={() => navigate(getReviewRoute())}
                className="flex items-center gap-[2px] text-[14px] text-[#70737c]"
              >
                전체보기
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="flex h-[393px] w-[300px] shrink-0 flex-col rounded-[8px] border border-[#e1e2e4] bg-white snap-start"
              >
                <div className="flex items-center justify-between px-4 pt-[14px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full bg-[#e1e2e4]">
                      {review.avatar && (
                        <img src={review.avatar} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-center gap-[2px]">
                        <span className="text-[14px] font-semibold text-[#0f0f10]">
                          {review.name}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#0f0f10]" />
                      </div>
                      <div className="flex items-center gap-[8px] text-[13px] text-[#989ba2]">
                        <div className="flex items-center gap-1 text-[#ffb800]">★★★★★</div>
                        <span>{review.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-[14px] text-[#70737c]">프로필 보기</button>
                </div>

                <div className="px-4 pt-[14px]">
                  <div className="flex gap-[8px]">
                    {review.images.map((image, idx) => (
                      <div
                        key={`${review.id}-image-${idx}`}
                        className="h-[130px] w-[130px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                      >
                        {image && <img src={image} alt="" className="h-full w-full object-cover" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 pt-3">
                  <div className="flex items-center gap-[12px] text-[13px] text-[#989ba2]">
                    <span className="font-semibold text-[#878a93]">박덕호</span>
                    <span>{review.date}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.4] text-[#505158]">{review.content}</p>
                </div>

                <div className="mt-auto flex gap-[6px] px-4 pb-4 pt-2">
                  <span className="rounded-[2px] bg-[#e5f4ff] px-[8px] py-[4px] text-[12px] text-[#008bff]">
                    {review.category}
                  </span>
                  <span className="rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]">
                    {review.concern}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center pb-[12px]">
            <div className="h-[3px] w-[55px] rounded-full bg-[#e1e2e4]">
              <div className="h-[3px] w-[20px] rounded-full bg-[#429ff0]" />
            </div>
          </div>
        </section>

        <section className="px-4 pt-[32px]">
          <h2 className="text-[18px] font-semibold text-[#0f0f10]">필승 소개팅 컨설팅</h2>

          <div className="mt-[12px] flex gap-[8px] overflow-x-auto pb-2 scrollbar-hide">
            {consultingTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setSelectedConsultingTab(tab.label)}
                className={`flex h-[30px] items-center justify-center whitespace-nowrap rounded-[4px] px-[12px] text-[13px] ${
                  selectedConsultingTab === tab.label
                    ? "bg-[#46474c] text-white font-semibold"
                    : "border border-[#dbdcdf] text-[#46474c] font-normal"
                }`}
                style={{ minWidth: tab.minWidth }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-[20px] space-y-[16px] pb-[16px]">
            {expertCards.map((expert) => (
              <article
                key={expert.id}
                className="relative h-[253px] w-[343px] rounded-[8px] bg-white shadow-[0px_2px_12px_0px_rgba(0,0,0,0.13)]"
              >
                <div className="absolute left-[13px] top-[23px] flex items-center gap-[10px]">
                  <div className="h-[42px] w-[42px] shrink-0 rounded-full bg-[#e1e2e4]">
                    {expert.avatar && (
                      <img src={expert.avatar} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold leading-[1.1] text-[#292a2d]">
                      {expert.name}
                    </p>
                    <p className="mt-[6px] text-[13px] text-[#878a93]">{expert.summary}</p>
                  </div>
                </div>

                <div className="absolute right-[13px] top-[23px] flex items-center gap-[6px] text-[13px] text-[#878a93]">
                  <div className="flex items-center gap-[2px]">
                    <img src={starIcon} alt="" className="h-[18px] w-[18px]" />
                    <span className="font-semibold text-[#505158]">{expert.rating}</span>
                  </div>
                  <span>{expert.reviewCount}</span>
                </div>

                <div className="absolute left-[12px] top-[79px] flex gap-[2px]">
                  {expert.images.map((image, idx) => (
                    <div
                      key={`${expert.id}-review-${idx}`}
                      className="relative h-[105px] w-[105px] overflow-hidden rounded-[4px] bg-[#e1e2e4]"
                    >
                      {image && <img src={image} alt="" className="h-full w-full object-cover" />}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                      <span className="absolute bottom-[10px] left-[10px] text-[12px] text-white">
                        {expert.reviewTags[idx]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ✅ 여기만 기능 추가: 상담 예약 -> typeReservation 오픈 */}
                <button
                  onClick={openReservationFlow}
                  className="absolute right-[12px] top-[198px] h-[36px] w-[95px] rounded-[4px] bg-[#171719] text-[14px] font-medium text-white"
                >
                  상담 예약
                </button>

                <div className="absolute left-[13px] top-[204px] flex gap-[6px]">
                  {expert.tags.map((tag, idx) => (
                    <span
                      key={`${expert.id}-tag-${tag}-${idx}`}
                      className={
                        tag === "헤어"
                          ? "rounded-[2px] bg-[#f5f9fd] px-[6px] py-[4px] text-[12px] text-[#429ff0]"
                          : "rounded-[2px] bg-[#f4f4f5] px-[8px] py-[4px] text-[12px] text-[#46474c]"
                      }
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 pb-[24px] pt-[8px]">
          <button
            onClick={() => navigate("/reservation/fashion")}
            className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#171719] text-[16px] font-semibold text-white"
          >
            예약(임시버튼)
          </button>
        </section>
      </main>

      <BottomNav />

      {/* ✅ 추가: 1) 상담 방식(typeReservation) */}
      <ConsultationMethodSheet
        open={openTypeSheet}
        onClose={() => setOpenTypeSheet(false)}
        defaultValue={selectedConsultType}
        onNext={(selected) => {
          setSelectedConsultType(selected);
          setOpenTypeSheet(false);
          setOpenCalendarSheet(true);
        }}
      />

      {/* ✅ 추가: 2) 날짜/시간(calendar) -> 다음 누르면 /hair/setup 이동 */}
      <DateTimeBottomSheet
        open={openCalendarSheet}
        onClose={() => setOpenCalendarSheet(false)}
        onNext={() => {
          setOpenCalendarSheet(false);
          navigate("/hair/setup");
        }}
      />
    </div>
  );
};

export default HomePage;
