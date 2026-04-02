// ─────────────────────────────────────────────
//  ShopPanel  (src/components/coach/ShopPanel.jsx)
//  Overwolf GEP로 수신한 상점 5슬롯 표시
//  타겟 덱에 필요한 챔피언은 금색으로 강조
// ─────────────────────────────────────────────

/**
 * @param {string[]} shopChamps  - 현재 상점 챔피언 이름 배열 (최대 5)
 * @param {Set<string>} neededNames - 타겟 덱에 필요한 챔피언 이름 Set
 */
export default function ShopPanel({ shopChamps, neededNames }) {
  if (!shopChamps?.length) {
    return (
      <div
        className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center"
        style={{ background: '#0A0F1A', border: '1px solid #1E293B', minHeight: 80 }}
      >
        <p className="m-0 text-[11px] text-[#334155]">상점 데이터 대기 중...</p>
        <p className="m-0 text-[10px] text-[#1E3A5F]">상점을 새로고침하면 나타납니다</p>
      </div>
    );
  }

  const hasHighlight = shopChamps.some(n => neededNames.has(n));

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#0A0F1A', border: '1px solid #1E293B' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-[3px] h-4 rounded-sm" style={{ background: '#FACC15' }} />
        <span className="text-[12px] font-black tracking-widest uppercase text-[#E2E8F0]">
          현재 상점
        </span>
        {hasHighlight && (
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-black ml-auto"
            style={{ background: '#FFD70022', color: '#FFD700' }}
          >
            ★ 필요 챔피언 있음
          </span>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {shopChamps.map((name, i) => {
          const isNeeded = neededNames.has(name);
          return (
            <div
              key={i}
              className="rounded-lg px-2.5 py-2 text-[11px] font-bold transition-all duration-200 flex items-center gap-1"
              style={{
                background: isNeeded ? '#FFD70018' : '#131B2E',
                border:     isNeeded ? '1px solid #FFD70055' : '1px solid #1E293B',
                color:      isNeeded ? '#FFD700'              : '#475569',
                boxShadow:  isNeeded ? '0 0 10px #FFD70022'   : 'none',
              }}
            >
              {isNeeded && <span style={{ fontSize: 10 }}>★</span>}
              {name}
            </div>
          );
        })}
      </div>

      {hasHighlight && (
        <p className="m-0 text-[10px] mt-2" style={{ color: '#FFD70099' }}>
          ★ 표시는 현재 타겟 덱에 필요한 챔피언입니다
        </p>
      )}
    </div>
  );
}
