import { NavLink, useLocation } from "react-router-dom";

export const NAV_ITEMS = [
  {
    to:      "/",
    icon:    "🎯",
    label:   "덱 추천",
    desc:    "보유 챔피언·아이템으로 최적 덱 추천",
    status:  "live",
  },
  {
    to:      "/comps",
    icon:    "📊",
    label:   "티어표",
    desc:    "현재 시즌 메타 덱 전체 목록",
    status:  "live",
  },
  {
    to:      "/coach",
    icon:    "🧠",
    label:   "실시간 코칭",
    desc:    "스크린샷 올리면 AI가 행동 지침 제공",
    status:  "soon",
    preview: [
      "📸 게임 스크린샷 업로드",
      "🤖 AI 상황 분석",
      "🟢🟡🔴 피벗 신호등",
      "💬 실시간 팩폭 코칭",
    ],
  },
  {
    to:      "/placement",
    icon:    "🗺️",
    label:   "배치 가이드",
    desc:    "상대 딜러 위치별 최적 배치 시뮬레이터",
    status:  "soon",
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
    <nav
      className="sticky top-0 z-50 border-b border-border"
      style={{ background: "#060B14f0", backdropFilter: "blur(12px)" }}
    >
      {/* 3열 그리드: 로고 | 메뉴(중앙) | 빈칸 */}
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-3 items-center h-20">

        {/* 로고 (왼쪽) */}
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

        {/* 메뉴 (정중앙) */}
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
                {/* 아이콘 */}
                <span
                  className="text-2xl leading-none"
                  style={{ filter: isSoon ? "grayscale(1) opacity(0.35)" : "none" }}
                >
                  {item.icon}
                </span>

                {/* 라벨 */}
                <span
                  className="text-[12px] font-bold whitespace-nowrap"
                  style={{
                    color: isSoon   ? "#2D3F55"
                         : isActive ? "#FFD700"
                         : "#64748B",
                  }}
                >
                  {item.label}
                </span>

                {/* 준비중 뱃지 */}
                {isSoon && (
                  <span className="absolute -top-1 -right-1 text-[8px] font-bold text-[#475569] bg-[#1E293B] border border-[#334155] rounded-full px-1.5 py-0.5 leading-none">
                    SOON
                  </span>
                )}

                {/* 활성 언더라인 */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full"
                    style={{ background: "#FFD700" }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* 오른쪽 여백 (균형용) */}
        <div />

      </div>
    </nav>
  );
}