// ─────────────────────────────────────────────
//  CoachPage  (src/pages/CoachPage.jsx)
//  TFT AI 실시간 코치 — The Live Analyst
//
//  의존:
//    hooks/useCoach.js
//    components/coach/index.js
//    utils/coachLogic.js  (parseStage)
//    utils/coachConstants.js (SIGNAL_META)
// ─────────────────────────────────────────────
import { useCoach }         from '../hooks/useCoach.js';
import { parseStage }       from '../utils/coachLogic.js';
import {
  StatCard,
  ChampBadge,
  SignalLight,
  SignalPreview,
  MatchBar,
  CoachBox,
  UploadZone,
} from '../components/coach/index.js';

// ─── 전역 CSS 애니메이션 (한 번만 주입) ────────
const GLOBAL_STYLES = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes coachBounce {
    0%, 100% { transform: translateY(0);   opacity: 0.4; }
    50%       { transform: translateY(-4px); opacity: 1;   }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  .fade-in { animation: fadeIn 0.4s ease both; }
`;

// ─── 서브 UI ────────────────────────────────────

/** 에러 배너 */
function ErrorBanner({ message }) {
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

/** 스테이지별 피벗 가능/불가 힌트 */
function StageBadge({ round }) {
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

/** 사용 방법 가이드 카드 */
function UsageGuide() {
  const steps = [
    ['📸', '게임 스크린샷 업로드 또는 Ctrl+V'],
    ['⚡', 'AI 분석 시작 클릭'],
    ['💬', '실시간 팩폭 조언 확인'],
  ];
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">📖</span>
        <span className="text-[11px] font-black tracking-widest uppercase text-[#334155]">
          사용 방법
        </span>
      </div>
      <ol className="m-0 p-0 list-none flex flex-col gap-2">
        {steps.map(([icon, text], i) => (
          <li key={i} className="flex items-center gap-2.5">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
              style={{ background: '#1E293B', color: '#475569' }}
            >
              {i + 1}
            </span>
            <span className="text-[11px] text-[#334155]">{icon} {text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 코칭 철학 카드 */
function CoachPhilosophy() {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(145deg, #0F1929, #060B14)',
        border:     '1px solid #1E3A5F',
      }}
    >
      <p className="m-0 text-[10px] font-black tracking-widest uppercase text-[#1E3A5F] mb-2">
        코칭 철학
      </p>
      <p className="m-0 text-[12px] text-[#334155] leading-relaxed">
        무분별한 덱 전환 지양.<br />
        <span style={{ color: '#FFD700' }}>현재 라운드와 피 관리를 최우선</span>으로 하는<br />
        현실적 코칭을 제공합니다.
      </p>
    </div>
  );
}

// ─── 메인 페이지 ────────────────────────────────
export default function CoachPage() {
  const {
    imageUrl,   setImage,
    scanResult, deckScore, bestComp, signal, advice,
    isScanning, isAdvising,
    error,
    analyze,
  } = useCoach();

  const hasScan        = !!scanResult;
  const bestCompChampSet = new Set(
    (bestComp?.champions || []).map(c => c.name.toLowerCase())
  );

  return (
    <div className="min-h-screen text-[#E2E8F0]" style={{ background: '#060B14' }}>
      <style>{GLOBAL_STYLES}</style>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 pb-28 md:pb-10">

        {/* ── 페이지 헤더 ── */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] tracking-[3px] font-bold uppercase mb-3"
            style={{ background: '#FFD70011', border: '1px solid #FFD70033', color: '#FFD700' }}
          >
            ✦ AI 실시간 분석 · The Live Analyst
          </div>
          <h1
            className="m-0 font-black tracking-tight text-[clamp(22px,5vw,32px)] leading-tight"
            style={{
              background:           'linear-gradient(135deg, #FFD700 0%, #F59E0B 50%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
            }}
          >
            실시간 코칭
          </h1>
          <p className="text-[13px] text-[#334155] mt-1 m-0">
            스크린샷 올리면 AI가 지금 당장 해야 할 행동을 알려줌
          </p>
        </div>

        {/* ── 3단 그리드 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_300px] gap-5">

          {/* ─── 좌: 이미지 업로드 ─── */}
          <div className="flex flex-col gap-4">

            {/* 업로드 패널 */}
            <div
              className="rounded-2xl p-4"
              style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[3px] h-4 rounded-sm" style={{ background: '#60A5FA' }} />
                <span className="text-[12px] font-black tracking-widest uppercase text-[#E2E8F0]">
                  게임 스크린샷
                </span>
              </div>
              <UploadZone
                onImage={setImage}
                imageUrl={imageUrl}
                isScanning={isScanning}
              />
            </div>

            {/* 분석 시작 버튼 */}
            <button
              onClick={analyze}
              disabled={isScanning || isAdvising || !imageUrl}
              className="w-full rounded-2xl py-4 text-[14px] font-black tracking-widest uppercase transition-all duration-200"
              style={{
                background: (isScanning || isAdvising || !imageUrl)
                  ? '#1E293B'
                  : 'linear-gradient(135deg, #FFD700, #F59E0B)',
                color:  (isScanning || isAdvising || !imageUrl) ? '#334155' : '#000',
                cursor: (isScanning || isAdvising || !imageUrl) ? 'not-allowed' : 'pointer',
                boxShadow: (!isScanning && !isAdvising && imageUrl)
                  ? '0 0 24px #FFD70033' : 'none',
              }}
            >
              {isScanning  ? '🔍 스캔 중…'
               : isAdvising ? '💬 조언 작성 중…'
               : '⚡ AI 분석 시작'}
            </button>

            <ErrorBanner message={error} />

            {/* 감지된 유닛 목록 */}
            {hasScan && !!scanResult.units?.length && (
              <div
                className="rounded-2xl p-4 fade-in"
                style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-[3px] h-4 rounded-sm" style={{ background: '#C084FC' }} />
                  <span className="text-[12px] font-black tracking-widest uppercase text-[#E2E8F0]">
                    감지된 유닛
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold ml-1"
                    style={{ background: '#C084FC22', color: '#C084FC' }}
                  >
                    {scanResult.units.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {scanResult.units.map((u, i) => (
                    <ChampBadge
                      key={i}
                      name={u.name}
                      star={u.star}
                      inBestComp={bestCompChampSet.has(u.name.toLowerCase())}
                    />
                  ))}
                </div>

                {/* 아이템 목록 */}
                {scanResult.items?.length > 0 && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid #1E293B' }}>
                    <p className="text-[10px] text-[#334155] font-bold uppercase tracking-widest mb-2">
                      아이템
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.items.map((item, i) => (
                        <span
                          key={i}
                          className="rounded-lg px-2 py-1 text-[10px] font-bold"
                          style={{
                            background: '#FACC1511',
                            border:     '1px solid #FACC1530',
                            color:      '#FACC15',
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── 중: 상태 분석 ─── */}
          <div className="flex flex-col gap-4">

            {/* 현재 상태 카드 */}
            <div
              className="rounded-2xl p-4"
              style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[3px] h-4 rounded-sm" style={{ background: '#FACC15' }} />
                <span className="text-[12px] font-black tracking-widest uppercase text-[#E2E8F0]">
                  현재 상태
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                <StatCard
                  icon="⚔️" label="라운드"
                  value={hasScan ? scanResult.round : null}
                  color="#60A5FA"
                />
                <StatCard
                  icon="💰" label="골드"
                  value={hasScan ? `${scanResult.gold}G` : null}
                  color="#FACC15"
                />
                <StatCard
                  icon="❤️" label="체력"
                  value={hasScan ? scanResult.hp : null}
                  color={hasScan && parseInt(scanResult.hp) <= 30 ? '#F87171' : '#4ADE80'}
                />
              </div>

              {hasScan && (
                <div className="fade-in">
                  <MatchBar score={deckScore} bestCompName={bestComp?.name} />
                </div>
              )}
            </div>

            {/* 신호등 */}
            {signal
              ? <div className="fade-in"><SignalLight signal={signal} /></div>
              : <SignalPreview />
            }

            {/* 스테이지 전략 힌트 */}
            {hasScan && (
              <div
                className="rounded-2xl p-4 fade-in"
                style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-[3px] h-4 rounded-sm" style={{ background: '#FB923C' }} />
                  <span className="text-[12px] font-black tracking-widest uppercase text-[#E2E8F0]">
                    스테이지 전략
                  </span>
                </div>
                <StageBadge round={scanResult.round} />
              </div>
            )}
          </div>

          {/* ─── 우: AI 코치 조언 ─── */}
          <div className="flex flex-col gap-4">
            <CoachBox advice={advice} isLoading={isAdvising} />
            <UsageGuide />
            <CoachPhilosophy />
          </div>
        </div>
      </div>
    </div>
  );
}