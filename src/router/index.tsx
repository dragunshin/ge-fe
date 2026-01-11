import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home/page";
import LoginPage from "../pages/auth/login/page";
import SignUpPage from "../pages/auth/signup/page";
import SocialSignUpPage from "../pages/auth/social-signup/page";
import KakaoCallbackPage from "../pages/auth/kakao-callback/page";
import { TermsOfServicePage } from "../pages/auth/terms-of-service/page";
import { PrivacyPolicyPage } from "../pages/auth/privacy-policy/page";
import { InterestSelectionPage } from "../pages/auth/interest-selection/page";
import { TermsAgreementPage } from "../pages/auth/terms-agreement/page";
import FaceStep from "@/pages/profileSetting/page";
import { Chat } from "@/pages/chat/page";
import { ChatList } from "@/pages/chat/components/ChatList";
import { ChatRoom } from "@/pages/chat/components/ChatRoom";
import EditorPage from "@/pages/solution/writeSolution";
import MyPage from "@/pages/myPage/page";
import ReservationHistoryView from "@/pages/myPage/reservation/page";

import LikedListPage from "@/pages/myPage/likedList/page1";
import PointPage from "@/pages/myPage/point/page";
// import WriteReviewPage from "@/pages/myPage/review/writeReview";
import ConsultationSheetTestPage from "@/pages/resevationFlow/page";
import CategoryLandingPage from "@/pages/category/page";
import CategoryBestReviewsPage from "@/pages/category/reviews/page";
import ExpertInfoPage from "@/pages/category/expert/page";
import PortfolioLandingPage from "@/pages/category/portfolio/page";
import ExplorePage from "@/pages/explore/page";
import { PaymentOrderPage } from "@/pages/payment/order/page";
import { PaymentCompletePage } from "@/pages/payment/complete/page";
import FashionReservationFlowPage from "@/pages/fashionFlow/page";
import { HairSetup } from "@/pages/hairFlow/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/signup",
    element: <SignUpPage />,
  },
  {
    path: "/auth/social-signup",
    element: <SocialSignUpPage />,
  },
  {
    path: "/kakaocallback",
    element: <KakaoCallbackPage />,
  },
  {
    path: "/auth/terms-of-service",
    element: <TermsOfServicePage />,
  },
  {
    path: "/auth/privacy-policy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/auth/interest-selection",
    element: <InterestSelectionPage />,
  },
  {
    path: "/auth/terms-agreement",
    element: <TermsAgreementPage />,
  },

  {
    path: "/profile",
    element: <FaceStep />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/chatList",
    element: <ChatList />,
  },
  {
    path: "/chatRoom",
    element: <ChatRoom />,
  },
  {
    path: "/write",
    element: <EditorPage />,
  },
  {
    path: "/mypage",
    element: <MyPage />,
  },
  {
    path: "/reservationhistory",
    element: <ReservationHistoryView />,
  },
  {
    path: "/LikedList",
    element: <LikedListPage />,
  },
  {
    path: "/PointPage",
    element: <PointPage />,
  },

  {
    path: "/sheetTest",
    element: <ConsultationSheetTestPage />,
  },
  { path: "/explore", element: <ExplorePage /> },
  { path: "/category/:category", element: <CategoryLandingPage /> },
  {
    path: "/category/:category/reviews",
    element: <CategoryBestReviewsPage />,
  },
  {
    path: "/experts/:expertId",
    element: <ExpertInfoPage />,
  },
  {
    path: "/experts/:expertId/portfolio",
    element: <PortfolioLandingPage />,
  },
  {
    path: "/payment/order",
    element: <PaymentOrderPage />,
  },
  {
    path: "/payment/complete",
    element: <PaymentCompletePage />,
  },
  {
    path: "/reservation/fashion",
    element: <FashionReservationFlowPage />,
  },
  {
    path: "/hair/setup",
    element: <HairSetup />,
  },
]);
