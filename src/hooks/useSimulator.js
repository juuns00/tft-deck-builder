// ─────────────────────────────────────────────
//  src/hooks/useSimulator.js
//  배치 전술 훈련소 — 핵심 상태·로직 통합 훅
//
//  관리 대상:
//    board            — 28칸 배치 배열
//    selectedCell     — 클릭한 셀 (사거리 표시용)
//    activeThreats    — 체크박스 위협 id 배열
//    threatPlacements — 그리드 배치 위협 [{threatId, cellIdx}]
//    dragOverCell     — 드래그 오버 중인 셀 인덱스
//    feedback         — AI 분석 상태
// ─────────────────────────────────────────────
import { useState, useRef, useCallback } from 'react';
import { SIM_TOTAL, THREAT_MAP }         from '../utils/simulatorConstants.js';
import { generatePlacementAdvice }       from '../utils/geminiApi.js';

const EMPTY_BOARD = () => Array(SIM_TOTAL).fill(null);

export function useSimulator() {
  // ── 보드 ─────────────────────────────────────
  const [board,        setBoard]        = useState(EMPTY_BOARD);
  const [selectedCell, setSelectedCell] = useState(null);

  // ── 위협 ─────────────────────────────────────
  const [activeThreats,    setActiveThreats]    = useState([]);
  const [threatPlacements, setThreatPlacements] = useState([]);

  // ── 드래그 ───────────────────────────────────
  const [dragOverCell, setDragOverCell] = useState(null);
  const dragSourceCell = useRef(null);

  // ── AI ───────────────────────────────────────
  const [feedback,        setFeedback]       = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // ── 파생값 ───────────────────────────────────
  const placedCount = board.filter(Boolean).length;

  // ──────────────────────────────────────────────
  //  보드 핸들러
  // ──────────────────────────────────────────────

  const handleCellClick = useCallback((cellIdx) => {
    if (!board[cellIdx]) { setSelectedCell(null); return; }
    setSelectedCell(prev => prev === cellIdx ? null : cellIdx);
  }, [board]);

  const handleRemoveUnit = useCallback((cellIdx) => {
    setBoard(prev => {
      const next = [...prev];
      const unit = next[cellIdx];
      next[cellIdx] = null;
      if (unit?.sourceType === 'threat') {
        setThreatPlacements(tp => tp.filter(p => p.cellIdx !== cellIdx));
      }
      return next;
    });
    setSelectedCell(prev => prev === cellIdx ? null : prev);
  }, []);

  const clearBoard = useCallback(() => {
    setBoard(EMPTY_BOARD());
    setSelectedCell(null);
    setThreatPlacements([]);
    setFeedback('');
  }, []);

  // ──────────────────────────────────────────────
  //  드래그 핸들러
  // ──────────────────────────────────────────────

  const handlePoolDragStart = useCallback((e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    dragSourceCell.current = null;
  }, []);

  const handleBoardDragStart = useCallback((e, cellIdx, unit) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ ...unit, sourceType: unit.sourceType ?? 'board' }));
    dragSourceCell.current = cellIdx;
  }, []);

  const handleDragLeave = useCallback(() => setDragOverCell(null), []);

  const handleDrop = useCallback((e, targetIdx) => {
    e.preventDefault();
    setDragOverCell(null);

    let item;
    try { item = JSON.parse(e.dataTransfer.getData('application/json')); }
    catch { return; }

    setBoard(prev => {
      const next = [...prev];

      if (item.sourceType === 'board' && dragSourceCell.current !== null) {
        const srcIdx = dragSourceCell.current;
        if (srcIdx === targetIdx) return prev;
        [next[srcIdx], next[targetIdx]] = [next[targetIdx], next[srcIdx]];
        setThreatPlacements(tp => tp.map(p => {
          if (p.cellIdx === srcIdx)    return { ...p, cellIdx: targetIdx };
          if (p.cellIdx === targetIdx) return { ...p, cellIdx: srcIdx };
          return p;
        }));
      } else if (item.sourceType === 'threat') {
        next[targetIdx] = { ...item };
        setThreatPlacements(tp => [
          ...tp.filter(p => p.cellIdx !== targetIdx),
          { threatId: item.id, cellIdx: targetIdx },
        ]);
      } else {
        next[targetIdx] = { ...item, sourceType: 'champion' };
      }

      dragSourceCell.current = null;
      return next;
    });

    setSelectedCell(null);
  }, []);

  // ──────────────────────────────────────────────
  //  위협 핸들러
  // ──────────────────────────────────────────────

  const toggleThreat = useCallback((threatId) => {
    const threat = THREAT_MAP[threatId];
    if (!threat || threat.mode === 'drag') return;
    setActiveThreats(prev =>
      prev.includes(threatId)
        ? prev.filter(id => id !== threatId)
        : [...prev, threatId]
    );
  }, []);

  // ──────────────────────────────────────────────
  //  AI 분석
  // ──────────────────────────────────────────────

  const handleAnalyze = useCallback(async () => {
    setLoadingFeedback(true);
    setFeedback('');
    try {
      const result = await generatePlacementAdvice(board, activeThreats, threatPlacements);
      setFeedback(result);
    } catch (err) {
      setFeedback(`❌ 오류: ${err.message}\n\n네트워크나 환경변수를 확인해봐.`);
    } finally {
      setLoadingFeedback(false);
    }
  }, [board, activeThreats, threatPlacements]);

  // ──────────────────────────────────────────────
  return {
    // 보드
    board, selectedCell,
    handleCellClick, handleRemoveUnit, clearBoard,
    // 드래그
    dragOverCell, setDragOverCell,
    handlePoolDragStart, handleBoardDragStart, handleDrop, handleDragLeave,
    // 위협
    activeThreats, threatPlacements,
    toggleThreat,
    // AI
    feedback, loadingFeedback,
    handleAnalyze,
    // 파생
    placedCount,
  };
}