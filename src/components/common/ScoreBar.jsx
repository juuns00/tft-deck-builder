// ─────────────────────────────────────────────
//  ScoreBar
//  점수(0~100)를 시각적으로 표시하는 진행 바
// ─────────────────────────────────────────────

const scoreColor = (s) =>
  s >= 75 ? "#4ADE80" :
  s >= 50 ? "#FACC15" :
  s >= 25 ? "#FB923C" : "#94A3B8";

/**
 * @param {number}  score       - 0 ~ 100
 * @param {number}  [height]    - 바 높이 px (기본 5)
 * @param {boolean} [showLabel] - 점수 숫자 표시 여부 (기본 false)
 */
export default function ScoreBar({ score, height = 5, showLabel = false }) {
  const color = scoreColor(score);

  return (
    <div style={{ width: "100%" }}>
      {showLabel && (
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "baseline",
          marginBottom:   4,
        }}>
          <span style={{ fontSize: 11, color: "#475569" }}>매칭도</span>
          <span style={{
            fontSize:   16,
            fontWeight: 900,
            color,
            textShadow: `0 0 8px ${color}55`,
          }}>
            {score}<span style={{ fontSize: 10, color: "#334155", fontWeight: 400 }}>/100</span>
          </span>
        </div>
      )}
      <div style={{
        height,
        background:   "#1E293B",
        borderRadius: 99,
        overflow:     "hidden",
      }}>
        <div style={{
          width:      `${Math.min(score, 100)}%`,
          height:     "100%",
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          borderRadius: 99,
          transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow:  `0 0 6px ${color}77`,
        }} />
      </div>
    </div>
  );
}
