// ─────────────────────────────────────────────
//  ChampionPortrait
//  이미지 + 이름바 + 선택/부족 오버레이가 있는
//  챔피언 포트레이트 버튼 (추천 페이지 전용)
// ─────────────────────────────────────────────
import { useState } from 'react';
import { COST_COLOR } from '../../utils/constants.js';

/**
 * @param {{ id, name, cost, icon }} champion
 * @param {boolean}  selected       - 선택(보유) 여부
 * @param {function} onClick        - 클릭 핸들러
 * @param {boolean}  [missing]      - 덱에 부족한 챔피언 표시
 * @param {string}   [size]         - 'sm' | 'md' | 'lg' (기본 'md')
 */
export default function ChampionPortrait({
  champion,
  selected,
  onClick,
  missing = false,
  size = 'md',
}) {
  const cost  = champion.cost ?? 1;
  const color = missing ? '#F87171' : COST_COLOR[cost] ?? '#94A3B8';
  const dim   = size === 'sm' ? 42 : size === 'lg' ? 58 : 50;
  const [imgErr, setImgErr] = useState(false);

  return (
    <button
      onClick={onClick}
      title={`${champion.name} (${cost}코스트)`}
      className="champ-portrait"
      style={{
        width:      dim,
        height:     dim,
        border:     `2px solid ${selected || missing ? color : '#1E293B'}`,
        background: selected ? color + '28' : '#0A0F1A',
        boxShadow:  selected ? `0 0 10px ${color}55` : 'none',
        opacity:    missing ? 0.6 : 1,
      }}
    >
      {/* 챔피언 이미지 */}
      {champion.icon && !imgErr ? (
        <img
          src={champion.icon}
          alt={champion.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover block"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-center break-all p-0.5"
          style={{ fontSize: size === 'sm' ? 9 : 11, color }}
        >
          {champion.name}
        </div>
      )}

      {/* 하단 이름 바 */}
      <div
        className="absolute bottom-0 left-0 right-0 text-white font-extrabold text-center overflow-hidden text-ellipsis whitespace-nowrap"
        style={{
          background: `linear-gradient(transparent, ${color}99 40%, ${color}CC)`,
          fontSize:   size === 'sm' ? 8 : 9,
          lineHeight: size === 'sm' ? '14px' : '16px',
          padding:    size === 'sm' ? '6px 2px 1px' : '8px 2px 2px',
          textShadow: '0 1px 3px #0008',
        }}
      >
        {champion.name}
      </div>

      {/* 선택 체크 */}
      {selected && (
        <div
          className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center text-black font-black"
          style={{ background: color, fontSize: 7 }}
        >
          ✓
        </div>
      )}

      {/* 부족 오버레이 */}
      {missing && (
        <div
          className="absolute inset-0 flex items-center justify-center text-base"
          style={{ background: '#F8711133' }}
        >
          ✕
        </div>
      )}
    </button>
  );
}
