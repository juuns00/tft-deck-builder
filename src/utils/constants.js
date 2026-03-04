// ─────────────────────────────────────────────
//  TFT 세트 16: 신화와 전설 — 전역 상수
// ─────────────────────────────────────────────

// ─── 세트 정보 ────────────────────────────────
export const TFT_SET = {
  number: 16,
  name: '신화와 전설',
  patch: '16.1',
};

// ─── 티어 ─────────────────────────────────────
export const TIERS = ['S', 'A', 'B', 'C'];

export const TIER_COLOR = {
  S: '#FFD700',
  A: '#C084FC',
  B: '#60A5FA',
  C: '#94A3B8',
};

export const TIER_BG = {
  S: '#FFD70018',
  A: '#C084FC18',
  B: '#60A5FA18',
  C: '#94A3B818',
};

export const TIER_LABEL = {
  S: 'S티어',
  A: 'A티어',
  B: 'B티어',
  C: 'C티어',
};

export const TIER_ORDER = { S: 0, A: 1, B: 2, C: 3 };

// ─── 코스트 ───────────────────────────────────
export const COST_COLOR = {
  1: '#94A3B8', // 회색
  2: '#4ADE80', // 초록
  3: '#60A5FA', // 파랑
  4: '#C084FC', // 보라
  5: '#FFD700', // 금색
  7: '#FF6B6B', // 빨강 (해금)
};

export const COST_BG = {
  1: '#94A3B822',
  2: '#4ADE8022',
  3: '#60A5FA22',
  4: '#C084FC22',
  5: '#FFD70022',
  7: '#FF6B6B22',
};

// ─── 증강체 티어 ──────────────────────────────
export const AUGMENT_TIER_COLOR = {
  silver:    '#CBD5E1',
  gold:      '#FFD700',
  prismatic: '#C084FC',
};

export const AUGMENT_TIER_LABEL = {
  silver:    '실버',
  gold:      '골드',
  prismatic: '프리즈매틱',
};

// ─── 특성 타입 ────────────────────────────────
export const TRAIT_TYPE_LABEL = {
  origin: '계열',
  class:  '직업',
};

export const TRAIT_TYPE_COLOR = {
  origin: '#FB923C',
  class:  '#38BDF8',
};

// ─── 난이도 ───────────────────────────────────
export const DIFFICULTY_LABEL = {
  easy:   '쉬움',
  medium: '보통',
  hard:   '어려움',
};

export const DIFFICULTY_COLOR = {
  easy:   '#4ADE80',
  medium: '#FACC15',
  hard:   '#F87171',
};

// ─── 플레이 스타일 ────────────────────────────
export const PLAY_STYLE_LABEL = {
  'slow-roll': '슬로우롤',
  'standard':  '표준 운영',
  'fast9':     '패스트9',
};

// ─── 역할군 ───────────────────────────────────
export const ROLE_LABEL = {
  tanker:   '탱커',
  fighter:  '전사',
  mage:     '마법사',
  marksman: '원딜',
  assassin: '암살자',
  support:  '서포터',
};

export const ROLE_COLOR = {
  tanker:   '#60A5FA',
  fighter:  '#FB923C',
  mage:     '#C084FC',
  marksman: '#4ADE80',
  assassin: '#F87171',
  support:  '#FACC15',
};

// ─── 보드 설정 ────────────────────────────────
export const BOARD_ROWS = 4;
export const BOARD_COLS = 7;

// ─── DDragon 이미지 베이스 URL (필요 시 사용) ──
export const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';
export const DDRAGON_VERSION = '14.24.1';
