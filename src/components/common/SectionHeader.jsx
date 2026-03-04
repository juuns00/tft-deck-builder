// ─────────────────────────────────────────────
//  SectionHeader
//  입력 패널 섹션 헤더 — 제목 + 선택 카운트 + 초기화 버튼
// ─────────────────────────────────────────────

/**
 * @param {string}      title    - 섹션 제목
 * @param {string}      color    - 제목/뱃지 색상
 * @param {number}      count    - 현재 선택된 수
 * @param {number}      [total]  - 전체 수 (있으면 "3/14" 형식으로 표시)
 * @param {function}    onClear  - 초기화 버튼 클릭 핸들러
 */
export default function SectionHeader({ title, color, count, total, onClear }) {
  return (
    <div style={{
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      marginBottom:   10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{title}</span>

        {count > 0 && (
          <span style={{
            background:   color + "22",
            color,
            borderRadius: 99,
            padding:      "1px 8px",
            fontSize:     11,
            fontWeight:   700,
          }}>
            {total !== undefined ? `${count}/${total}` : count}
          </span>
        )}
      </div>

      {count > 0 && (
        <button
          onClick={onClear}
          style={{
            background:   "none",
            border:       "1px solid #1E293B",
            borderRadius: 5,
            color:        "#475569",
            fontSize:     10,
            padding:      "2px 8px",
            cursor:       "pointer",
            transition:   "color 0.1s",
          }}
        >
          초기화
        </button>
      )}
    </div>
  );
}
