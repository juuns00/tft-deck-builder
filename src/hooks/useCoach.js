// ─────────────────────────────────────────────
//  useCoach.js  (src/hooks/useCoach.js)
//  AI 코치 페이지 상태 + 비동기 로직 통합 훅
//  API 키는 환경변수(VITE_GEMINI_API_KEY)에서 관리
// ─────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { scanScreenshot, generateCoachAdvice } from '../utils/geminiApi.js';
import { calcDeckScore, judgeSignal }           from '../utils/coachLogic.js';

/**
 * useCoach
 *
 * 반환값:
 *  - imageUrl, setImage     : 업로드 이미지 URL + setter
 *  - scanResult             : Gemini Vision 파싱 결과
 *  - deckScore, bestComp    : 덱 일치도 계산 결과
 *  - signal                 : 'green' | 'yellow' | 'red' | null
 *  - advice                 : 강사 조언 텍스트
 *  - isScanning, isAdvising : 로딩 플래그
 *  - error                  : 에러 메시지
 *  - analyze()              : 분석 시작 핸들러
 *  - reset()                : 상태 초기화
 */
export function useCoach() {
  // ── 입력 상태 ─────────────────────────────────
  const [imageUrl,  setImageUrl]  = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // ── 결과 상태 ─────────────────────────────────
  const [scanResult, setScanResult] = useState(null);
  const [deckScore,  setDeckScore]  = useState(0);
  const [bestComp,   setBestComp]   = useState(null);
  const [signal,     setSignal]     = useState(null);
  const [advice,     setAdvice]     = useState('');

  // ── 로딩 / 에러 ───────────────────────────────
  const [isScanning, setIsScanning] = useState(false);
  const [isAdvising, setIsAdvising] = useState(false);
  const [error,      setError]      = useState('');

  // ── 이미지 세팅 (업로드/붙여넣기 공통) ──────────
  const setImage = useCallback((file, dataUrl) => {
    setImageFile(file);
    setImageUrl(dataUrl);
    // 새 이미지 들어오면 이전 결과 초기화
    setScanResult(null);
    setSignal(null);
    setAdvice('');
    setError('');
    setDeckScore(0);
    setBestComp(null);
  }, []);

  // ── 분석 시작 ─────────────────────────────────
  const analyze = useCallback(async () => {
    if (!imageFile) { setError('이미지를 먼저 업로드해주세요.'); return; }
    setError('');

    // 1) Vision 스캔
    setIsScanning(true);
    let scan;
    try {
      const base64 = imageUrl.split(',')[1];
      scan = await scanScreenshot(base64, imageFile.type);
      setScanResult(scan);
    } catch (e) {
      setError(`스캔 실패: ${e.message}`);
      setIsScanning(false);
      return;
    }
    setIsScanning(false);

    // 2) 덱 일치도
    const champNames              = (scan.units || []).map(u => u.name);
    const { score, bestComp: bc } = calcDeckScore(champNames);
    setDeckScore(score);
    setBestComp(bc);

    // 3) 신호등 판정
    const sig = judgeSignal({ score, stage: scan.round, hp: scan.hp });
    setSignal(sig);

    // 4) AI 팩폭 조언
    setIsAdvising(true);
    try {
      const text = await generateCoachAdvice(scan, sig, score, bc?.name);
      setAdvice(text);
    } catch (e) {
      setAdvice(`(조언 생성 실패: ${e.message})`);
    }
    setIsAdvising(false);
  }, [imageFile, imageUrl]);

  // ── 전체 초기화 ───────────────────────────────
  const reset = useCallback(() => {
    setImageUrl(null);
    setImageFile(null);
    setScanResult(null);
    setDeckScore(0);
    setBestComp(null);
    setSignal(null);
    setAdvice('');
    setError('');
  }, []);

  return {
    // 입력
    imageUrl, setImage,
    // 결과
    scanResult, deckScore, bestComp, signal, advice,
    // 로딩
    isScanning, isAdvising,
    // 에러
    error,
    // 액션
    analyze, reset,
  };
}