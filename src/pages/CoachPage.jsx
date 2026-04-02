// ─────────────────────────────────────────────
//  CoachPage  (src/pages/CoachPage.jsx)
//  TFT AI 실시간 코치 — The Live Analyst
//
//  모드 분기:
//    isOverwolfMode = true  → Overwolf GEP 자동 수신, 조언 받기 버튼만
//    isOverwolfMode = false → 스크린샷 업로드 + AI 분석 시작
// ─────────────────────────────────────────────
import { useEffect, useCallback } from 'react';
import { useCoach }               from '../hooks/useCoach.js';
import {
  StatCard,
  ChampBadge,
  SignalLight,
  SignalPreview,
  MatchBar,
  CoachBox,
  UploadZone,
  ErrorBanner,
  StageBadge,
  CoachPhilosophy,
  UsageGuide,
  ShopPanel,
  OverwolfStatusPanel,
} from '../components/coach/index.js';

// ─── 전역 CSS 애니메이션 ────────────────────────
const GLOBAL_STYLES = `
  @keyframes coachBounce {
    0%, 100% { transform: translateY(0);   opacity: 0.4; }
    50%       { transform: translateY(-4px); opacity: 1;   }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.3); }
  }
  .fade-in { animation: fadeIn 0.4s ease both; }
`;

// ─── 메인 페이지 ────────────────────────────────
export default function CoachPage() {
  const {
    imageUrl,   setImage,
    scanResult, deckScore, bestComp, signal, advice,
    isScanning, isAdvising,
    isOverwolfMode,
    error,
    scan, requestAdvice,
  } = useCoach();

  const hasScan = !!scanResult;

  // 타겟 덱 챔피언 Set (ChampBadge 강조용)
  const bestCompChampSet = new Set(
    (bestComp?.champions || []).map(c => c.name.toLowerCase())
  );

  // 상점 강조용: bestComp 챔피언 이름 Set (ShopPanel에 전달)
  const neededNames = new Set(
    bestComp?.champions?.map(c => c.name) ?? []
  );

  // Overwolf 상점 슬롯
  const shopChamps = scanResult?.shopChamps ?? [];

  // 웹 모드: 스캔 완료 후 자동으로 AI 조언 요청
  // Overwolf 모드는 버튼 수동 트리거만 사용
  useEffect(() => {
    if (!isOverwolfMode && scanResult && !advice && !isAdvising) {
      requestAdvice();
    }
  }, [scanResult]); // eslint-disable-line react-hooks/exhaustive-deps

  // 웹 모드 분석 버튼 핸들러
  const handleAnalyze = useCallback(async () => {
    await scan();
  }, [scan]);

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
            {isOverwolfMode
              ? '✦ OVERWOLF 실시간 연동 · Live Mode'
              : '✦ AI 실시간 분석 · The Live Analyst'}
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
            {isOverwolfMode
              ? '게임 데이터 자동 수신 중 — 원할 때 조언 받기 버튼을 누르세요'
              : '스크린샷 올리면 AI가 지금 당장 해야 할 행동을 알려줌'}
          </p>
        </div>

        {/* ── 3단 그리드 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_300px] gap-5">

          {/* ─────────────────────────────────────
              좌 컬럼: 입력 + 버튼 + 유닛 목록
          ───────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* 모드별 입력 영역 */}
            {isOverwolfMode ? (
              <>
                <OverwolfStatusPanel hasScan={hasScan} scanResult={scanResult} />
                <ShopPanel shopChamps={shopChamps} neededNames={neededNames} />
              </>
            ) : (
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
            )}

            {/* 모드별 액션 버튼 */}
            {isOverwolfMode ? (
              <button
                onClick={requestAdvice}
                disabled={isAdvising || !hasScan}
                className="w-full rounded-2xl py-4 text-[14px] font-black tracking-widest uppercase transition-all duration-200"
                style={{
                  background: (isAdvising || !hasScan)
                    ? '#1E293B'
                    : 'linear-gradient(135deg, #FFD700, #F59E0B)',
                  color:     (isAdvising || !hasScan) ? '#334155' : '#000',
                  cursor:    (isAdvising || !hasScan) ? 'not-allowed' : 'pointer',
                  boxShadow: (!isAdvising && hasScan)  ? '0 0 24px #FFD70033' : 'none',
                }}
              >
                {isAdvising ? '💬 조언 작성 중…' : '💡 조언 받기'}
              </button>
            ) : (
              <button
                onClick={handleAnalyze}
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
            )}

            <ErrorBanner message={error} />

            {/* 감지된 유닛 목록 — 양 모드 공통 */}
            {hasScan && !!scanResult.units?.length && (
              <div
                className="rounded-2xl p-4 fade-in"
                style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-[3px] h-4 rounded-sm" style={{ background: '#C084FC' }} />
                  <span className="text-[12px] font-black tracking-widest uppercase text-[#E2E8F0]">
                    {isOverwolfMode ? '내 보드' : '감지된 유닛'}
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

                {/* 웹 모드: 아이템 flat 목록 */}
                {!isOverwolfMode && scanResult.items?.length > 0 && (
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

                {/* Overwolf 모드: 유닛별 아이템 */}
                {isOverwolfMode && scanResult.units.some(u => u.items?.length > 0) && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid #1E293B' }}>
                    <p className="text-[10px] text-[#334155] font-bold uppercase tracking-widest mb-2">
                      장착 아이템
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {scanResult.units
                        .filter(u => u.items?.length > 0)
                        .map((u, i) => (
                          <div key={i} className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-[10px] font-bold shrink-0"
                              style={{ color: '#94A3B8', minWidth: 52 }}
                            >
                              {u.name}
                            </span>
                            {u.items.map((item, j) => (
                              <span
                                key={j}
                                className="rounded px-1.5 py-0.5 text-[9px] font-bold"
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
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────
              중 컬럼: 현재 상태 + 신호등 + 전략 힌트
          ───────────────────────────────────── */}
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
                  value={hasScan ? (scanResult.round ?? '—') : null}
                  color="#60A5FA"
                />
                <StatCard
                  icon="💰" label="골드"
                  value={hasScan ? `${scanResult.gold ?? '—'}G` : null}
                  color="#FACC15"
                />
                <StatCard
                  icon="❤️" label="체력"
                  value={hasScan ? (scanResult.hp ?? '—') : null}
                  color={
                    hasScan && parseInt(scanResult.hp) <= 30
                      ? '#F87171'
                      : '#4ADE80'
                  }
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
            {hasScan && scanResult.round && (
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

          {/* ─────────────────────────────────────
              우 컬럼: AI 조언 + 사용 방법 + 철학
          ───────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <CoachBox advice={advice} isLoading={isAdvising} />
            <UsageGuide isOverwolfMode={isOverwolfMode} />
            <CoachPhilosophy />
          </div>

        </div>
      </div>
    </div>
  );
}