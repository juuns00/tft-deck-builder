// ─────────────────────────────────────────────
//  useOverwolf.js
//  Overwolf GEP → scanResult 포맷 실시간 공급 훅
//  window.overwolf 없는 환경(웹/일반 Electron)에선 silent no-op
// ─────────────────────────────────────────────
import { useEffect, useRef, useCallback } from 'react'
import { champions } from '../data/index.js'

// "TFT16_Jinx" → champions.json name 매핑
const GAME_ID_MAP = Object.fromEntries(
  champions.map(c => [c.id.toLowerCase(), c.name])
)

// Overwolf 게임 ID (TFT = 21570, LoL과 공유)
const TFT_FEATURES = ['board', 'store', 'match_info']

function resolveChampName(gameId) {
  if (!gameId) return null
  // "TFT16_Jinx" → "tft16_jinx" → 매핑 시도
  // 실패 시 prefix 제거 후 재시도: "Jinx" → "jinx"
  const lower = gameId.toLowerCase()
  if (GAME_ID_MAP[lower]) return GAME_ID_MAP[lower]
  const stripped = lower.replace(/^tft\d+_/, '')
  return GAME_ID_MAP[stripped] ?? gameId
}

/**
 * @param {function} onUpdate - (updater: prev => next) => void
 *   updater는 이전 scanResult를 받아 새 scanResult를 반환하는 함수
 */
export function useOverwolf(onUpdate) {
  const onUpdateRef = useRef(onUpdate)
  useEffect(() => { onUpdateRef.current = onUpdate }, [onUpdate])

  useEffect(() => {
    // Overwolf 환경이 아니면 아무것도 안 함
    if (typeof window === 'undefined' || !window.overwolf) return

    const ow = window.overwolf.games.events

    // 피처 등록 (재시도 로직 포함)
    let attempts = 0
    function trySetFeatures() {
      ow.setRequiredFeatures(TFT_FEATURES, (res) => {
        if (!res.success && attempts < 5) {
          attempts++
          setTimeout(trySetFeatures, 2000)
        }
      })
    }
    trySetFeatures()

    // 인포 업데이트 리스너
    function handleInfo(info) {
      if (!info?.feature) return

      // ── 보드 변경 (유닛 배치/제거) ──
      if (info.feature === 'board' && info.info?.board?.board_pieces) {
        try {
          const cells = JSON.parse(info.info.board.board_pieces)
          const units = Object.values(cells)
            .filter(cell => cell?.name)
            .map(cell => ({
              name:  resolveChampName(cell.name),
              star:  Number(cell.level) || 1,
              items: [cell.item_1, cell.item_2, cell.item_3].filter(Boolean),
            }))

          onUpdateRef.current(prev => ({ ...(prev ?? {}), units }))
        } catch (e) {
          console.warn('[useOverwolf] board parse error', e)
        }
      }

      // ── 상점 변경 (새로고침마다) ──
      if (info.feature === 'store' && info.info?.store?.shop_pieces) {
        try {
          const slots = JSON.parse(info.info.store.shop_pieces)
          const shopChamps = Object.values(slots)
            .filter(s => s?.name && s.name !== 'Sold')
            .map(s => resolveChampName(s.name))
            .filter(Boolean)

          onUpdateRef.current(prev => ({ ...(prev ?? {}), shopChamps }))
        } catch (e) {
          console.warn('[useOverwolf] store parse error', e)
        }
      }

      // ── 매치 인포 (라운드/골드/HP) ──
      if (info.feature === 'match_info' && info.info?.match_info) {
        const m = info.info.match_info
        onUpdateRef.current(prev => ({
          ...(prev ?? {}),
          ...(m.round_type  != null && { round: m.round_type }),
          ...(m.gold        != null && { gold:  Number(m.gold) }),
          ...(m.health      != null && { hp:    Number(m.health) }),
        }))
      }
    }

    ow.onInfoUpdates2.addListener(handleInfo)

    return () => {
      ow.onInfoUpdates2.removeListener(handleInfo)
    }
  }, []) // mount/unmount 시 1회
}