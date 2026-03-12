// ─────────────────────────────────────────────
//  src/utils/simulatorConstants.js
//  배치 전술 훈련소 전용 상수
//  · BOARD_ROWS / BOARD_COLS 는 utils/constants.js 공유값 사용
//  · THREATS        — 위협 유닛/아이템 정의
// ─────────────────────────────────────────────

export const SIM_ROWS = 4;
export const SIM_COLS = 7;
export const SIM_TOTAL = SIM_ROWS * SIM_COLS; // 28

// ─── 위협 유닛 / 아이템 정의 ─────────────────
/**
 * @typedef {object} Threat
 * @property {string}      id
 * @property {string}      name
 * @property {string|null} icon       - 이미지 URL (없으면 emoji 사용)
 * @property {string|null} emoji
 * @property {'unit'|'item'} type
 * @property {string}      desc       - 짧은 설명
 * @property {string}      dangerDesc - 위험 구역 설명
 * @property {string}      color      - hex 강조색
 * @property {'grab'|'assassin'|'aoe'|'zephyr'|'shroud'} dangerType
 * @property {'checkbox'|'drag'}  mode  - 체크박스 토글 vs 그리드 드래그
 */

/** @type {Threat[]} */
export const THREATS = [
  {
    id:          'blitz',
    name:        '블리츠크랭크',
    icon:        'https://cdn.lolchess.gg/upload/images/champions/Blitzcrank_1762916344-Blitzcrank.jpg',
    emoji:       null,
    type:        'unit',
    desc:        '그랩: 가장 앞에 있는 적을 후방으로 끌어당깁니다',
    dangerDesc:  '전방 1–2행이 그랩 위험 구역입니다',
    color:       '#EF4444',
    dangerType:  'grab',
    mode:        'checkbox',
  },
  {
    id:          'assassin',
    name:        '암살자',
    icon:        null,
    emoji:       '🗡️',
    type:        'unit',
    desc:        '후방 침입: 전투 시작 시 상대 후방으로 도약합니다',
    dangerDesc:  '후방 2행이 암살자 침입 위험 구역입니다',
    color:       '#F97316',
    dangerType:  'assassin',
    mode:        'checkbox',
  },
  {
    id:          'sejuani',
    name:        '세주아니',
    icon:        'https://cdn.lolchess.gg/upload/images/champions/Sejuani_1762916177-Sejuani.jpg',
    emoji:       null,
    type:        'unit',
    desc:        '빙하 감옥: 광역 기절기를 사용합니다',
    dangerDesc:  '전방 중앙부가 광역 CC 위험 구역입니다',
    color:       '#818CF8',
    dangerType:  'aoe',
    mode:        'checkbox',
  },
  {
    id:          'zephyr',
    name:        '서풍',
    icon:        'https://cdn.lolchess.gg/upload/images/items/Zephyr_1693365537-zephyr.png',
    emoji:       null,
    type:        'item',
    desc:        '전투 시작: 반대편 가장 가까운 적을 5초간 제외시킵니다',
    dangerDesc:  '배치된 칸 정반대에 서풍이 적중합니다',
    color:       '#38BDF8',
    dangerType:  'zephyr',
    mode:        'drag',
  },
  {
    id:          'shroud',
    name:        '침묵의 장막',
    icon:        'https://cdn.lolchess.gg/upload/images/items/Shroud_1693365565-shroud_of_stillness.png',
    emoji:       null,
    type:        'item',
    desc:        '전투 시작: 적에게 마나 30% 강탈 광선을 발사합니다',
    dangerDesc:  '배치된 열 전체가 마나 감소 위험 구역입니다',
    color:       '#A78BFA',
    dangerType:  'shroud',
    mode:        'drag',
  },
];

/** checkbox 모드 위협만 (블리츠·암살자·세주아니) */
export const CHECKBOX_THREATS = THREATS.filter(t => t.mode === 'checkbox');

/** drag 모드 위협만 (서풍·침묵) */
export const DRAG_THREATS = THREATS.filter(t => t.mode === 'drag');

/** id → Threat 빠른 조회 맵 */
export const THREAT_MAP = Object.fromEntries(THREATS.map(t => [t.id, t]));
