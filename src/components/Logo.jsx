export function Logo({ size=38 }){
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r="21" fill="var(--panel)" stroke="#17303F"/>
        <path d="M22 8c-5.5 0-9.5 4-9.5 9.2C12.5 24.5 22 36 22 36s9.5-11.5 9.5-18.8C31.5 12 27.5 8 22 8z" fill="#FF7A3C"/>
        <path d="M22 8c-5.5 0-9.5 4-9.5 9.2 0 2.2.55 4.7 1.55 7.1 2.1-5.2 5-8 7.95-8 2.95 0 5.85 2.8 7.95 8 1-2.4 1.55-4.9 1.55-7.1C31.5 12 27.5 8 22 8z" fill="#2ACFEA"/>
        <circle cx="22" cy="17.5" r="3.4" fill="#040A10"/>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="logo-ar font-bold text-[26px] text-txt">قريب</span>
        <span className="text-[8.5px] tracking-[0.34em] text-teal font-semibold mt-1">QAREEB</span>
      </span>
    </div>
  );
}
