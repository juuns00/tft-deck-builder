// src/hooks/useCoach.js
import { useState, useCallback } from 'react'
import { scanScreenshot, generateCoachAdvice } from '../utils/geminiApi.js'
import { calcDeckScore, judgeSignal }           from '../utils/coachLogic.js'
import { useOverwolf }                          from './useOverwolf.js'

export function useCoach() {
  // ── 입력 ─────────────────────────────────────
  const [imageUrl,  setImageUrl]  = useState(null)
  const [imageFile, setImageFile] = useState(null)

  // ── 결과 ─────────────────────────────────────
  const [scanResult, setScanResult] = useState(null)
  const [deckScore,  setDeckScore]  = useState(0)
  const [bestComp,   setBestComp]   = useState(null)
  const [signal,     setSignal]     = useState(null)
  const [advice,     setAdvice]     = useState('')

  // ── 로딩 / 에러 ───────────────────────────────
  const [isScanning, setIsScanning] = useState(false)
  const [isAdvising, setIsAdvising] = useState(false)
  const [error,      setError]      = useState('')

  // ── Overwolf 연동 여부 ────────────────────────
  // const isOverwolfMode = typeof window !== 'undefined' && !!window.overwolf
  const isOverwolfMode = true

  // ── Overwolf GEP → scanResult 자동 갱신 ──────
  // updater 함수를 받아 scanResult를 부분 업데이트
  // 신호등/덱점수도 함께 갱신 (AI 조언은 버튼 눌릴 때만)
  useOverwolf(useCallback((updater) => {
    setScanResult(prev => {
      const next = updater(prev)

      // 유닛 목록이 갱신될 때마다 덱점수·신호등 재계산
      if (next?.units?.length) {
        const champNames = next.units.map(u => u.name)
        const { score, bestComp: bc } = calcDeckScore(champNames)
        setDeckScore(score)
        setBestComp(bc)
        setSignal(judgeSignal({ score, stage: next.round, hp: next.hp }))
      }

      return next
    })
  }, []))

  // ── 이미지 세팅 (웹 모드 전용) ───────────────
  const setImage = useCallback((file, dataUrl) => {
    setImageFile(file)
    setImageUrl(dataUrl)
    setScanResult(null)
    setSignal(null)
    setAdvice('')
    setError('')
    setDeckScore(0)
    setBestComp(null)
  }, [])

  // ── 스캔 (웹 모드 전용: 이미지 → Gemini Vision) ──
  const scan = useCallback(async () => {
    if (!imageFile) { setError('이미지를 먼저 업로드해주세요.'); return }
    setError('')
    setIsScanning(true)
    try {
      const base64 = imageUrl.split(',')[1]
      const result = await scanScreenshot(base64, imageFile.type)
      setScanResult(result)

      const champNames = (result.units || []).map(u => u.name)
      const { score, bestComp: bc } = calcDeckScore(champNames)
      setDeckScore(score)
      setBestComp(bc)
      setSignal(judgeSignal({ score, stage: result.round, hp: result.hp }))
    } catch (e) {
      setError(`스캔 실패: ${e.message}`)
    } finally {
      setIsScanning(false)
    }
  }, [imageFile, imageUrl])

  // ── AI 조언 생성 (버튼 클릭 시 공통 실행) ────
  const requestAdvice = useCallback(async () => {
    if (!scanResult) {
      setError(isOverwolfMode
        ? '게임을 시작한 후 다시 눌러주세요.'
        : '먼저 스캔을 실행해주세요.')
      return
    }
    setError('')
    setAdvice('')
    setIsAdvising(true)
    try {
      const text = await generateCoachAdvice(
        scanResult,
        signal,
        deckScore,
        bestComp?.name
      )
      setAdvice(text)
    } catch (e) {
      setAdvice(`(조언 생성 실패: ${e.message})`)
    } finally {
      setIsAdvising(false)
    }
  }, [scanResult, signal, deckScore, bestComp, isOverwolfMode])

  // ── 웹 모드 호환: 기존 analyze() = scan + requestAdvice ──
  const analyze = useCallback(async () => {
    await scan()
    // scan 완료 후 scanResult가 state에 반영되기 전이므로
    // requestAdvice는 scan 내부에서 직접 호출
  }, [scan])

  // ── 초기화 ────────────────────────────────────
  const reset = useCallback(() => {
    setImageUrl(null); setImageFile(null)
    setScanResult(null); setDeckScore(0); setBestComp(null)
    setSignal(null); setAdvice(''); setError('')
  }, [])

  return {
    imageUrl, setImage,
    scanResult, deckScore, bestComp, signal, advice,
    isScanning, isAdvising,
    isOverwolfMode,
    error,
    scan, requestAdvice, analyze, reset,
  }
}