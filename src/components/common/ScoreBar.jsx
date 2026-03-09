// ─────────────────────────────────────────────
//  ScoreBar
//  점수(0~100)를 시각적으로 표시하는 진행 바
// ─────────────────────────────────────────────
import { scoreColor } from '../../utils/constants.js';

/**
 * @param {number}  score       - 0 ~ 100
 * @param {number}  [height]    - 바 높이 px (기본 5)
 * @param {boolean} [showLabel] - 점수 숫자 표시 여부 (기본 false)
 */
export default function ScoreBar({ score, height = 5, showLabel = false }) {
  const color = scoreColor(score);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-[11px] text-[#475569]">매칭도</span>
          <span
            className="text-[16px] font-black"
            style={{ color, textShadow: `0 0 8px ${color}55` }}
          >
            {score}
            <span className="text-[10px] text-[#334155] font-normal">/100</span>
          </span>
        </div>
      )}
      <div
        className="rounded-full overflow-hidden bg-[#1E293B]"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width:      `${Math.min(score, 100)}%`,
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            boxShadow:  `0 0 6px ${color}77`,
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>
    </div>
  );
}