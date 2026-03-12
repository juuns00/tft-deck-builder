// ─────────────────────────────────────────────
//  src/utils/geminiApi.js
//  Gemini API 호출 전체 — @google/generative-ai SDK 사용
//  SDK가 CORS를 자동 처리 → 프록시 불필요
//
//  exports:
//    scanScreenshot        — CoachPage: 스크린샷 → 게임 상황 추출
//    generateCoachAdvice   — CoachPage: 1타 강사 실시간 코칭
//    generatePlacementAdvice — TacticalSimulatorPage: 배치 분석
// ─────────────────────────────────────────────
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_MODEL }       from './coachConstants.js';
import { parseStage }         from './coachLogic.js';
import { ROLE_LABEL }         from './constants.js';
import { SIM_COLS, THREAT_MAP, DRAG_THREATS } from './simulatorConstants.js';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function getModel() {
  if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

// ─── Vision: 이미지 스캔 ──────────────────────
/**
 * 게임 스크린샷을 분석해 라운드·골드·HP·유닛·아이템 추출
 * @param {string} base64Image  - dataURL의 base64 부분
 * @param {string} mimeType     - 'image/jpeg' 등
 * @returns {Promise<{ round, gold, hp, units, items }>}
 */
export async function scanScreenshot(base64Image, mimeType) {
  const model  = getModel();
  const prompt = `
당신은 TFT(롤토체스) 게임 화면을 분석하는 AI입니다.
이 스크린샷에서 다음 정보를 JSON으로 추출하세요. 정보가 없으면 null로 표시하세요.

{
  "round": "현재 라운드 (예: '3-2', '4-5')",
  "gold": "현재 골드 숫자만 (예: 43)",
  "hp": "현재 체력 숫자만 (예: 62)",
  "units": [
    { "name": "챔피언 한국 이름", "star": 성급숫자(1~3) }
  ],
  "items": ["아이템 이름 목록 (완성템/재료템 모두)"]
}

- 유닛 이름은 한국어로 (예: 진, 카이사, 아리 등)
- 성급은 머리 위 별 개수 (1~3)
- JSON만 출력하고 다른 텍스트 없이 응답
`.trim();

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType, data: base64Image } },
  ]);

  const raw   = result.response.text();
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('AI 응답 파싱 실패');
  return JSON.parse(match[0]);
}

// ─── Text: 팩폭 코치 조언 생성 ────────────────
/**
 * 스캔 결과 + 신호등 판정값을 바탕으로 마스터 강사 스타일 조언 생성
 * @param {object} scanData     - scanScreenshot 반환값
 * @param {string} signal       - 'green' | 'yellow' | 'red'
 * @param {number} deckScore    - 0~100
 * @param {string} bestCompName
 * @returns {Promise<string>}
 */
export async function generateCoachAdvice(scanData, signal, deckScore, bestCompName) {
  const model      = getModel();
  const stage      = parseStage(scanData.round);
  const isLateGame = stage >= 4;

  const persona = `
당신은 롤토체스 마스터 티어의 냉철한 1타 강사입니다.
반말을 쓰고, 직설적이며, TFT 전문 용어(리롤, 2성작, 순방, 피벗, 캐리, 올인 등)를 자연스럽게 사용합니다.
유머러스하지만 핵심을 찌르는 혹독한 피드백을 줍니다.
`.trim();

  const situation = `
현재 게임 상황:
- 라운드: ${scanData.round || '불명'}
- 골드: ${scanData.gold || '불명'}원
- HP: ${scanData.hp || '불명'}
- 보유 유닛: ${(scanData.units || []).map(u => `${u.name}(${u.star}성)`).join(', ') || '없음'}
- 보유 아이템: ${(scanData.items || []).join(', ') || '없음'}
- 현재 덱 신호등: ${signal === 'green' ? '🟢 안정' : signal === 'yellow' ? '🟡 주의' : '🔴 위험'}
- 유사 덱 일치도: ${deckScore}% (${bestCompName || '없음'})
- 게임 단계: ${isLateGame ? '중후반 (4스테이지 이상)' : '초중반 (1~3스테이지)'}
`.trim();

  const instruction = isLateGame
    ? `중후반이므로 덱 전환(피벗)은 절대 추천하지 마세요.
대신: 현재 덱에서 살아남는 법(순방 전략), 배치 조정, 리롤 타이밍, 아이템 장착 우선순위를 알려주세요.`
    : `초중반이므로 필요하면 과감한 덱 전환(피벗)도 추천 가능합니다.
아이템 방향과 기물 일치도를 고려해서 조언하세요.`;

  const prompt = `${persona}

${situation}

${instruction}

다음 형식으로 3~4가지 핵심 조언을 작성하세요:
[아이템] 조언 내용
[돈 관리] 조언 내용
[배치] 조언 내용
[결론] 한 줄 요약

각 조언은 1~2문장으로 짧고 임팩트 있게. 반말로.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ─── Text: 배치 전술 분석 ─────────────────────
/**
 * 7×4 보드 배치 + 위협 요소를 분석해 '1타 강사' 스타일 배치 피드백 생성
 * @param {(object|null)[]} board          - 길이 28의 배치 배열
 * @param {string[]}        activeThreats  - 체크박스 활성 위협 id 배열
 * @param {{ threatId: string, cellIdx: number }[]} threatPlacements
 * @returns {Promise<string>}
 */
export async function generatePlacementAdvice(board, activeThreats, threatPlacements) {
  const model = getModel();

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

  const dragThreatsDesc = (threatPlacements ?? []).map(({ threatId, cellIdx }) => {
    const t   = DRAG_THREATS.find(x => x.id === threatId);
    const row = Math.floor(cellIdx / SIM_COLS) + 1;
    const col = cellIdx % SIM_COLS + 1;
    return t ? `${t.name} (${row}행 ${col}열에 배치)` : null;
  }).filter(Boolean);

  const threatDesc = [...checkThreats, ...dragThreatsDesc].join(', ') || '없음';

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

  const result = await model.generateContent(prompt);
  return result.response.text();
}