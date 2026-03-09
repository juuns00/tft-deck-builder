// ─────────────────────────────────────────────
//  ResultCard  (개선판)
//  • 매칭 근거 칩 + 한 줄 요약
//  • 챔피언 보유/미보유 하이라이트
//  • 핵심 아이템 빌드업 팝업
//  • 아이템 홀더 추천
//  • 난이도·플레이스타일 배지
// ─────────────────────────────────────────────
import { useState } from 'react';
import { champions, augments } from '../../data/index.js';
import { COST_COLOR, scoreColor, DIFFICULTY_LABEL, DIFFICULTY_COLOR, PLAY_STYLE_LABEL } from '../../utils/constants.js';
import { RankBadge, TierBadge, ScoreBar } from '../common/index.js';
import ChampionPortrait from './ChampionPortrait.jsx';

// ─── 매칭 태그 색상 ───────────────────────────
const TAG_STYLE = {
  champ:   { bg: '#60A5FA18', border: '#60A5FA44', color: '#60A5FA' },
  item:    { bg: '#F59E0B18', border: '#F59E0B44', color: '#F59E0B' },
  tier:    { bg: '#FFD70018', border: '#FFD70044', color: '#FFD700' },
  popular: { bg: '#F8717118', border: '#F8717144', color: '#F87171' },
};


// ─── 플레이스타일 배지 ────────────────────────
const PLAY_STYLE_COLOR = {
  'fast9':     '#60A5FA',
  'standard':  '#4ADE80',
  'slow-roll': '#C084FC',
};
const PLAY_STYLE_ICON = {
  'fast9':     '⚡',
  'standard':  '⚖️',
  'slow-roll': '🔄',
};

// ─── 소컴포넌트: 매칭 태그 칩 ─────────────────
function MatchTag({ tag }) {
  const s = TAG_STYLE[tag.type] ?? TAG_STYLE.tier;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      {tag.label}
    </span>
  );
}

