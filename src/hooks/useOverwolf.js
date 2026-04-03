// src/hooks/useOverwolf.js
import { useEffect, useRef } from 'react'
import { champions } from '../data/index.js'

const GAME_ID_MAP = Object.fromEntries(
  champions.map(c => [c.id.toLowerCase(), c.name])
)

function resolveChampName(gameId) {
  if (!gameId) return null
  const lower = gameId.toLowerCase()
  if (GAME_ID_MAP[lower]) return GAME_ID_MAP[lower]
  const stripped = lower.replace(/^tft\d+_/, '')
  return GAME_ID_MAP[stripped] ?? gameId
}

export function useOverwolf(onUpdate) {
  const onUpdateRef = useRef(onUpdate)
  useEffect(() => { onUpdateRef.current = onUpdate }, [onUpdate])

  useEffect(() => {
    // Electron + GEP 환경 확인
    if (!window.electronAPI?.onGepInfoUpdate) return

    console.log('[useOverwolf] Electron GEP 리스너 등록')

    window.electronAPI.onGepInfoUpdate(({ data }) => {
      const info = data?.[0]
      if (!info?.feature) return

      console.log('[useOverwolf] info update:', info)

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

      if (info.feature === 'match_info' && info.info?.match_info) {
        const m = info.info.match_info
        onUpdateRef.current(prev => ({
          ...(prev ?? {}),
          ...(m.round_type != null && { round: m.round_type }),
          ...(m.gold       != null && { gold:  Number(m.gold) }),
          ...(m.health     != null && { hp:    Number(m.health) }),
        }))
      }
    })

    return () => window.electronAPI.offGepListeners()
  }, [])
}