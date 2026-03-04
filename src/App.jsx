import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import RecommendPage from "./pages/RecommendPage.jsx";

// ── 네비게이션 바 ─────────────────────────────────────────────────────────

function NavBar() {
  const linkStyle = ({ isActive }) => ({
    display:      "inline-flex",
    alignItems:   "center",
    gap:          5,
    padding:      "6px 14px",
    borderRadius: 8,
    fontSize:     13,
    fontWeight:   isActive ? 700 : 400,
    color:        isActive ? "#FFD700" : "#64748B",
    background:   isActive ? "#FFD70012" : "none",
    border:       `1px solid ${isActive ? "#FFD70033" : "transparent"}`,
    textDecoration: "none",
    transition:   "all 0.15s",
  });

  return (
    <nav style={{
      position:   "sticky", top: 0, zIndex: 100,
      background: "#060B14ee",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #1E293B",
    }}>
      <div style={{
        maxWidth: 900, margin: "0 auto",
        padding: "10px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* 로고 */}
        <div style={{
          fontSize: 14, fontWeight: 900, letterSpacing: -0.5,
          background: "linear-gradient(135deg,#FFD700,#F59E0B)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          TFT 덱 추천기
        </div>

        {/* 메뉴 */}
        <div style={{ display: "flex", gap: 4 }}>
          <NavLink to="/"     style={linkStyle}>🎯 추천</NavLink>
          <NavLink to="/tier" style={linkStyle}>📊 티어표</NavLink>
        </div>
      </div>
    </nav>
  );
}

// ── 준비 중 페이지 (티어표 등 미구현 페이지용) ───────────────────────────

function ComingSoon({ title }) {
  return (
    <div style={{
      minHeight: "80vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      color: "#334155", fontFamily: "'Noto Sans KR','Malgun Gothic',sans-serif",
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#475569" }}>{title}</div>
      <div style={{ fontSize: 13 }}>준비 중입니다</div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ background: "#060B14", minHeight: "100vh" }}>
        <NavBar />
        <Routes>
          <Route path="/"     element={<RecommendPage />} />
          <Route path="/tier" element={<ComingSoon title="티어표" />} />
          {/* 추후 추가 */}
          {/* <Route path="/comp/:id" element={<CompDetailPage />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}