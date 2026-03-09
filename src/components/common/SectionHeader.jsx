// ─────────────────────────────────────────────
//  SectionHeader
//  패널 섹션 헤더 — 제목 + 선택 카운트 + 초기화 버튼
// ─────────────────────────────────────────────

/**
 * @param {string}   title       - 섹션 제목
 * @param {string}   color       - 제목/뱃지 강조 색상
 * @param {number}   [count]     - 현재 선택된 수
 * @param {number}   [total]     - 전체 수 (있으면 "3/14" 형식)
 * @param {function} [onClear]   - 초기화 버튼 클릭 핸들러
 */
export default function SectionHeader({ title, color, count, total, onClear }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div
          className="w-[3px] h-4 rounded-sm shrink-0"
          style={{ background: color }}
        />
        <span className="text-[13px] font-extrabold text-[#E2E8F0]">{title}</span>

        {count != null && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{ background: color + '22', color }}
          >
            {count}{total != null ? `/${total}` : ''}
          </span>
        )}
      </div>

      {onClear && count > 0 && (
        <button onClick={onClear} className="btn-clear">
          초기화
        </button>
      )}
    </div>
  );
}