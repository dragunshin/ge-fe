import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@/images/home/home.svg?react";
import ExploreIcon from "@/images/home/search.svg?react";
import ChatIcon from "@/images/home/chat.svg?react";
import CommunityIcon from "@/images/home/community.svg?react";
import MypageIcon from "@/images/home/mypage.svg?react";
import { useAuthStore } from "@/stores/useAuthStore";

type NavItem = {
  key: string;
  label: string;
  onClick: () => void;
};

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const navItems: NavItem[] = [
    { key: "home", label: "홈", onClick: () => navigate("/") },
    { key: "category", label: "탐색", onClick: () => navigate("/explore") },
    { key: "chat", label: "채팅", onClick: () => navigate("/chatlist") },
    {
      key: "community",
      label: "커뮤니티",
      onClick: () => {},
    },
    {
      key: "mypage",
      label: "마이페이지",
      onClick: () => {
        if (isAuthenticated) {
          navigate("/mypage");
        } else {
          navigate("/auth/login");
        }
      },
    },
  ];

  const path = location.pathname;
  const activeKey =
    path === "/"
      ? "home"
      : path.startsWith("/explore") || path.startsWith("/experts")
        ? "category"
        : path.startsWith("/category")
          ? "home"
      : path.startsWith("/chat")
        ? "chat"
          : path.startsWith("/reservation")
            ? "community"
            : path.startsWith("/mypage") || path.startsWith("/profile")
              ? "mypage"
              : "";

  return (
    <nav className="app-footer border-t border-[#f4f4f5] bg-white">
      <div className="mx-auto flex h-[69px] max-w-[420px] items-center justify-between px-4 pb-[12px] pt-[12px]">
        {navItems.map((item) => {
          const isActive = item.key === activeKey;
          const iconClass = `h-6 w-6 ${isActive ? "text-[#0f0f10]" : "text-[#aeb0b6]"}`;
          return (
            <button
              key={item.key}
              onClick={item.onClick}
              className="flex flex-1 flex-col items-center gap-1"
            >
              {item.key === "home" && <HomeIcon className={iconClass} />}
              {item.key === "category" && (
                <ExploreIcon className={iconClass} />
              )}
              {item.key === "chat" && <ChatIcon className={iconClass} />}
              {item.key === "community" && (
                <CommunityIcon className={iconClass} />
              )}
              {item.key === "mypage" && (
                <MypageIcon className={iconClass} />
              )}
              <span
                className={`text-[12px] ${
                  isActive ? "text-[#0f0f10] font-semibold" : "text-[#aeb0b6]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
