import { NAV_ITEMS } from "../components/layout/NavBar.jsx";

export default function ComingSoon({ path }) {
  const item = NAV_ITEMS.find(n => n.to === path);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="text-5xl">{item?.icon ?? "🚧"}</div>

      <div>
        <div className="text-[20px] font-extrabold text-[#475569] mb-1">
          {item?.label ?? "준비 중"}
        </div>
        <div className="text-[13px] text-[#334155] leading-relaxed max-w-[300px]">
          {item?.desc}
        </div>
      </div>

      {/* 예정 기능 카드 */}
      {item?.preview && (
        <div className="panel mt-2 max-w-[320px] w-full text-left">
          <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-3">
            🔮 예정 기능
          </div>
          <div className="flex flex-col gap-2">
            {item.preview.map(f => (
              <div key={f} className="text-[12px] text-[#334155] flex items-center gap-2">
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[11px] text-[#1E293B] mt-2">
        곧 업데이트 예정입니다
      </div>
    </div>
  );
}