// ─────────────────────────────────────────────
//  CoachBox  (src/components/coach/CoachBox.jsx)
//  1타 강사 AI 조언 출력 패널
//  [태그] 형식의 라인을 파싱해 뱃지 + 본문으로 렌더링
// ─────────────────────────────────────────────

/** 로딩 중 스켈레톤 */
function Skeleton() {
  return (
    <div className="flex flex-col gap-2.5 animate-pulse">
      {[80, 95, 70].map((w, i) => (
        <div
          key={i}
          className="h-3 rounded"
          style={{ background: '#1E293B', width: `${w}%` }}
        />
      ))}
    </div>
  );
}

/** 조언 라인 1개 렌더 — [태그] 파싱 */
function AdviseLine({ line }) {
  const bracketMatch = line.match(/^\[(.+?)\](.*)/);
  if (!bracketMatch) {
    return (
      <p className="m-0 text-[13px] text-[#94A3B8] leading-relaxed">{line}</p>
    );
  }

  const [, tag, rest] = bracketMatch;
  return (
    <div className="mt-1.5 first:mt-0">
      <span
        className="inline-block rounded-full px-2 py-0.5 text-[9px] font-black tracking-widest uppercase mb-1"
        style={{ background: '#FFD70022', color: '#FFD700' }}
      >
        {tag}
      </span>
      {rest.trim() && (
        <p className="m-0 text-[13px] font-bold text-[#E2E8F0] leading-relaxed">
          {rest.trim()}
        </p>
      )}
    </div>
  );
}

/**
 * @param {string}  advice    - Gemini 생성 조언 텍스트 (빈 문자열이면 empty 상태)
 * @param {boolean} isLoading - 조언 생성 중 여부
 */
export default function CoachBox({ advice, isLoading }) {
  const lines = advice ? advice.split('\n').filter(Boolean) : [];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #0F1929, #0A1120)',
        border:     '1px solid #1E3A5F',
      }}
    >
      {/* 헤더 */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{
          background:   'linear-gradient(90deg, #FFD70018, transparent)',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <span className="text-lg">🎙️</span>
        <span
          className="text-[12px] font-black tracking-[2px] uppercase"
          style={{ color: '#FFD700' }}
        >
          1타 강사의 실시간 훈수
        </span>

        {/* 타이핑 점 애니메이션 */}
        {isLoading && (
          <div className="ml-auto flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: '#FFD700',
                  opacity:    0.7,
                  animation:  `coachBounce 1s ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="p-4 min-h-[140px]">
        {isLoading ? (
          <Skeleton />
        ) : advice ? (
          <div className="flex flex-col gap-2">
            {lines.map((line, i) => (
              <AdviseLine key={i} line={line} />
            ))}
          </div>
        ) : (
          /* 초기 empty 상태 */
          <div className="h-full flex flex-col items-center justify-center gap-2 py-4 text-center">
            <span className="text-3xl opacity-20">💬</span>
            <p className="text-[12px] text-[#334155] m-0">
              스크린샷을 올리면 강사가 혹독하게 조언해드립니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
