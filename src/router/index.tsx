import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home/page";
import LoginPage from "../pages/auth/login/page";
import SignUpPage from "../pages/auth/signup/page";
import SocialSignUpPage from "../pages/auth/social-signup/page";
import KakaoCallbackPage from "../pages/auth/kakao-callback/page";
import AuthGuard from "@/components/auth/auth-guard";
import { TermsOfServicePage } from "../pages/auth/terms-of-service/page";
import { PrivacyPolicyPage } from "../pages/auth/privacy-policy/page";
import { InterestSelectionPage } from "../pages/auth/interest-selection/page";
import { TermsAgreementPage } from "../pages/auth/terms-agreement/page";
import FaceStep from "@/pages/profileSetting/page";
import { Chat } from "@/pages/chat/page";
import ChatListPage from "@/pages/chat/chat-list-page";
// import { ChatRoom } from "@/pages/chat/components/ChatRoom";
import EditorPage from "@/pages/solution/writeSolution";
import MyPage from "@/pages/myPage/page";
import ReservationHistoryView from "@/pages/myPage/reservation/page";

import LikedListPage from "@/pages/myPage/likedList/page1";
import PointPage from "@/pages/myPage/point/page";
// import WriteReviewPage from "@/pages/myPage/review/writeReview";
import ConsultationSheetTestPage from "@/pages/resevationFlow/page";
import CategoryLandingPage from "@/pages/category/page";
import ExpertInfoPage from "@/pages/category/expert/page";
import PortfolioLandingPage from "@/pages/category/portfolio/page";
import ExplorePage from "@/pages/explore/page";
import { PaymentOrderPage } from "@/pages/payment/order/page";
import { PaymentCompletePage } from "@/pages/payment/complete/page";
import FashionReservationFlowPage from "@/pages/fashionFlow/page";
import { HairSetup } from "@/pages/hairFlow/page";
import ServiceReadyPage from "@/pages/service-ready/page";
import CategoryBestReviewsPage from "@/pages/category/reviews/page";
import CategoryExpertListPage from "@/pages/category/experts/page";
import ReviewWritePage from "@/pages/myPage/review/writeReview";
import MyReviewPage from "@/pages/myPage/review/myReview";
import ConsultationGate from "@/pages/solution/page";
import SolutionView from "@/pages/solution/readSolution";
import PaymentHistoryPage from "@/pages/myPage/paymentHistory/page";
import MySolutionView from "@/pages/myPage/mySolution/page";
import ExpertIntroductionPage from "@/pages/mypage/expert/introduction/page";
import ExpertPortfolioPage from "@/pages/mypage/expert/portfolio/page";

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
    element: (
      <AuthGuard>
        <FaceStep />
      </AuthGuard>
    ),
  },
  {
    path: "/chatList/:chatroomId",
    element: (
      <AuthGuard>
        <Chat />
      </AuthGuard>
    ),
  },
  {
    path: "/chatList",
    element: (
      <AuthGuard>
        <ChatListPage />
      </AuthGuard>
    ),
  },
  // {
  //   path: "/chatRoom",
  //   element: <ChatRoom />,
  // },
  {
    path: "/write",
    element: (
      <AuthGuard>
        <EditorPage />
      </AuthGuard>
    ),
  },
  {
    path: "/mypage",
    element: (
      <AuthGuard>
        <MyPage />
      </AuthGuard>
    ),
  },
  {
    path: "/mypage/expert/introduction",
    element: (
      <AuthGuard>
        <ExpertIntroductionPage />
      </AuthGuard>
    ),
  },
  {
    path: "/mypage/expert/portfolio",
    element: (
      <AuthGuard>
        <ExpertPortfolioPage />
      </AuthGuard>
    ),
  },
  {
    path: "/reservationhistory",
    element: (
      <AuthGuard>
        <ReservationHistoryView />
      </AuthGuard>
    ),
  },
  {
    path: "/LikedList",
    element: (
      <AuthGuard>
        <LikedListPage />
      </AuthGuard>
    ),
  },
  {
    path: "/PointPage",
    element: (
      <AuthGuard>
        <PointPage />
      </AuthGuard>
    ),
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
    path: "/category/:category/experts",
    element: <CategoryExpertListPage />,
  },
  {
    path: "/reviews",
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
    element: (
      <AuthGuard>
        <PaymentOrderPage />
      </AuthGuard>
    ),
  },
  {
    path: "/payment/complete",
    element: (
      <AuthGuard>
        <PaymentCompletePage />
      </AuthGuard>
    ),
  },
  {
    path: "/reservation/fashion",
    element: (
      <AuthGuard>
        <FashionReservationFlowPage />
      </AuthGuard>
    ),
  },
  {
    path: "/hair/setup",
    element: (
      <AuthGuard>
        <HairSetup />
      </AuthGuard>
    ),
  },
  {
    path: "/reviewWrite/:consultationId",
    element: (
      <AuthGuard>
        <ReviewWritePage />
      </AuthGuard>
    ),
  },
  {
    path: "/myReview",
    element: (
      <AuthGuard>
        <MyReviewPage />
      </AuthGuard>
    ),
  },
  {
    path: "/service-ready",
    element: <ServiceReadyPage />,
  },
  {
    path: "/concern/:consultationId",
    element: <ConsultationGate />,
  },
  {
    path: "/mypage/paymentHistory",
    element: <PaymentHistoryPage />,
  },
  {
    path: "/mypage/mySolution",
    element: <MySolutionView />,
  },
  {
    path: "/consultations/:consultationId/solution",
    element: (
      <AuthGuard>
        <SolutionView />
      </AuthGuard>
    ),
  },
]);
