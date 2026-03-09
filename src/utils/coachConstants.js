// ─────────────────────────────────────────────
//  coachConstants.js
//  AI 코치 페이지 전용 상수
// ─────────────────────────────────────────────

export const GEMINI_MODEL = 'gemini-2.0-flash-lite';

/** 신호등 메타 — 색상·텍스트 한 곳에서 관리 */
export const SIGNAL_META = {
  green: {
    emoji:  '🟢',
    label:  '안정',
    color:  '#4ADE80',
    bg:     '#4ADE8015',
    border: '#4ADE8040',
    glow:   '#4ADE8033',
    title:  '덱 완성도 높음',
    desc:   '9레벨 밸류업 및 배치에 집중하라.',
  },
  yellow: {
    emoji:  '🟡',
    label:  '주의',
    color:  '#FACC15',
    bg:     '#FACC1515',
    border: '#FACC1540',
    glow:   '#FACC1533',
    title:  '기물 겹침 / 템 부조화',
    desc:   '메인 캐리만 교체하는 미세 조정을 해라.',
  },
  red: {
    emoji:  '🔴',
    label:  '위험',
    color:  '#F87171',
    bg:     '#F8717115',
    border: '#F8717140',
    glow:   '#F8717133',
    title:  '피 관리 비상',
    desc:   '덱 전환 금지. 올인 리롤로 생존 도모.',
  },
};