// ─── 소컴포넌트: 아이템 빌드업 팝업 ──────────
function ItemBuildPopup({ itemBuild, onClose }) {
  if (!itemBuild) return null;
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center rounded-xl"
      style={{ background: 'rgba(6,11,20,0.93)', backdropFilter: 'blur(4px)' }}
    >
      <div className="w-[88%] rounded-xl border border-[#F59E0B44] p-4"
        style={{ background: '#0D1828' }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[#F59E0B] text-sm">🔨</span>
            <span className="text-[12px] font-extrabold text-[#E2E8F0]">핵심 아이템 빌드업</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#475569] hover:text-[#E2E8F0] text-xs transition-colors bg-transparent border-none cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* 조언 */}
        <div className="rounded-lg px-3 py-2.5 mb-3"
          style={{ background: '#F59E0B11', border: '1px solid #F59E0B33' }}>
          <p className="text-[11px] text-[#FCD34D] leading-relaxed font-medium">
            💡 {itemBuild.advice}
          </p>
        </div>

        {/* 완성 가능한 아이템 */}
        {itemBuild.craftable.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] text-[#4ADE80] font-bold mb-1.5">✓ 지금 만들 수 있어요</p>
            <div className="flex flex-wrap gap-1">
              {itemBuild.craftable.map(name => (
                <span key={name}
                  className="rounded px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: '#4ADE8018', border: '1px solid #4ADE8044', color: '#4ADE80' }}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 거의 완성 */}
        {itemBuild.almost.length > 0 && (
          <div>
            <p className="text-[10px] text-[#FACC15] font-bold mb-1.5">⚡ 재료 1개만 더 있으면</p>
            <div className="flex flex-wrap gap-1">
              {itemBuild.almost.map(name => (
                <span key={name}
                  className="rounded px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: '#FACC1518', border: '1px solid #FACC1544', color: '#FACC15' }}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────
/**
 * @param {object}   comp       - useRecommend 결과 객체
 * @param {number}   rank       - 순위 (1~3)
 * @param {boolean}  expanded   - 상세 펼침 여부
 * @param {function} onToggle   - 펼침 토글 핸들러
 */
export default function ResultCard({ comp, rank, expanded, onToggle }) {
  const [showItemBuild, setShowItemBuild] = useState(false);
  const sc = scoreColor(comp.score);

  const diffColor = DIFFICULTY_COLOR[comp.difficulty] ?? '#94A3B8';
  const diffLabel = DIFFICULTY_LABEL[comp.difficulty] ?? comp.difficulty ?? '';

  return (
    <div
      className="result-card relative overflow-hidden"
      style={{
        background: rank === 1 ? '#0D1828' : '#060B14',
        border:     `1px solid ${rank === 1 ? '#FFD70044' : '#1E293B'}`,
      }}
    >
      {/* ── 아이템 빌드업 팝업 오버레이 ── */}
      {showItemBuild && (
        <ItemBuildPopup
          itemBuild={comp.itemBuild}
          onClose={() => setShowItemBuild(false)}
        />
      )}

      {/* ── 헤더 ── */}
      <button
        onClick={onToggle}
        className="w-full bg-transparent border-none px-3.5 py-3 cursor-pointer text-left flex items-center justify-between gap-2.5"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <RankBadge rank={rank} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14px] font-extrabold text-[#E2E8F0] truncate">
                {comp.name}
              </span>
              <TierBadge tier={comp.tier} />
            </div>

            {/* 난이도 & 플레이스타일 배지 */}
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              {diffLabel && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{ background: diffColor + '18', border: `1px solid ${diffColor}44`, color: diffColor }}
                >
                  난이도: {diffLabel}
                </span>
              )}
              {comp.playStyle && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{
                    background: (PLAY_STYLE_COLOR[comp.playStyle] ?? '#94A3B8') + '18',
                    border: `1px solid ${(PLAY_STYLE_COLOR[comp.playStyle] ?? '#94A3B8')}44`,
                    color: PLAY_STYLE_COLOR[comp.playStyle] ?? '#94A3B8',
                  }}
                >
                  {PLAY_STYLE_ICON[comp.playStyle]} {PLAY_STYLE_LABEL[comp.playStyle] ?? comp.playStyle}
                </span>
              )}
              <span className="text-[#334155] text-[9px]">
                챔 {comp.matchedChamps}/{comp.champIds.length}
                {comp.winRate > 0 && ` · 승률 ${Math.round(comp.winRate * 100)}%`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div
              className="text-[22px] font-black leading-none"
              style={{ color: sc, textShadow: `0 0 12px ${sc}66` }}
            >
              {comp.score}
            </div>
            <div className="text-[9px] text-border">/ 100</div>
          </div>
          <span
            className="text-border-subtle text-[11px] inline-block transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* ── 점수 바 ── */}
      <div className="px-3.5 pb-2">
        <ScoreBar score={comp.score} />
      </div>

      {/* ── 매칭 근거 칩 ── */}
      {comp.matchTags?.length > 0 && (
        <div className="px-3.5 pb-2 flex flex-wrap gap-1">
          {comp.matchTags.map((tag, i) => (
            <MatchTag key={i} tag={tag} />
          ))}
        </div>
      )}

      {/* ── Coach's Tip (매칭 요약) ── */}
      {comp.matchSummary && (
        <div
          className="mx-3.5 mb-3 rounded-lg px-3 py-2"
          style={{ background: '#FFFFFF08', border: '1px solid #FFFFFF10' }}
        >
          <div className="flex items-start gap-1.5">
            <span className="text-[11px] shrink-0 mt-0.5">🎯</span>
            <p className="text-[10px] text-[#CBD5E1] leading-relaxed">
              <span className="text-[#FFD700] font-bold">Coach&apos;s Tip</span>
              &nbsp;·&nbsp;{comp.matchSummary}
            </p>
          </div>
        </div>
      )}

      {/* ── 챔피언 미리보기 (보유/미보유 하이라이트) ── */}
      <div className="px-3.5 pb-3 flex flex-wrap gap-1">
        {comp.champIds.map(id => {
          const champ   = champions.find(c => c.id === id);
          if (!champ) return null;
          const owned   = comp.matchedChampIds?.includes(id) ?? false;
          const missing = comp.missingChamps.includes(id);
          return (
            <ChampionPortrait
              key={id}
              champion={champ}
              selected={owned}
              missing={missing}
              size="sm"
            />
          );
        })}
      </div>

      {/* ── 핵심 아이템 빌드업 버튼 (부품 보유시만 표시) ── */}
      {comp.itemBuild && (
        <div className="px-3.5 pb-3">
          <button
            onClick={e => { e.stopPropagation(); setShowItemBuild(true); }}
            className="w-full rounded-lg py-2 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all duration-150 border-none cursor-pointer"
            style={{
              background: '#F59E0B15',
              border:     '1px solid #F59E0B44',
              color:      '#F59E0B',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F59E0B25'}
            onMouseLeave={e => e.currentTarget.style.background = '#F59E0B15'}
          >
            🔨 핵심 아이템 빌드업 보기
          </button>
        </div>
      )}

      {/* ── 아이템 홀더 추천 ── */}
      {comp.holderAdvice && (
        <div
          className="mx-3.5 mb-3 rounded-lg px-3 py-2 flex items-start gap-1.5"
          style={{ background: '#C084FC11', border: '1px solid #C084FC33' }}
        >
          <span className="text-[11px] shrink-0 mt-0.5">🛡️</span>
          <p className="text-[10px] text-[#D4B4FE] leading-relaxed">
            <span className="text-[#C084FC] font-bold">임시 홀더</span>
            &nbsp;·&nbsp;{comp.holderAdvice.advice}
          </p>
        </div>
      )}

      {/* ── 상세 펼침 ── */}
      {expanded && (
        <div className="border-t border-border px-3.5 py-3 animate-fade-up">

          {/* 세부 점수 */}
          <div className="flex gap-1.5 mb-3">
            {[
              { l: '챔피언', v: comp.champScore, m: 50, c: '#60A5FA' },
              { l: '아이템', v: comp.itemScore,  m: 30, c: '#F59E0B' },
              { l: '증강',   v: comp.augScore,   m: 20, c: '#C084FC' },
            ].map(({ l, v, m, c }) => (
              <div key={l} className="score-box">
                <div className="text-[9px] text-muted mb-1">{l}</div>
                <div className="text-[15px] font-extrabold leading-none" style={{ color: c }}>{v}</div>
                <div className="text-[9px] text-border">/{m}</div>
              </div>
            ))}
          </div>

          {/* 부족한 챔피언 */}
          {comp.missingChamps.length > 0 && (
            <div className="bg-panel border border-border rounded-lg px-3 py-2 mb-2.5">
              <p className="text-[10px] text-[#94A3B8] font-bold mb-1.5">
                🛒 앞으로 구해야 할 챔피언 {comp.missingChamps.length}명
              </p>
              <div className="flex flex-wrap gap-1">
                {comp.missingChamps.map(id => {
                  const champ = champions.find(c => c.id === id);
                  if (!champ) return null;
                  const cc = COST_COLOR[champ.cost] ?? '#94A3B8';
                  return (
                    <span
                      key={id}
                      className="rounded px-2 py-0.5 text-[11px]"
                      style={{
                        background: cc + '18',
                        border:     `1px solid ${cc}44`,
                        color:      cc + 'BB',
                      }}
                    >
                      {champ.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* 추천 증강 */}
          {comp.augments?.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] text-muted mb-1.5">추천 증강체</p>
              <div className="flex flex-wrap gap-1">
                {comp.augments.slice(0, 5).map(augId => {
                  const aug     = augments.find(a => a.id === augId);
                  const matched = comp.matchedAugs > 0;
                  return aug ? (
                    <span
                      key={augId}
                      className="rounded px-2 py-0.5 text-[11px]"
                      style={{
                        background: matched ? '#C084FC15' : '#0A0F1A',
                        border:     `1px solid ${matched ? '#C084FC33' : '#1E293B'}`,
                        color:      matched ? '#C084FC' : '#475569',
                      }}
                    >
                      {aug.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}