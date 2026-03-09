// ─────────────────────────────────────────────
//  UploadZone  (src/components/coach/UploadZone.jsx)
//  이미지 업로드 영역
//  - 파일 선택 / 드래그앤드롭 / Ctrl+V 붙여넣기 지원
//  - 업로드 시 1280px / JPEG 0.7 압축 → base64 크기 감소
//  - 이미지 업로드 후 프리뷰 + 스캔 오버레이
// ─────────────────────────────────────────────
import { useRef, useState, useEffect, useCallback } from 'react';

/** Canvas로 리사이즈 + JPEG 압축 → dataUrl 반환 */
function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX    = 1280;
      const scale  = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = url;
  });
}

/**
 * @param {function} onImage     - (file: File, dataUrl: string) => void
 * @param {string|null} imageUrl - 현재 표시 중인 이미지 dataURL
 * @param {boolean} isScanning   - 스캔 중 오버레이 표시 여부
 */
export default function UploadZone({ onImage, imageUrl, isScanning }) {
  const fileRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = useCallback(async (file) => {
    if (!file?.type.startsWith('image/')) return;
    const dataUrl    = await compressImage(file);
    const compressed = new File(
      [dataUrl],
      file.name.replace(/\.\w+$/, '.jpg'),
      { type: 'image/jpeg' }
    );
    onImage(compressed, dataUrl);
  }, [onImage]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  // 전역 Ctrl+V 붙여넣기
  useEffect(() => {
    const handler = (e) => {
      const item = [...e.clipboardData.items].find(i => i.type.startsWith('image/'));
      if (item) handleFile(item.getAsFile());
    };
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, [handleFile]);

  if (imageUrl) {
    return (
      <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 240 }}>
        <img
          src={imageUrl}
          alt="게임 스크린샷"
          className="w-full object-cover rounded-2xl"
          style={{ maxHeight: 360 }}
        />

        {isScanning && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl"
            style={{ background: '#060B14CC', backdropFilter: 'blur(2px)' }}
          >
            <div
              style={{
                width:          48,
                height:         48,
                borderRadius:   '50%',
                border:         '2px solid #FFD700',
                borderTopColor: 'transparent',
                animation:      'spin 0.8s linear infinite',
              }}
            />
            <span className="text-[12px] font-bold tracking-widest text-[#FFD700] uppercase">
              AI 분석 중…
            </span>
          </div>
        )}

        {!isScanning && (
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute top-3 right-3 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors"
            style={{
              background:     '#060B14CC',
              border:         '1px solid #1E293B',
              color:          '#94A3B8',
              backdropFilter: 'blur(4px)',
            }}
          >
            🔄 재업로드
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>
    );
  }

  return (
    <button
      className="w-full rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200"
      style={{
        minHeight:  240,
        background: drag ? '#FFD70008' : '#0A0F1A',
        border:     `2px dashed ${drag ? '#FFD70066' : '#1E293B'}`,
      }}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => fileRef.current?.click()}
    >
      <span className="text-5xl" style={{ opacity: drag ? 0.8 : 0.3 }}>📸</span>
      <div className="text-center">
        <p className="m-0 text-[14px] font-bold text-[#334155]">
          스크린샷을 여기에 놓거나 클릭
        </p>
        <p className="m-0 text-[11px] text-[#1E3A5F] mt-1">
          또는{' '}
          <kbd
            className="px-1.5 py-0.5 rounded text-[#475569]"
            style={{ background: '#1E293B', border: '1px solid #334155' }}
          >
            Ctrl+V
          </kbd>
          {' '}로 붙여넣기
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </button>
  );
}