import { useState, useEffect } from 'react';

export function PriceInput({ value, disabled, onCommit, suffix }){
  const [v,setV]=useState(value!=null?String(value):'');
  useEffect(()=>{ setV(value!=null?String(value):''); },[value]);
  const commit=()=>{ const n=parseFloat(v); onCommit(isNaN(n)?0:Math.max(0,Math.round(n*100)/100)); };
  return (
    <div className="pwrap">
      <input type="number" inputMode="decimal" min="0" step="0.25" dir="ltr" disabled={disabled}
        value={v} onChange={e=>setV(e.target.value)} onBlur={commit}
        onKeyDown={e=>{ if(e.key==='Enter') e.currentTarget.blur(); }}
        aria-label="price"/>
      <span className="pwrap-sfx">{suffix}</span>
    </div>
  );
}
