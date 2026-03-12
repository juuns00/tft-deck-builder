// ─────────────────────────────────────────────
//  src/utils/simulatorApi.js
//  배치 전술 훈련소 — Gemini REST API 호출
//  (geminiApi.js 의 SDK 방식과 달리 직접 fetch 사용 →
//   API 키를 사용자가 런타임에 입력하는 구조에 맞춤)
// ─────────────────────────────────────────────
import { ROLE_LABEL }  from './constants.js';
import { SIM_COLS, THREAT_MAP } from './simulatorConstants.js';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * 현재 보드 배치를 Gemini 에게 전달해 '1타 강사' 스타일 피드백을 받는다.
 *
 * @param {string}        apiKey        - 사용자가 입력한 Gemini API 키
 * @param {(object|null)[]} board       - 길이 28의 배치 배열
 * @param {string[]}      activeThreats - 체크박스 활성 위협 id 배열
 * @param {{ threatId: string, cellIdx: number }[]} threatPlacements
 *                                      - 그리드 배치 위협 (서풍·침묵)
 * @returns {Promise<string>}
 */
export async function callSimulatorGemini(apiKey, board, activeThreats, threatPlacements) {
  // ── 보드 설명 텍스트 생성 ─────────────────
  const boardDesc = board
    .map((cell, i) => {
      if (!cell || cell.sourceType === 'threat') return null;
      const row  = Math.floor(i / SIM_COLS);
      const col  = i % SIM_COLS;
      const role = ROLE_LABEL[cell.role] ?? cell.role ?? '?';
      return `(${row + 1}행 ${col + 1}열): ${cell.name} [${role}, 사거리 ${cell.stats?.range ?? '?'}]`;
    })
    .filter(Boolean)
    .join('\n');

  // ── 위협 설명 텍스트 생성 ─────────────────
  const checkThreats = activeThreats
    .map(id => THREAT_MAP[id]?.name)
    .filter(Boolean);

  const dragThreats = (threatPlacements ?? []).map(({ threatId, cellIdx }) => {
    const t   = THREAT_MAP[threatId];
    const row = Math.floor(cellIdx / SIM_COLS) + 1;
    const col = cellIdx % SIM_COLS + 1;
    return t ? `${t.name} (${row}행 ${col}열에 배치)` : null;
  }).filter(Boolean);

  const allThreats = [...checkThreats, ...dragThreats];
  const threatDesc = allThreats.length > 0 ? allThreats.join(', ') : '없음';

  // ── 프롬프트 ──────────────────────────────
  const prompt = `너는 롤토체스(TFT) 전문 코치야. 반말 쓰는 엄격하지만 핵심만 찌르는 '1타 강사' 말투로 피드백해줘.

현재 배치 상황:
${boardDesc || '유닛 없음'}

상대방 위협 요소: ${threatDesc}

다음 형식으로 분석해줘 (각 섹션을 명확히 구분):

🔥 핵심 문제점 (2–3가지, 직설적으로):
- ...

✅ 잘한 점 (1–2가지):
- ...

📌 지금 당장 해야 할 행동 (구체적으로):
1. ...
2. ...

말투 예시: "지금 배치는 블리츠한테 끌려가기 딱 좋다", "상대 암살자가 있으면 캐리를 구석에 박으면 안 돼", "앞라인이 너무 몰려있어, 광역기에 한 번에 터진다"

배치된 유닛이 없으면 "유닛을 먼저 배치해봐, 뭘 분석해줘?"라고 말해줘.`;

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents:         [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 600 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('AI 응답이 비어 있어');
  return text;
}
