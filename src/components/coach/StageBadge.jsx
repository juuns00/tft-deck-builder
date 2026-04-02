// ─────────────────────────────────────────────
//  StageBadge  (src/components/coach/StageBadge.jsx)
//  스테이지별 피벗 가능/불가 전략 힌트 뱃지
// ─────────────────────────────────────────────
import { parseStage } from '../../utils/coachLogic.js';

/**
 * @param {string|null} round - 현재 라운드 문자열 (예: '3-2', '4-5')
 */
export default function StageBadge({ round }) {
  const isLate = parseStage(round) >= 4;
  return isLate ? (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{ background: '#F8717111', border: '1px solid #F8717130' }}
    >
      <p className="m-0 text-[12px] font-bold text-[#F87171]">🚫 4스테이지+ 피벗 금지</p>
      <p className="m-0 text-[11px] text-[#64748B] mt-1">현재 덱 최적화와 순방(4등 이내) 집중</p>
    </div>
  ) : (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{ background: '#4ADE8011', border: '1px solid #4ADE8030' }}
    >
      <p className="m-0 text-[12px] font-bold text-[#4ADE80]">✅ 피벗 가능 구간</p>
      <p className="m-0 text-[11px] text-[#64748B] mt-1">아이템·기물 일치도 보고 과감한 덱 전환 OK</p>
    </div>
  );
}
