import { NavLink, useLocation } from "react-router-dom";

export const NAV_ITEMS = [
  {
    to:     "/",
    icon:   "🎯",
    label:  "덱 추천",
    desc:   "보유 챔피언·아이템으로 최적 덱 추천",
    status: "live",
  },
  {
    to:     "/comps",
    icon:   "📊",
    label:  "티어표",
    desc:   "현재 시즌 메타 덱 전체 목록",
    status: "live",
  },
  {
    to:     "/coach",
    icon:   "🧠",
    label:  "실시간 코칭",
    desc:   "스크린샷 올리면 AI가 행동 지침 제공",
    status: "soon",
    preview: [
      "📸 게임 스크린샷 업로드",
      "🤖 Gemini AI 상황 분석",
      "🟢🟡🔴 피벗 신호등",
      "💬 실시간 팩폭 코칭",
    ],
  },
  {
    to:     "/placement",
    icon:   "🗺️",
    label:  "배치 가이드",
    desc:   "상대 딜러 위치별 최적 배치 시뮬레이터",
    status: "soon",
    preview: [
      "🗺️ 7×4 바둑판 배치 UI",
      "🎯 상대 딜러 위치 선택",
      "↗️ 최적 배치 화살표 표시",
      "📌 주요 기물 배치 팁",
    ],
  },
];

export default function NavBar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* ── 데스크탑 상단 NavBar (md 이상) ── */}
      <nav
        className="hidden md:block sticky top-0 z-50 border-b border-border"
        style={{ background: "#060B14f0", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-3 items-center h-20">

          {/* 로고 */}
          <NavLink to="/" className="no-underline flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <div
                className="text-[18px] font-black tracking-tight leading-tight"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #F59E0B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TFT 1타 강사
              </div>
              <div className="text-[10px] text-[#334155] tracking-[2px] uppercase">
                One-Tap Coach
              </div>
            </div>
          </NavLink>

          {/* 메뉴 (중앙) */}
          <div className="flex items-center justify-center gap-1">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.to;
              const isSoon   = item.status === "soon";
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.desc}
                  className="relative flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-xl no-underline transition-all duration-150 min-w-[80px]"
                  style={{
                    background: isActive ? "#FFD70014" : "transparent",
                    border:     `1px solid ${isActive ? "#FFD70033" : "transparent"}`,
                  }}
                >
                  <span className="text-2xl leading-none"
                    style={{ filter: isSoon ? "grayscale(1) opacity(0.35)" : "none" }}>
                    {item.icon}
                  </span>
                  <span className="text-[12px] font-bold whitespace-nowrap"
                    style={{
                      color: isSoon   ? "#2D3F55"
                           : isActive ? "#FFD700"
                           : "#64748B",
                    }}>
                    {item.label}
                  </span>
                  {isSoon && (
                    <span className="absolute -top-1 -right-1 text-[8px] font-bold text-[#475569] bg-[#1E293B] border border-[#334155] rounded-full px-1.5 py-0.5 leading-none">
                      SOON
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full"
                      style={{ background: "#FFD700" }} />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* 오른쪽 균형용 */}
          <div />
        </div>
      </nav>

      {/* ── 모바일 상단 로고바 (md 미만) ── */}
      <header
        className="md:hidden sticky top-0 z-50 border-b border-border flex items-center justify-center h-14"
        style={{ background: "#060B14f0", backdropFilter: "blur(12px)" }}
      >
        <NavLink to="/" className="no-underline flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div
            className="text-[16px] font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #FFD700, #F59E0B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            TFT 1타 강사
          </div>
        </NavLink>
      </header>

      {/* ── 모바일 하단 탭바 (md 미만) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border"
        style={{ background: "#060B14f8", backdropFilter: "blur(12px)" }}
      >
        <div className="grid grid-cols-4 h-16">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.to;
            const isSoon   = item.status === "soon";
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative flex flex-col items-center justify-center gap-1 no-underline transition-all duration-150"
                style={{
                  background: isActive ? "#FFD70010" : "transparent",
                  borderTop:  `2px solid ${isActive ? "#FFD700" : "transparent"}`,
                }}
              >
                <span className="text-xl leading-none"
                  style={{ filter: isSoon ? "grayscale(1) opacity(0.35)" : "none" }}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold whitespace-nowrap"
                  style={{
                    color: isSoon   ? "#2D3F55"
                         : isActive ? "#FFD700"
                         : "#64748B",
                  }}>
                  {item.label}
                </span>
                {isSoon && (
                  <span className="absolute top-1 right-3 text-[7px] font-bold text-[#475569] bg-[#1E293B] border border-[#334155] rounded-full px-1 leading-none py-0.5">
                    SOON
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* 모바일 하단 탭바 높이만큼 여백 */}
      <div className="md:hidden h-16" />
    </>
  );
}