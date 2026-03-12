// ─────────────────────────────────────────────
//  src/components/simulator/AnalysisPanel.jsx
//  AI 배치 분석 패널 — VITE_GEMINI_API_KEY 사용
//  (사용자 API 키 입력 UI 없음)
// ─────────────────────────────────────────────

/**
 * @param {string}   feedback
 * @param {boolean}  loadingFeedback
 * @param {function} onAnalyze
 */
export default function AnalysisPanel({ feedback, loadingFeedback, onAnalyze }) {
  return (
    <div className="rounded-xl border p-4"
      style={{ background: '#0A0F1A', borderColor: '#1E293B' }}>

      <div className="text-sm font-black mb-2" style={{ color: '#FFD700' }}>
        🤖 1타 강사 배치 분석
      </div>

      {/* 분석 버튼 */}
      <button
        onClick={onAnalyze}
        disabled={loadingFeedback}
        className="w-full py-2.5 rounded-lg font-black text-sm transition-all"
        style={{
          background: loadingFeedback
            ? '#1E293B'
            : 'linear-gradient(135deg,#FFD700,#F59E0B)',
          color:  loadingFeedback ? '#475569' : '#000',
          cursor: loadingFeedback ? 'not-allowed' : 'pointer',
        }}
      >
        {loadingFeedback ? '⏳ 분석 중...' : '🔍 배치 분석'}
      </button>

      {/* 피드백 출력 */}
      {feedback ? (
        <div
          className="mt-3 p-3 rounded-lg text-xs leading-relaxed whitespace-pre-wrap"
          style={{
            background: '#0F172A',
            border:     '1px solid #1E293B',
            color:      '#94A3B8',
            animation:  'fadeInUp 0.3s ease',
            maxHeight:  320,
            overflowY:  'auto',
          }}
        >
          {feedback}
        </div>
      ) : !loadingFeedback && (
        <div
          className="mt-3 p-3 rounded-lg text-xs text-center"
          style={{ background: '#0F172A', border: '1px dashed #1E293B', color: '#334155' }}
        >
          유닛을 배치하고 분석을 눌러봐.
        </div>
      )}
    </div>
  );
}