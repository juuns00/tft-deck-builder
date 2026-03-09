// ─────────────────────────────────────────────
//  ComponentButton
//  부품 아이템 선택 버튼
// ─────────────────────────────────────────────
import { useState } from 'react';

/**
 * @param {{ id, name, icon }} item
 * @param {boolean}  selected - 선택 여부
 * @param {function} onClick  - 클릭 핸들러
 */
export default function ComponentButton({ item, selected, onClick }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <button
      onClick={onClick}
      title={item.name}
      className={`component-btn ${selected ? 'selected' : ''}`}
    >
      {!imgErr ? (
        <img
          src={item.icon}
          alt={item.name}
          onError={() => setImgErr(true)}
          className="w-9 h-9 object-contain"
        />
      ) : (
        <span className="text-2xl">📦</span>
      )}
    </button>
  );
}
