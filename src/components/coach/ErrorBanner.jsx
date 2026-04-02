// ─────────────────────────────────────────────
//  ErrorBanner  (src/components/coach/ErrorBanner.jsx)
//  에러 메시지 배너 — message가 없으면 null 반환
// ─────────────────────────────────────────────

/**
 * @param {string} message - 표시할 에러 메시지 (없으면 렌더 안 함)
 */
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-[12px] font-bold fade-in"
      style={{ background: '#F8717115', border: '1px solid #F8717140', color: '#F87171' }}
    >
      ⚠️ {message}
    </div>
  );
}
