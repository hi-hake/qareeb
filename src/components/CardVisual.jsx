import { Icon } from './Icon';
import { cardBrand } from '../lib/card';

export function brandMark(num){
  const b = cardBrand(num.replace(/\D/g,''));
  if(b==='visa') return <span dir="ltr" className="text-[11px] font-black italic tracking-wider" style={{color:'#E6EFF3'}}>VISA</span>;
  if(b==='mc') return (
    <span dir="ltr" className="inline-flex items-center">
      <span className="w-3 h-3 rounded-full" style={{background:'#EB001B',opacity:.85}}/>
      <span className="w-3 h-3 rounded-full -ms-1.5" style={{background:'#F79E1B',opacity:.85}}/>
    </span>);
  return <Icon name="credit-card" size={15} className="text-dim"/>;
}

export function CardVisual({ num, name, exp }){
  const digits = num.replace(/\D/g,'');
  const br = cardBrand(digits);
  return (
    <div dir="ltr" className="wcard">
      <div className="flex items-start justify-between">
        <svg width="42" height="31" viewBox="0 0 42 31" aria-hidden="true">
          <rect x="1" y="1" width="40" height="29" rx="5" fill="#D8B24C" stroke="#B8933A"/>
          <path d="M1 9 h12 M29 9 h12 M13 1 v29 M29 1 v29" stroke="#B8933A" strokeWidth="1.3" fill="none"/>
          <rect x="13" y="7" width="16" height="17" rx="3" fill="#E8C36A" stroke="#B8933A"/>
        </svg>
        <Icon name="wifi" size={20} className="text-dim rotate-90" sw={1.8}/>
      </div>
      <div className="wcard-num">{num || '•••• •••• •••• ••••'}</div>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="wcard-lbl">CARD HOLDER</div>
          <div className="wcard-val truncate">{(name||'YOUR NAME').toUpperCase()}</div>
        </div>
        <div className="shrink-0 text-end">
          <div className="wcard-lbl">VALID THRU</div>
          <div className="wcard-val tabular-nums">{exp || 'MM/YY'}</div>
        </div>
        <div className="shrink-0 flex items-center h-full pb-0.5">
          {br==='visa' ? <span className="text-[15px] font-black italic text-[#E6EFF3]">VISA</span>
           : br==='mc' ? (
            <span className="inline-flex items-center">
              <span className="w-4 h-4 rounded-full" style={{background:'#EB001B',opacity:.9}}/>
              <span className="w-4 h-4 rounded-full -ms-2" style={{background:'#F79E1B',opacity:.9}}/>
            </span>)
           : <Icon name="credit-card" size={20} className="text-dim"/>}
        </div>
      </div>
    </div>
  );
}
