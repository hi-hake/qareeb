import { Icon } from '../Icon';

export function Field({ label, icon, error, children }){
  return (
    <label className="block">
      <span className="text-xs font-semibold text-dim block mb-1.5">{label}</span>
      <div className="relative">
        {icon && <span className="absolute start-3 top-[13px] text-dim pointer-events-none z-10"><Icon name={icon} size={15}/></span>}
        {children}
      </div>
      {error && <span className="text-[11px] text-orange block mt-1">{error}</span>}
    </label>
  );
}
